# Grab Morocco - Transport and Delivery Platform

A comprehensive ride-hailing and delivery platform similar to Grab, designed for the Moroccan market. This project provides services for ride booking, food delivery, and package delivery with multi-language support (Arabic, French, English).

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Development](#development)
- [Contributing](#contributing)

## 🎯 Project Overview

Grab Morocco is a full-stack application that connects users with drivers for transportation, food delivery, and package delivery services. The platform supports multiple user roles including customers, drivers, restaurants, and administrators.

### Key Services
- **Ride Hailing**: Book rides across Moroccan cities
- **Food Delivery**: Order from restaurants with fast delivery
- **Package Delivery**: Send packages and goods securely

## ✨ Features

- 🌍 **Multi-language Support**: Arabic (RTL), French, and English
- 👥 **Multiple User Roles**: Customers, Drivers, Restaurants, Admins
- 📱 **Responsive Design**: Mobile-first approach
- 🔐 **Security**: Spring Security integration
- 📊 **Real-time Tracking**: Live ride and delivery tracking
- 💳 **Payment Integration**: Multiple payment methods support
- 🔔 **Notifications**: Real-time notifications system

## 🛠 Tech Stack

### Backend
- **Framework**: Spring Boot 4.0.0
- **Language**: Java 21
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA
- **Security**: Spring Security
- **Build Tool**: Maven
- **Additional**: Lombok, Spring Actuator

### Frontend
- **Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite
- **Routing**: React Router DOM 7.10.1
- **HTTP Client**: Axios
- **State Management**: TanStack React Query
- **Icons**: Lucide React
- **Charts**: Recharts
- **Styling**: CSS

## 📁 Project Structure

```
projetPRPFA/
│
├── backendMMHK/                    # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/mmhk/delivery/
│   │   │   │   ├── controller/     # REST Controllers
│   │   │   │   ├── model/          # Entity Models
│   │   │   │   ├── repository/     # Data Repositories
│   │   │   │   └── MmhkDeliveryBackendApplication.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                   # Test files
│   ├── pom.xml                     # Maven dependencies
│   └── mvnw                        # Maven wrapper
│
├── frontend/                       # React Frontend
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   │   └── driver/            # Driver-specific components
│   │   ├── features/              # Feature modules
│   │   │   ├── admin/             # Admin features
│   │   │   ├── auth/              # Authentication
│   │   │   ├── driver/            # Driver dashboard
│   │   │   ├── notification/      # Notifications
│   │   │   ├── payment/           # Payment handling
│   │   │   ├── restaurant/        # Restaurant features
│   │   │   ├── ride/              # Ride booking
│   │   │   └── user/              # User features
│   │   ├── pages/                 # Page components
│   │   │   └── HomePage.tsx       # Main landing page
│   │   ├── shared/                # Shared utilities
│   │   │   ├── components/        # Shared components
│   │   │   ├── hooks/             # Custom React hooks
│   │   │   └── lib/               # Library utilities
│   │   ├── types/                 # TypeScript type definitions
│   │   ├── utils/                 # Utility functions
│   │   │   └── translations.ts    # i18n translations
│   │   ├── assets/                # Static assets
│   │   │   ├── css/               # Stylesheets
│   │   │   └── images/            # Images and icons
│   │   ├── i18n/                  # Internationalization
│   │   │   └── locales/           # Translation files
│   │   ├── App.tsx                # Main app component
│   │   └── main.tsx               # Entry point
│   ├── public/                    # Public assets
│   ├── package.json               # NPM dependencies
│   ├── vite.config.ts             # Vite configuration
│   └── tsconfig.json              # TypeScript configuration
│
└── README.md                       # This file
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java Development Kit (JDK)**: Version 21 or higher
- **Node.js**: Version 18 or higher
- **npm** or **yarn**: Package manager
- **PostgreSQL**: Version 12 or higher
- **Maven**: Version 3.6+ (or use the included Maven wrapper)
- **Git**: For version control

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd projetPRPFA
```

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backendMMHK
```

2. Configure the database in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/grab_morocco
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

3. Create a PostgreSQL database:
```sql
CREATE DATABASE grab_morocco;
```

4. Build the project:
```bash
./mvnw clean install
```

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## 🏃 Running the Application

### Backend

1. Navigate to the backend directory:
```bash
cd backendMMHK
```

2. Run the Spring Boot application:
```bash
./mvnw spring-boot:run
```

Or if you're on Windows:
```bash
mvnw.cmd spring-boot:run
```

The backend will start on `http://localhost:8080` (default Spring Boot port).

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (default Vite port).

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/actuator (if enabled)

## 💻 Development

### Backend Development

- **Package**: `com.mmhk.delivery`
- **Main Class**: `MmhkDeliveryBackendApplication`
- **Build**: `./mvnw clean install`
- **Run Tests**: `./mvnw test`

### Frontend Development

- **Entry Point**: `src/main.tsx`
- **Main Component**: `src/App.tsx`
- **Development Server**: `npm run dev`
- **Build for Production**: `npm run build`
- **Preview Production Build**: `npm run preview`
- **Linting**: `npm run lint`

### Code Structure Guidelines

#### Backend
- **Controllers**: Handle HTTP requests and responses
- **Models**: Define entity classes and data structures
- **Repositories**: Data access layer using Spring Data JPA
- **Services**: Business logic layer (to be implemented)

#### Frontend
- **Pages**: Top-level page components
- **Features**: Feature-specific modules organized by domain
- **Components**: Reusable UI components
- **Utils**: Helper functions and utilities
- **Types**: TypeScript type definitions

### Internationalization (i18n)

The application supports three languages:
- **Arabic (ar)**: Right-to-left (RTL) layout
- **French (fr)**: Left-to-right (LTR) layout
- **English (en)**: Left-to-right (LTR) layout

Translations are managed in `frontend/src/utils/translations.ts`.

## 🔧 Configuration

### Backend Configuration

Edit `backendMMHK/src/main/resources/application.properties` to configure:
- Database connection
- Server port
- Security settings
- Actuator endpoints

### Frontend Configuration

- **Vite Config**: `frontend/vite.config.ts`
- **TypeScript Config**: `frontend/tsconfig.json`
- **ESLint Config**: `frontend/eslint.config.js`

## 📝 API Endpoints

API endpoints will be documented here as they are implemented. The backend uses RESTful conventions.

## 🧪 Testing

### Backend Tests
```bash
cd backendMMHK
./mvnw test
```

### Frontend Tests
(To be implemented)

## 🤝 Contributing

1. Create a feature branch from `main`:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:
```bash
git commit -m "Add: your feature description"
```

3. Push to the branch:
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request

### Code Style

- **Backend**: Follow Java naming conventions and Spring Boot best practices
- **Frontend**: Follow React and TypeScript best practices
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## 📄 License

This project is part of a final year project (projet de fin d'année).

## 👥 Team

Add your team members here.

## 📞 Support

For questions or issues, please open an issue in the repository.

---

**Note**: This is an active development project. Some features may be in progress or planned for future implementation.
