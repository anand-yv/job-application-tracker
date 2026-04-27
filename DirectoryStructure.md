
# Job Application Tracker - Final Project Structure

## Project Root
```
job-application-tracker/
├── frontend/
├── backend/
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Backend Folder Structure (Spring Boot)

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── jobtracker/
│   │   │           └── api/
│   │   │               ├── JobTrackerApplication.java
│   │   │               ├── controller/
│   │   │               ├── service/
│   │   │               ├── repository/
│   │   │               ├── model/
│   │   │               ├── dto/
│   │   │               ├── config/
│   │   │               └── security/
│   │   └── resources/
│   │       ├── application.yml
│   │       └── application-dev.yml
│   └── test/
├── pom.xml
└── .gitignore
```

---

## Frontend Folder Structure (React)
```
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/ter
│   ├── utils/
│   └── App.jsx
├── package.json
└── .gitignore
```

---

## Spring Boot Project Metadata (for start.spring.io)

| Field | Value |
|-------|-------|
| **Group** | `com.jobtracker` |
| **Artifact** | `api` |
| **Name** | `Job Tracker API` |
| **Package** | `com.jobtracker.api` |
| **Java Version** | `21` |

---

## application.yml Configuration

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/jobtracker
    username: postgres
    password: password
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
```

---

## Docker Command (Postgres)

```bash
docker run --name job-tracker-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=jobtracker \
  -p 5432:5432 \
  -d postgres:16
```

---

**This is your final reference. Save this file and follow it exactly.**

