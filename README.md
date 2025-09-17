# Subscription Tracker Full-Stack Web Application

A modern, multi-user web application designed to help users track their recurring subscriptions, manage expenses, and gain insights into their spending habits through data visualization and AI-powered analysis.

## ✨ Core Features

* **Secure User Authentication**: Stateless authentication using Google OAuth 2.0 and JSON Web Tokens (JWTs).
* **Full CRUD Functionality**: Users can create, read, update, and delete their own subscription records securely.
* **Interactive Dashboard**: A responsive dashboard providing an at-a-glance overview of subscriptions.
* **Data Visualization**: An interactive pie chart breaks down monthly expenses by category.
* **Upcoming Bills**: A dedicated card shows subscriptions due for payment in the next 30 days.
* **AI-Powered Insights**: Personalized textual analysis of spending habits using Google's Gemini AI.
* **Sorting & Filtering**: Users can easily sort the subscription table by cost or date to better analyze their data.

## 🚀 Technology Stack

This project is built with a modern, separated frontend and backend architecture.

### Backend (`subscription-tracker-api`)
* **Language/Framework**: Java 17+ with Spring Boot 3
* **Security**: Spring Security (OAuth 2.0, JWT)
* **Database**: PostgreSQL (Containerized with Docker)
* **Data Access**: Spring Data JPA / Hibernate
* **Build Tool**: Maven
* **Deployment**: Dockerfile included for containerization.

### Frontend (`subscription-tracker-ui`)
* **Language/Framework**: JavaScript with React
* **UI Library**: MUI (Material-UI) for a professional, responsive design.
* **Charting**: Recharts for data visualization.
* **Build Tool**: Vite
* **API Communication**: Axios with interceptors for auth handling.

## ⚙️ Getting Started - Local Setup

Follow these instructions to get the project running on your local machine.

### Prerequisites

* [Java JDK 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) or later
* [Apache Maven](https://maven.apache.org/download.cgi)
* [Node.js](https://nodejs.org/en/) (v18 or later recommended)
* [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose
* [Git](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone [[https://github.com/your-username/subscription-tracker-fullstack.git]
cd subscription-tracker-fullstack
```

### 2. Backend Setup (`subscription-tracker-api`)

1.  **Start the Database:**
    Navigate to the `subscription-tracker-api` directory and run the PostgreSQL database using Docker.
    ```bash
    cd subscription-tracker-api
    docker run --name subscription-db -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_USER=youruser -e POSTGRES_DB=subscription_tracker -p 5432:5432 -d postgres
    ```
    *This command starts a PostgreSQL container. Replace `yourpassword` and `youruser` with your desired credentials.*

2.  **Configure Application Properties:**
    In `src/main/resources/`, rename `application.properties.example` to `application.properties` (or create it) and fill in the details. **Do not commit your actual `application.properties` file.**
    ```properties
    # Database Configuration
    spring.datasource.url=jdbc:postgresql://localhost:5432/subscription_tracker
    spring.datasource.username=youruser
    spring.datasource.password=yourpassword
    spring.jpa.hibernate.ddl-auto=update

    # Google OAuth2 Credentials
    spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
    spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET

    # JWT Secret Key (use a long, random string)
    app.jwt.secret=YOUR_VERY_SECRET_JWT_KEY
    app.jwt.expiration-ms=86400000 # 24 hours

    # Frontend URL for redirects after login
    app.oauth2.redirect-uri=http://localhost:5173/oauth2/redirect
    ```

3.  **Run the Backend:**
    From the `subscription-tracker-api` directory, run the Spring Boot application.
    ```bash
    mvn spring-boot:run
    ```
    The API will be available at `http://localhost:8080`.

### 3. Frontend Setup (`subscription-tracker-ui`)

1.  **Navigate and Install Dependencies:**
    Open a new terminal window and navigate to the frontend directory.
    ```bash
    cd ../subscription-tracker-ui 
    npm install
    ```

2.  **Configure Environment Variables:**
    Create a file named `.env.local` in the `subscription-tracker-ui` root directory and add the following:
    ```
    VITE_API_BASE_URL=http://localhost:8080
    ```

3.  **Run the Frontend:**
    ```bash
    npm run dev
    ```
    The React application will be available at `http://localhost:5173`.

## 🐳 Deployment

The backend is fully containerized. A `Dockerfile` is provided to build a production-ready image of the Spring Boot application. This makes it easy to deploy on services like Google Cloud Run, AWS ECS, or any platform that supports Docker containers.

The `cloudbuild.yaml` file is configured for automated builds and deployments using Google Cloud Build.

---
*This README was generated with guidance from Gemini.*

