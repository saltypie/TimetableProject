# Timetabulous: Automatic Timetable generating application.

This project is licensed under the MIT license
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Introduction

Timetabulous is a timetable creation application that is intended to ease the challenges of timetable creation faced in educational institutions. The application will use the genetic algorithm to allow university administrators to design clash-free timetables by providing the system with constraints, namely Lecturer times, rooms, total hours for lessons and Subjects available. The application also aims to reduce the chance of errors made by keeping members of the system current and up to date with each other via communication channels focussed on the scheduling tasks of the institutions.

## Getting Started
The following are the base requirements before installation and setup of the project.

- Python >=3.11

This is the main language used in the backend programming.

- Node js >=

It provides a runtime environment that allows the running of JavaScript code outside of a web browser.

- pgAdmin

It helps in  PostgreSQL database administration

- postgresql

It is the database where the data will be stored.

### Environment and Repository Setup
To begin the setup to your device. Move to the directory in which you would like to clone your project, e.g.,

     C:\Projects
Begin with cloning the project to your local repository.

     git clone https://github.com/Philip-O-M/TimetableProject.git

Press Enter to create your local clone.
Move to the timetable project directory, then navigate to the Front-End folder.

      cd TimetableProject/Front-End

Install the required frontend packages used in javascript programming and Nodejs.

      npm i

Navigate to the backend directory

      cd ../Back-End

Setup the virtual environment

      python -m venv venv

Instal the backend requirements

      pip install -r requirements.txt

### Database Setup
Follow the following steps to set up the database

  - Create a .env file in the Back-End folder
  
  - Set the env file details according to env_guide.txt
 
  - Create a database with the same name in pgAdmin4

Lastly, create a superuser by using the command below

  	python manage.py create superuser
    
## Running the Application
To run the application type the command below

	Python3 manage.py runserver

Navigate to the frontend 

	 cd Front-End
	 npm run
Then paste the following url in the browser 

	http://localhost:3000/LandingPage

