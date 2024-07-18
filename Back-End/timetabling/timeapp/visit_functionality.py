from . models import Visit, Institution
def visits_per_institution():
    '''' Used to analyse institution activity i.e most active institutions'''
    visits=Visit.objects.all()
    institutions = Institution.objects.all()
    activity_dict = {}
    for institution in institutions:
        for visit in visits:
            if visit.institution == institution:
                if institution.name in activity_dict:
                    activity_dict[institution.name] += 1
                else:
                    activity_dict[institution.name] = 1    

    return activity_dict

def visits_per_table():
    '''
        Used to analyse table activity
    '''
    # tables=["course", "department", "instructor", "room", "stream", "timetable", "lesson","comment"] 
    tables=["Course", "Department", "Instructor", "Room", "Stream", "Timetable", "Lesson",] 
    visits=Visit.objects.all()
    activity_dict = {}
    for table in tables:
        for visit in visits:
            if visit.table_name == table:
                if table in activity_dict:
                    activity_dict[table] += 1
                else:
                    activity_dict[table] = 1
    return activity_dict
def visits_per_action():
    '''
        Used to analyse actions of visits
    '''
    visits=Visit.objects.all()
    actions = {}
    for visit in visits:
        if visit.action in actions:
            actions[visit.action] += 1
        else:
            actions[visit.action] = 1
    return actions

def visits_per_daypart():
    '''
        Used to analyse time of visits, whether night, morning, evening or afternoon
    '''
    visits=Visit.objects.all()
    day_parts = {}
    for visit in visits:
        if visit.time.hour < 12 and visit.time.hour > 6:
            if day_parts.get("morning"):
                day_parts["morning"] += 1
            else:
                day_parts["morning"] = 1
        elif visit.time.hour < 18 and visit.time.hour > 12:
            if day_parts.get("afternoon"):
                day_parts["afternoon"] += 1
            else:
                day_parts["afternoon"] = 1
        elif visit.time.hour < 20 and visit.time.hour > 18:
            if day_parts.get("evening"):
                day_parts["evening"] += 1
            else:
                day_parts["evening"] = 1
        elif visit.time.hour < 24 and visit.time.hour > 20:
            if day_parts.get("night"):
                day_parts["night"] += 1
            else:
                day_parts["night"] = 1

    return day_parts

