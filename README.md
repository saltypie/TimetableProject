# Timetabulous: Automatic Timetable generating application.

This project is licensed under the MIT license
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Introduction

Timetabulous is a timetable creation application that is intended to ease the challenges of timetable creation faced in educational institutions. The application will use the genetic algorithm to allow university administrators to design clash-free timetables by providing the system with constraints, namely Lecturer times, rooms, total hours for lessons and Subjects available. The application also aims to reduce the chance of errors made by keeping members of the system current and up to date with each other via communication channels focussed on the scheduling tasks of the institutions.

## Getting Started
The following are the base requirements before installation and setup of the project. Different Operating Systems downloads have been provided in the links.

- Python >=3.11 (https://www.python.org/downloads/)

	This is the main language used in the backend programming.

- Node js >= (https://nodejs.org/en/download/package-manager)

	It provides a runtime environment that allows the running of JavaScript code outside of a web browser.

- pgAdmin (https://www.pgadmin.org/download/)

	It helps in  PostgreSQL database administration

- postgresql (https://www.postgresql.org/download/)

	It is the database where the data will be stored.

- Git (https://git-scm.com/downloads)

	It is for version control

## Environment and Repository Setup
Ensure all the commands below are executed.
To begin the setup to your device, move to the directory in which you would like to clone your project, e.g.,

     C:\Projects
Start with cloning the project to your local repository.

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

## Database Setup
Follow the following steps to set up the database

  - Create a .env file in the Back-End folder
  
  - Set the env file details according to env_guide.txt
 
  - Create a database with the same name in pgAdmin4

Lastly, create a superuser by using the command below

  	python manage.py create superuser
    
## Running the Application
To run the application type the command below

	Python3 manage.py runserver

Navigate to the frontend and run it.

	 cd Front-End
	 npm run
Then paste the following url in the browser and you are ready to begin.

	http://localhost:3000/LandingPage
### Input and Output
The application's main aim is to generate a timetable which does not have clashes. The input includes rooms, lecturers, sections and subjects while the output expected is a timetable.
 
## Structure

	Project/
	.
	├── Back-End
	│   └── timetabling
	│       ├── media
	│       │   └── images
	│       ├── timeapp
	│       │   ├── _pycache_
	│       │   └── migrations
	│       │       └── _pycache_
	│       └── timetabling
	│           └── _pycache_
	└── Front-End
	|    └── frontend
	|         ├── node_modules
	|         ├── public
	|         └── src
	|             ├── components
	|             │   ├── admincomponents
	|             │   ├── coursecomponents
	|             │   ├── navigation
	|             │   ├── photos
	|             │   ├── reusable
	|             │   └── timetable
	|             ├── css
	|             └── images
	|                 ├── brand
	|                 ├── cards
	|                 ├── country
	|                 ├── cover
	|                 ├── icon
	|                 ├── logo
	|                 ├── product
	|                 ├── task
	|                 └── user
 	├── README.md            
	 └── ...

	
## Contact Us
Contact us at @ loius.gacho@strathmore.edu/philip.miroga@strathmore.edu

