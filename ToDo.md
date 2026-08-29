# Job Application Tracker - Complete Project Documentation

## Table of Contents

1. [Project Overview](https://claude.ai/chat/e67d0845-71a1-47ec-962a-b7ba8bb33d20#project-overview)
2. [Tech Stack](https://claude.ai/chat/e67d0845-71a1-47ec-962a-b7ba8bb33d20#tech-stack)
3. [Architecture & Design Decisions](https://claude.ai/chat/e67d0845-71a1-47ec-962a-b7ba8bb33d20#architecture--design-decisions)
4. [Database Schema](https://claude.ai/chat/e67d0845-71a1-47ec-962a-b7ba8bb33d20#database-schema)
5. [Project Structure](https://claude.ai/chat/e67d0845-71a1-47ec-962a-b7ba8bb33d20#project-structure)
6. [Phase-wise Development Plan](https://claude.ai/chat/e67d0845-71a1-47ec-962a-b7ba8bb33d20#phase-wise-development-plan)
7. [Feature Checklist](https://claude.ai/chat/e67d0845-71a1-47ec-962a-b7ba8bb33d20#feature-checklist)
8. [Configuration Files](https://claude.ai/chat/e67d0845-71a1-47ec-962a-b7ba8bb33d20#configuration-files)
9. [API Endpoints](https://claude.ai/chat/e67d0845-71a1-47ec-962a-b7ba8bb33d20#api-endpoints)

---

## Project Overview

**Name**: Job Application Tracker  
**Purpose**: Personal project to track job applications with reminders, contact management, and external integrations  
**Learning Goals**: Full-stack development with modern Spring Boot + React architecture

---

## Tech Stack

### Backend

- **Framework**: Spring Boot 3.x (Java 21)
- **Database**: PostgreSQL 16 (local Docker → hosted later)
- **Cache**: Redis (JWT blocklist, rate limiting)
- **Messaging**: Apache Kafka (notifications - Phase 3)
- **Security**: JWT-based authentication, BCrypt password hashing
- **ORM**: Spring Data JPA (Hibernate)

### Frontend

- **Framework**: React 18+
- **UI Library**: shadcn/ui
- **Build Tool**: Vite (or Create React App)
- **HTTP Client**: Axios
- **State Management**: React Context / React Query (decide later)

### DevOps

- **Containerization**: Docker (Postgres, Redis, Kafka)
- **Orchestration**: Docker Compose
- **Version Control**: Git

---

## Architecture & Design Decisions

### 1. **Authentication Strategy**

- JWT-based stateless authentication
- Access tokens (short-lived: 15 min)
- Refresh tokens (long-lived: 7 days, stored in DB)
- Redis for JWT blocklist (logout/revoke tokens)

### 2. **Password Storage**

- `password_hash` is **nullable** to support OAuth-only users
- If Google OAuth user tries email/password login → detect via `auth_provider` field and prompt to use Google
- BCrypt hashing for local passwords

### 3. **Primary Keys**

- **UUID** for all tables (trade-off acknowledged):
    - ✅ Unique across distributed systems
    - ✅ Non-sequential (security)
    - ❌ Larger than `BIGINT` (16 bytes vs 8 bytes)
    - ❌ Harder to debug (not human-readable)

### 4. **Contacts Design**

- Contacts are **per user**, NOT per application
- Same recruiter can be referenced across multiple applications
- Link via `application_contacts` junction table (many-to-many)

### 5. **Status Management**

- Application status stored as **ENUM** in database
- Values: `APPLIED`, `SCREENING`, `INTERVIEW`, `OFFER`, `REJECTED`, `WITHDRAWN`
- All status changes tracked in `application_status_history` (audit trail)

---

## Database Schema

### Tables

#### **users**

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),  -- Nullable for OAuth users
    auth_provider VARCHAR(50) NOT NULL,  -- 'LOCAL' or 'GOOGLE'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **refresh_tokens**

```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(512) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### **job_applications**

```sql
CREATE TYPE application_status AS ENUM (
    'APPLIED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN'
);

CREATE TABLE job_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    job_id VARCHAR(255),  -- External job ID (Indeed, Naukri)
    job_url TEXT,
    status application_status NOT NULL DEFAULT 'APPLIED',
    source VARCHAR(100),  -- 'LINKEDIN', 'INDEED', 'NAUKRI', 'REFERRAL', etc.
    notes TEXT,
    salary_range VARCHAR(100),
    location VARCHAR(255),
    applied_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **contacts**

```sql
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    company VARCHAR(255),
    position VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, email)  -- Same contact email per user
);
```

#### **application_contacts** (Junction Table)

```sql
CREATE TABLE application_contacts (
    application_id UUID NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
    contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
    PRIMARY KEY (application_id, contact_id)
);
```

#### **application_status_history**

```sql
CREATE TABLE application_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
    old_status application_status,
    new_status application_status NOT NULL,
    changed_at TIMESTAMP DEFAULT NOW(),
    notes TEXT
);
```

#### **follow_up_reminders**

```sql
CREATE TABLE follow_up_reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
    reminder_date TIMESTAMP NOT NULL,
    message TEXT,
    is_sent BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### **external_integrations**

```sql
CREATE TABLE external_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,  -- 'INDEED', 'NAUKRI'
    api_key_encrypted TEXT,  -- Future: store encrypted credentials
    last_sync TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### **notification_log**

```sql
CREATE TABLE notification_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,  -- 'EMAIL', 'PUSH', 'SMS'
    subject VARCHAR(255),
    message TEXT,
    sent_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'SENT'  -- 'SENT', 'FAILED', 'PENDING'
);
```

---

## Project Structure

```
job-application-tracker/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── applications/
│   │   │   │   ├── ApplicationForm.jsx
│   │   │   │   ├── ApplicationList.jsx
│   │   │   │   └── ApplicationCard.jsx
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── ui/  (shadcn components)
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Applications.jsx
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   └── applicationService.js
│   │   ├── utils/
│   │   │   ├── axiosConfig.js
│   │   │   └── authUtils.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .gitignore
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/jobtracker/api/
│   │   │   │   ├── JobTrackerApplication.java
│   │   │   │   ├── controller/
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── ApplicationController.java
│   │   │   │   │   ├── ContactController.java
│   │   │   │   │   └── ReminderController.java
│   │   │   │   ├── service/
│   │   │   │   │   ├── AuthService.java
│   │   │   │   │   ├── ApplicationService.java
│   │   │   │   │   ├── ContactService.java
│   │   │   │   │   └── ReminderService.java
│   │   │   │   ├── repository/
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   ├── ApplicationRepository.java
│   │   │   │   │   ├── ContactRepository.java
│   │   │   │   │   └── ReminderRepository.java
│   │   │   │   ├── model/
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── JobApplication.java
│   │   │   │   │   ├── Contact.java
│   │   │   │   │   ├── ApplicationStatusHistory.java
│   │   │   │   │   └── FollowUpReminder.java
│   │   │   │   ├── dto/
│   │   │   │   │   ├── RegisterRequest.java
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── AuthResponse.java
│   │   │   │   │   └── ApplicationRequest.java
│   │   │   │   ├── config/
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   └── CorsConfig.java
│   │   │   │   └── security/
│   │   │   │       ├── JwtUtil.java
│   │   │   │       ├── JwtAuthenticationFilter.java
│   │   │   │       └── CustomUserDetailsService.java
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       └── application-dev.yml
│   │   └── test/
│   ├── pom.xml
│   └── .gitignore
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Phase-wise Development Plan

### **Phase 1: MVP (Core Authentication & Basic CRUD) - 4-6 hours**

**Goal**: Get a working app with login and job application tracking

#### Backend Tasks

- [x] Setup Spring Boot project with dependencies
- [x] Configure PostgreSQL connection
- [x] Create `User` entity and repository
- [x] Implement JWT utility class (`JwtUtil`)
- [x] Build `AuthService` with BCrypt password hashing
- [x] Create `POST /auth/register` endpoint
- [x] Create `POST /auth/login` endpoint (return JWT)
- [x] Configure Spring Security filter chain
- [] Create `JobApplication` entity and repository
- [ ] Create `POST /applications` endpoint (JWT protected)
- [ ] Create `GET /applications` endpoint (fetch user's applications)

#### Frontend Tasks

- [ ] Setup React project (Vite + shadcn)
- [ ] Create Register form
- [ ] Create Login form
- [ ] Store JWT in localStorage
- [ ] Create axios interceptor for JWT auth
- [ ] Create Add Application form
- [ ] Display list of applications
- [ ] Basic routing (Login → Dashboard → Applications)

#### Testing

- [ ] Test registration flow
- [ ] Test login and JWT generation
- [ ] Test protected endpoint without token (should fail)
- [ ] Test protected endpoint with valid token (should work)
- [ ] Test adding and fetching applications

---

### **Phase 2: Enhanced Features (Contacts, Status History, Reminders) - 6-8 hours**

**Goal**: Add professional tracking features

#### Backend Tasks

- [ ] Create `Contact` entity and repository
- [ ] Create `ApplicationStatusHistory` entity
- [ ] Implement status change tracking (automatic on update)
- [ ] Create `FollowUpReminder` entity
- [ ] Build reminder CRUD endpoints
- [ ] Add pagination to `GET /applications`
- [ ] Add filtering by status, company, date range
- [ ] Implement soft delete for applications

#### Frontend Tasks

- [ ] Contact management UI
- [ ] Link contacts to applications (many-to-many)
- [ ] Display status history timeline
- [ ] Reminder creation and management
- [ ] Application filters and search
- [ ] Dashboard with statistics (total applied, interviews, etc.)
- [ ] Calendar view for reminders

#### Testing

- [ ] Test contact creation and linking
- [ ] Verify status history is auto-created
- [ ] Test reminder CRUD operations

---

### **Phase 3: Advanced Features (Redis, Notifications, OAuth) - 8-10 hours**

**Goal**: Production-ready features

#### Backend Tasks

- [ ] Setup Redis (Docker)
- [ ] Implement refresh token mechanism
- [ ] Store refresh tokens in database
- [ ] Add JWT to Redis blocklist on logout
- [ ] Rate limiting with Redis
- [ ] Setup Kafka (Docker)
- [ ] Create Kafka producer for reminder notifications
- [ ] Build email notification consumer
- [ ] Implement Google OAuth 2.0
- [ ] Handle OAuth user registration flow

#### Frontend Tasks

- [ ] "Sign in with Google" button
- [ ] Token refresh logic (intercept 401, refresh, retry)
- [ ] Logout functionality (clear tokens)
- [ ] Push notification setup (browser API)
- [ ] Email notification preferences

#### Testing

- [ ] Test refresh token flow
- [ ] Test logout (token should be invalid after)
- [ ] Test Google OAuth login
- [ ] Verify Kafka messages are sent
- [ ] Test email delivery

---

### **Phase 4: External Integrations & Polish - 6-8 hours**

**Goal**: Import from Indeed/Naukri, improve UX

#### Backend Tasks

- [ ] CSV import endpoint for Indeed/Naukri data
- [ ] Parse and validate CSV format
- [ ] Bulk insert applications
- [ ] Browser extension API endpoints (if building extension)
- [ ] Export applications to CSV/PDF

#### Frontend Tasks

- [ ] CSV upload interface
- [ ] Data mapping UI (map CSV columns to fields)
- [ ] Import preview and confirmation
- [ ] Dark mode toggle
- [ ] Responsive design improvements
- [ ] Loading states and error handling
- [ ] Toast notifications

#### Testing

- [ ] Test CSV import with sample data
- [ ] Test export functionality
- [ ] Cross-browser testing

---

## Feature Checklist

### ✅ Phase 1 (MVP)

- [ ] User registration (email + password)
- [ ] User login with JWT
- [ ] Add job application (role, company, status, URL, notes)
- [ ] View all applications (list)
- [ ] Protected routes (frontend)
- [ ] JWT validation (backend filter chain)

### ✅ Phase 2 (Enhanced)

- [ ] Contact management (add/edit/delete contacts)
- [ ] Link contacts to applications
- [ ] Application status dropdown (ENUM)
- [ ] Status change history (automatic audit trail)
- [ ] Follow-up reminders (CRUD)
- [ ] Application search and filters
- [ ] Dashboard with stats

### ✅ Phase 3 (Advanced)

- [ ] Google OAuth login
- [ ] Refresh token mechanism
- [ ] Logout (JWT blocklist with Redis)
- [ ] Rate limiting (Redis)
- [ ] Kafka-based notifications
- [ ] Email notifications for reminders
- [ ] Push notifications (browser)

### ✅ Phase 4 (Integrations & Polish)

- [ ] Import applications from CSV (Indeed, Naukri)
- [ ] Export applications to CSV
- [ ] Browser extension (optional)
- [ ] Dark mode
- [ ] Mobile-responsive design
- [ ] Comprehensive error handling

---

## Configuration Files

### **application.yml** (Backend)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/jobtracker
    username: postgres
    password: password
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: update  # Change to 'validate' in production
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true

# JWT Configuration (add later)
jwt:
  secret: your-256-bit-secret-key-here-change-in-production
  access-token-expiration: 900000  # 15 minutes in milliseconds
  refresh-token-expiration: 604800000  # 7 days

# Redis Configuration (Phase 3)
spring:
  redis:
    host: localhost
    port: 6379

# Kafka Configuration (Phase 3)
spring:
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
```

---

### **docker-compose.yml**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16
    container_name: job-tracker-db
    environment:
      POSTGRES_DB: jobtracker
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: job-tracker-redis
    ports:
      - "6379:6379"

  # Kafka (add in Phase 3)
  # zookeeper:
  #   image: confluentinc/cp-zookeeper:latest
  #   environment:
  #     ZOOKEEPER_CLIENT_PORT: 2181
  
  # kafka:
  #   image: confluentinc/cp-kafka:latest
  #   depends_on:
  #     - zookeeper
  #   ports:
  #     - "9092:9092"
  #   environment:
  #     KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
  #     KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092

volumes:
  postgres_data:
```

**Start all services:**

```bash
docker-compose up -d
```

---

## API Endpoints

### **Authentication**

|Method|Endpoint|Description|Auth Required|
|---|---|---|---|
|POST|`/auth/register`|Register new user|No|
|POST|`/auth/login`|Login and get JWT|No|
|POST|`/auth/refresh`|Refresh access token|No (needs refresh token)|
|POST|`/auth/logout`|Logout and invalidate token|Yes|
|POST|`/auth/google`|Google OAuth callback|No|

### **Applications**

|Method|Endpoint|Description|Auth Required|
|---|---|---|---|
|GET|`/applications`|Get all user's applications|Yes|
|GET|`/applications/{id}`|Get single application|Yes|
|POST|`/applications`|Create new application|Yes|
|PUT|`/applications/{id}`|Update application|Yes|
|DELETE|`/applications/{id}`|Delete application|Yes|
|GET|`/applications/{id}/history`|Get status change history|Yes|

### **Contacts**

|Method|Endpoint|Description|Auth Required|
|---|---|---|---|
|GET|`/contacts`|Get all user's contacts|Yes|
|POST|`/contacts`|Create new contact|Yes|
|PUT|`/contacts/{id}`|Update contact|Yes|
|DELETE|`/contacts/{id}`|Delete contact|Yes|

### **Reminders**

|Method|Endpoint|Description|Auth Required|
|---|---|---|---|
|GET|`/reminders`|Get all reminders|Yes|
|POST|`/reminders`|Create reminder|Yes|
|PUT|`/reminders/{id}`|Update reminder|Yes|
|DELETE|`/reminders/{id}`|Delete reminder|Yes|

---

## Getting Started

### **Prerequisites**

- Java 21
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL client (optional, for DB inspection)

### **Backend Setup**

```bash
cd backend
./mvnw spring-boot:run
```

### **Frontend Setup**

```bash
cd frontend
npm install
npm run dev
```

### **Database Setup**

```bash
docker-compose up -d postgres
```

---

## Learning Resources

- [Spring Boot Official Docs](https://spring.io/projects/spring-boot)
- [Spring Security with JWT](https://www.baeldung.com/spring-security-oauth-jwt)
- [React Official Docs](https://react.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

**Last Updated**: Current conversation  
**Status**: Phase 1 in progress  
**Next Milestone**: Complete User registration and JWT login

---

Save this document and refer back as you build! Good luck! 🚀