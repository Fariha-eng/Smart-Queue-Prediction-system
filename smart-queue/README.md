University of Sialkot
Department of Software Engineering

Smart Queue Management System
Semester Project — Deliverable 1: Client-Side Architecture Report

Submitted by: Shiza Butt (23010101-047) & Fariha Qaleem (23010101-103)
Submitted to: Sir Museb Khalid
Submission Date: 2-07-2026
		 
	TOTAL GRADE POINT 	10 
 	 
	GRADE POINT 	 
ALLOCATED 
 	 
 
ASSESSOR’S COMMENTS  
 
                         **Deliverable 1: Client-Side Architecture**

INTRODUCTION
Hospitals and clinics that rely on manual, first-come-first-served queues often create long, unpredictable waiting times for patients and disorganised patient flow for doctors. The Smart Queue Management System addresses this problem by giving patients a simple way to see available doctors, generate a digital token, and monitor their live position in the queue, while giving doctors a dashboard to call the next patient and reset the queue at the end of a session.
This deliverable focuses exclusively on the client-side of the application. The goal was to fully architect and implement the frontend using Vue 3 and Vite before any backend service is introduced, so that the interface, navigation, and component structure can be validated independently using local, in-memory and localStorage-based data.
TECHNOLOGY STACK
The client application was built with the following technologies:
•	Vue 3 (Composition API with <script setup>) — core UI framework
•	Vite — development server and build tool
•	Vue Router 4 — client-side SPA routing and navigation guards
•	Bootstrap 5 — layout grid, form styling, and UI components
1.	SINGLE PAGE APPLICATION ROUTING
Vue Router is used to define separate routes for each major feature of the system. Every route is linked to a dedicated Vue component, making the application modular and easy to maintain. The application initially redirects users from the root path (/) to the login page (/login). After successful authentication, users can access different pages according to their role. Patients can navigate to the Doctor List, Book Token, and Queue Status pages, while doctors can access the Doctor Dashboard. Role-based access is implemented using the meta property and navigation guards.
Navigation between pages is performed using <RouterLink>, while <RouterView> is responsible for displaying the currently active component without refreshing the browser.
## code1
![code1](screenshots/picture1.png)
Routes	Purpose
/login	User login page for secure authentication
/register	New user registration page
/doctor	Display available doctor and their details
/book-token	Book a queue token for a selected doctor
/queue-status	View current queue position and token status
/doctor-dashboard	Doctor dashboard for managing patients and queue information
 
The screenshot provides evidence of the router configuration.
2.	MODULAR COMPONENT ARCHITECTURE
The Queue Management System follows a Modular Component Architecture in Vue 3. The application is divided into separate views and reusable components instead of writing all the code in a single file. This structure improves code readability, reusability, and maintenance.

Components/ (Reusable Components)
•	NavBar.vue → Handles navigation between different pages
•	DoctorCard.vue→ Displays doctor details in card format
•	PasswordField.vue → Reusable input field for password with show/hide feature
•	QueueStatusCard.vue → Shows patient queue status in a structured layout
•	TokenCounter.vue → Displays current token number in the queue
Views/(Main Pages)
•	Login.vue →User authentication (login page). 
•	Register.vue →New user registration page. 
•	DoctorList.vue→ Displays list of available doctors. 
•	BookToken.vue →Allows patients to book a queue token. 
•	QueueStatus.vue →Shows current queue position and status. 
•	DoctorDashboard.vue → Dashboard for doctors to manage patients and queue system.
⚙️ Core Files
•	router/index.js →Defines application routes and navigation logic using Vue Router. 
•	App.vue → Root component of the application. It Contains layout and <RouterView>. 
•	main.js →Entry point of Vue application. It Initializes and mounts the app. 
•	index.html →Main HTML file where Vue app is injected. 
•	vite.config.js→ Configuration file for Vite build tool.

3.	Inter-Component Communication (Props & Custom Emits)
## code2
![code2](screenshots/picture2.png)
## code3
![code3](screenshots/picture3.png)
## code4
![code4](screenshots/picture4.png)
## code5
![code5](screenshots/picture5.png)
## code6
![code6](screenshots/picture6.png)

4.	SCREENSHOTS
Patient Side

## code7
![code7](screenshots/picture7.png)


## code8
![code8](screenshots/picture8.png)

## code9
![code9](screenshots/picture9.png)

## code10
![code10](screenshots/picture10.png)

## code11
![code11](screenshots/picture11.png)

Doctor Side
## code12
![code12](screenshots/picture12.png)

## code13
![code13](screenshots/picture13.png)





When the Next Patient button is clicked, the current patient token number is incremented by one, indicating that the next patient in the queue is now being served.
When the Reset Queue button is clicked, the queue is reset, and the current token number returns to 1, starting the queue from the beginning.

5.	ARCHITECTURE TREE
## code14
![code14](screenshots/picture14.PNG)

                            **Deliverable 2: Server-Side Architecture**

This backend was developed using Express.js and MongoDB to support the Vue.js frontend. The backend handles API requests, stores data in MongoDB, manages authentication, and performs CRUD operations for doctors, patients, admins and tokens.

**1.	Technologies Used**

Node.js → Used as the runtime environment to execute the backend application.

Express.js → framework used to build the REST API server and handle routes.

MongoDB → Used as NoSQL database to store the application data.

Mongoose → Used to create database schemas and interact with MongoDB easily.

JWT (JSON Web Token) → Used to authenticate users and secure protected routes.

bycryptjs → Used to hash user passwords before storing them in the database.

dotenv → Used to securely manage environment variables like database URLs and secret keys.

CORS →Used to allow secure communication between the Vue.js frontend and Express.js backend.

**2.Backend Structure**

The server contains config, middleware, models, routes and server.js. The config folder contains the database connection. Models define MongoDB collections. Routes contain API endpoints. Middleware is used for authentication and role checking.

**3.Database Connection **

The application connects to MongoDB through Mongoose, with the connection string stored in the .env file as MONGO_URI. We wrote a separate db.js file containing a connectDB() function instead of putting the connection code directly in server.js, since this is a common best practice that keeps the connection logic reusable and easy to find. The function is asynchronous because mongoose.connect() returns a promise. Inside a try/catch block, the app connects using the MONGO_URI, if the connection fails, the error is logged and process.exit(1) is called so the server does not start running with a broken database connection. This way, if something is wrong with the database (wrong URI, network issue, etc.), the problem is caught immediately instead of the app silently failing later.

## code15
![code15](screenshots/picture15.PNG)

**4.Database Schema (Models)**

Admin → The Admin model stores the details of system administrators. Administrators are responsible for managing the overall system, including adding or managing doctors and monitoring the queue management process. Every administrator has unique login credentials to ensure that only authorized users can access administrative features. Passwords are stored in encrypted form to improve security.

Doctor → The Doctor model stores all information related to doctors available in the system. Patients can view this information before selecting a doctor for token generation. Besides authentication details, the model also stores the doctor's specialization, which helps patients choose the appropriate doctor according to their medical needs.

Patient → The Patient model stores the details of registered patients. Patients create an account before accessing the queue management system. Their information is used for authentication, queue management, and maintaining patient records. Password encryption ensures that login credentials remain secure.

Token → The Token model manages the digital queue system. Whenever a patient books an appointment, a new token is generated and stored in this collection. Each token is linked with both the selected doctor and the patient using MongoDB references (ObjectId). The model also keeps track of the current status of the token, making it possible to monitor whether the patient is waiting, currently being served, or has completed the visit.


## code16
![code16](screenshots/picture16.PNG)

**5.Authentication & Authorization**

JWT authenticates users. auth.js verifies tokens while role.js checks user roles before allowing access to protected routes.

**6.API routes/ Endpoints**

Endpoints	      Method	         Purpose
/api/register	  POST	         Register new user
/api/login	      POST	             Login
/api/doctors	  GET	         Retrieve doctor
/api/tokens	      POST	          Create token
/api/tokens	      GET	          Retrieve tokens
/api/admin	      GET	              Admin 
 
**7.Security Practice**

Several security mechanisms were implemented to protect the backend. User passwords are hashed using bcryptjs before being saved to MongoDB so that original passwords cannot be recovered. Sensitive configuration values such as the MongoDB connection string and JWT secret are stored inside the .env file instead of hardcoding them in the source code. JWT authentication ensures that only authenticated users can access protected APIs, while role-based authorization restricts administrative functions to authorized users only. CORS is enabled to allow secure communication between the frontend and backend while preventing unauthorized cross-origin requests. 

**ARCHITECTURE TREE (With Backend)**

## code17
![code17](screenshots/picture17.PNG)

**Conclusion**

The Smart Queue Management System was successfully developed by integrating both the frontend and backend technologies. The frontend provides an interactive and user-friendly interface for patients and doctors, while the backend efficiently handles authentication, database management, API requests, and queue operations. By combining Vue.js, Express.js, and MongoDB, the system offers a secure and organized solution for managing hospital queues. Overall, this project meets its objectives by improving the appointment process, reducing manual effort, and providing a scalable foundation for future enhancements.


