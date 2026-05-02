
# Academic Appointment Management System – Frontend

## About the Project

This repository contains the Vue frontend of a web-based information system developed as part of a diploma thesis.

The system supports the management of academic appointments for Year Lead Professors (PPA) and Teaching Assistant Students (AA) at Universidad Central “Marta Abreu” de Las Villas.

The application allows authorized users to register, review, consult, and manage appointment-related information, supporting the generation and historical consultation of official academic documents.

## Main Features

- User authentication
- Role-based interface
- Management of Year Lead Professor appointments
- Management of Teaching Assistant Student appointments
- Ratification and removal workflows
- Document generation support
- Historical consultation of records
- Search and filtering
- Administrative dashboard
- Integration with Laravel REST API

## User Roles

- Department Head
- Teaching Vice Dean
- Dean

## Technologies Used

- Vue.js
- Vite
- JavaScript
- Axios
- Tailwind CSS
- Laravel REST API backend
- MySQL database

## System Context

This frontend is part of a client-server web application.

The Vue client consumes services from a Laravel REST API. The backend manages the business logic, authentication, data validation, document generation, and persistence.

## Project Structure

```txt
src/
  assets/
  components/
  views/
  router/
  services/
````

## Installation

Clone the repository:

```bash
git clone https://github.com/dayanarojasdrp/vue-app-git-github.git
cd vue-app-git-github
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## API Configuration

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8000/api
```

## Thesis Purpose

The purpose of this system is to centralize information, reduce manual work, improve traceability, and support the generation of official academic resolutions related to PPA and AA appointments.

## Future Improvements

* Improve integration with institutional user services
* Strengthen role validation
* Improve responsive design
* Add more automated tests
* Improve accessibility
* Add deployment documentation

## Author

Developed by Dayana Rojas


