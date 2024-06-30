from django.shortcuts import render
from .models import *
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
import random
import json

# Constants
POPULATION_SIZE = 9
NUM_ELITE_SCHEDULES = 1
TOURNAMENT_SELECTION_SIZE = 3
MUTATION_RATE = 0.05

class Data:
    def __init__(self, institution):
        self.rooms = Room.objects.filter(institution=institution)
        self.meeting_times = MeetingTime.objects.filter(institution=institution)
        self.instructors = UserData.objects.filter(institution=institution, role__name="instructor")
        self.courses = Course.objects.filter(institution=institution)
        self.departments = Department.objects.filter(institution=institution)

    def get_rooms(self):
        return self.rooms

    def get_departments(self):
        return self.departments

    def get_instructors(self):
        return self.instructors

    def get_courses(self):
        return self.courses

    def get_meeting_times(self):
        return self.meeting_times

class Class:
    def __init__(self, id, department, stream, course):
        self.class_id = id
        self.department = department
        self.course = course
        self.instructor = None
        self.meeting_time = None
        self.room = None
        self.stream = stream

    def get_id(self):
        return self.class_id

    def get_department(self):
        return self.department

    def get_course(self):
        return self.course

    def get_instructor(self):
        return self.instructor

    def get_meeting_time(self):
        return self.meeting_time

    def get_stream(self):
        return self.stream

    def get_room(self):
        return self.room

    def set_instructor(self, instructor):
        self.instructor = instructor

    def set_meeting_time(self, meetingTime):
        self.meeting_time = meetingTime

    def set_room(self, room):
        self.room = room

class Schedule:
    def __init__(self, data):
        self.data = data
        self.classes = []
        self.numberOfConflicts = 0
        self.fitness = -1
        self.classNumb = 0
        self.isFitnessChanged = True

    def get_classes(self):
        self.isFitnessChanged = True
        return self.classes

    def get_fitness(self):
        if self.isFitnessChanged:
            self.fitness = self.calculate_fitness()
            self.isFitnessChanged = False
        return self.fitness

    def initialize(self):
        streams = Stream.objects.all()
        for stream in streams:
            department = stream.department
            num_lessons = stream.lessons_per_week
            courses = department.courses.all()
            if num_lessons <= len(self.data.get_meeting_times()):
                for course in courses:
                    for i in range(num_lessons // len(courses)):
                        crs_instructors = course.instructors.all()
                        newClass = Class(self.classNumb, department, stream.id, course)
                        self.classNumb += 1
                        newClass.set_meeting_time(self.data.get_meeting_times()[random.randrange(0, len(self.data.get_meeting_times()))])
                        newClass.set_room(self.data.get_rooms()[random.randrange(0, len(self.data.get_rooms()))])
                        newClass.set_instructor(crs_instructors[random.randrange(0, len(crs_instructors))])
                        self.classes.append(newClass)
            else:
                num_lessons = len(self.data.get_meeting_times())
                for course in courses:
                    for i in range(num_lessons // len(courses)):
                        crs_instructors = course.instructors.all()
                        newClass = Class(self.classNumb, department, stream.id, course)
                        self.classNumb += 1
                        newClass.set_meeting_time(self.data.get_meeting_times()[random.randrange(0, len(self.data.get_meeting_times()))])
                        newClass.set_room(self.data.get_rooms()[random.randrange(0, len(self.data.get_rooms()))])
                        newClass.set_instructor(crs_instructors[random.randrange(0, len(crs_instructors))])
                        self.classes.append(newClass)
        return self

    def calculate_fitness(self):
        self.numberOfConflicts = 0
        classes = self.get_classes()
        num_classes = len(classes)
        for i in range(num_classes):
            class_to_inspect1 = classes[i]
            if class_to_inspect1.room.seating_capacity < int(class_to_inspect1.course.max_numb_students):
                self.numberOfConflicts += 1
            for j in range(i + 1, num_classes):
                class_to_inspect2 = classes[j]
                if class_to_inspect2.meeting_time == class_to_inspect1.meeting_time:
                    if class_to_inspect2.room == class_to_inspect1.room:
                        self.numberOfConflicts += 1
                    if class_to_inspect2.instructor == class_to_inspect1.instructor:
                        self.numberOfConflicts += 1
        print(f"Number of Conflicts: {self.numberOfConflicts}")
        return 1 / (self.numberOfConflicts + 1)

class Population:
    def __init__(self, size, data):
        self.size = size
        self.data = data
        self.schedules = [Schedule(self.data).initialize() for _ in range(size)]

    def get_schedules(self):
        return self.schedules

class GeneticAlgorithm:
    def evolve(self, population):
        return self.mutate_population(self.crossover_population(population))

    def crossover_population(self, population):
        crossover_population = Population(0, population.data)
        for i in range(NUM_ELITE_SCHEDULES):
            crossover_population.get_schedules().append(population.get_schedules()[i])
        i = NUM_ELITE_SCHEDULES
        while i < POPULATION_SIZE:
            schedule1 = self.select_tournament_population(population).get_schedules()[0]
            schedule2 = self.select_tournament_population(population).get_schedules()[0]
            crossover_population.get_schedules().append(self.crossover_schedule(schedule1, schedule2))
            i += 1
        return crossover_population

    def mutate_population(self, population):
        for i in range(NUM_ELITE_SCHEDULES, POPULATION_SIZE):
            self.mutate_schedules(population.get_schedules()[i])
        return population

    def mutate_schedules(self, schedule_to_mutate):
        schedule = Schedule(schedule_to_mutate.data).initialize()
        for i in range(len(schedule_to_mutate.get_classes())):
            if MUTATION_RATE > random.random():
                schedule_to_mutate.get_classes()[i] = schedule.get_classes()[i]
        return schedule_to_mutate

    def crossover_schedule(self, parent1, parent2):
        crossover_schedule = Schedule(parent1.data).initialize()
        for i in range(len(crossover_schedule.get_classes())):
            if random.random() > 0.5:
                crossover_schedule.get_classes()[i] = parent1.get_classes()[i]
            else:
                crossover_schedule.get_classes()[i] = parent2.get_classes()[i]
        return crossover_schedule

    def select_tournament_population(self, population):
        tournament_population = Population(0, population.data)
        for _ in range(TOURNAMENT_SELECTION_SIZE):
            tournament_population.get_schedules().append(population.get_schedules()[random.randint(0, POPULATION_SIZE - 1)])
        tournament_population.get_schedules().sort(key=lambda x: x.get_fitness(), reverse=True)
        return tournament_population

def add_sched_to_db(schedule,requester):
    classes = schedule.get_classes()
    # user_data_instance = UserData.objects.get(id=requester.id)
    created_table = Timetable.objects.create(author=requester, institution=requester.institution)
    for lesson in classes:
        Lesson.objects.create(
            department=lesson.get_department(),
            course=lesson.get_course(),
            instructor=lesson.get_instructor(),
            meeting_time=lesson.get_meeting_time(),
            room=lesson.get_room(),
            stream=Stream.objects.get(id=lesson.get_stream()),
            timetable=created_table
        )
    return created_table

def generate_timetables(requester):
    institution = requester.institution
    data = Data(institution)
    population = Population(POPULATION_SIZE, data)
    generation_count = 0
    population.get_schedules().sort(key=lambda x: x.get_fitness(), reverse=True)
    genetic_algorithm = GeneticAlgorithm()
    schedule = population.get_schedules()[0]
    print("Initial fitness: ", schedule.get_fitness())
    while population.get_schedules()[0].get_fitness() != 1 and generation_count < 300:
        generation_count += 1
        print("Generation:", generation_count)
        population = genetic_algorithm.evolve(population)
        population.get_schedules().sort(key=lambda x: x.get_fitness(), reverse=True)
        schedule = population.get_schedules()[0]
        print("Conflicts:", schedule.numberOfConflicts)
    created_objects = {}
    created_objects["created_schedule"] = add_sched_to_db(schedule,requester)
    created_objects["created_classes"] = Lesson.objects.filter(timetable=created_objects["created_schedule"])
    return created_objects

