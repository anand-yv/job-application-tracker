Repository allows Java to talk to database without manual SQL ✅
It's an interface that JPA implements for you ✅
JPA creates a proxy class at runtime ✅ (This is the key insight!)
findBy is a naming convention that JPA parses ✅

JPA doesn't look in the table for the method. It looks at the Entity class (your User.java).

```
Optional<User> findByEmail(String email);
```

Step-by-step:

JPA sees findBy → "Okay, this is a query method"
JPA sees Email → "Look for a field called email in the User entity"
JPA finds private String email; in User.java
JPA generates SQL: SELECT \* FROM users WHERE email = ?

The pattern:

findBy + FieldName (must match the Java field name in the entity, not the database column name)

Spring sees UserRepository extends JpaRepository
JPA creates a proxy implementation class at runtime
Spring registers it as a bean
Whenever you need it (e.g., in AuthService), Spring injects it

You don't write the implementation, but it exists at runtime!

---

Interface methods are implicitly public!

`@Component` - tells Spring to create an instance of this class (you'll inject it later)
`@Value("${jwt.secret}")` - reads from application.yml

---

> In method chains, each method returns an object, and the next method in the chain belongs to that returned object's class.
```java
Jwts.builder()
    .subject(email)        // returns JwtBuilder
    .issuedAt(new Date())  // returns JwtBuilder
    .compact();            // returns String
```

---

CSRF - "Cross Site Request Forgery" - Its  security vulnerabiltity where attacker tricks an user to execute unwanted actions on a web application where they are authenticated
Some CSRF token is sent while making request this help to ensure its proper request but its disable in rest api as its statels and for statelsss we use token jwt one.

---

JWT UTIL : Its used for generating and validating the token

---

> Final variables cannot be initialized after the constructor because Java guarantees that objects are fully initialized once the constructor completes. This ensures immutability and thread safety, as final fields must have a consistent value visible to all threads.

---

###### Spring Boot Error Handling Notes
**Two Error Layers**

Security Filter Layer - Runs BEFORE your code. Auth failures (401/403) return status code only, no JSON. Request blocked here never reaches your controllers.

Application Layer - YOUR code (controllers/services). Exceptions thrown here are caught by `@RestControllerAdvice` and return proper JSON responses.

**Why You Saw Just "401"**

Wrong credentials → Security filter rejected request → Returned 401 with empty body → Your code never ran ❌

**Why Your Auth Service WILL Return JSON**

```java
throw new RuntimeException("Email exists");
```
This runs IN your code (application layer) → `@RestControllerAdvice` catches it → Returns `{"error": "Email exists", "status": 400}` ✅

**Key**: Security filter errors ≠ Application errors. Your exceptions happen after security, so they get proper JSON handling.
---

`@RestControllerAdvice`: Marks this class as a global exception handler for all controllers.

`@ExceptionHandler(EmailAlreadyExistsException.class)`: Whenever Exception is thrown anywhere in the app, Spring automatically looks for a matching @ExceptionHandler and calls the handler method (in this case, handleEmailAlreadyExists).
```java
@ExceptionHandler(EmailAlreadyExistsException.class)
public ResponseEntity<Map<String, Object>> handleEmailAlreadyExists(EmailAlreadyExistsException ex){
    return buildErrorResponse(ex.getMessage(), HttpStatus.BAD_REQUEST);
}
```

---

**OncePerRequestFilter**:
A Spring Security filter that runs only once for every HTTP request before the request reaches the controller.
It is commonly used for:
- JWT authentication
- Validating tokens
- Identifying the authenticated user
- Setting authentication details in SecurityContext

```java
@Component
public class JwtAuthFilter extends  OncePerRequestFilter{
    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest,  HttpServletResponse response, FilterChain filterChain){
       
    }
}
```

`UsernamePasswordAuthenticationToken`:
- Represents the authenticated user in Spring Security
- Used to create an Authentication object for Spring Security

`SecurityContextHolder`:
- Stores security/authentication details for the current request/thread
- Tells Spring Security which user is currently authenticated

`SecurityContextHolder.getContext().setAuthentication(authToken);`
- Stores the authenticated user in Spring Security Context

`SecurityContextHolder.getContext().getAuthentication();`
- Gets the currently authenticated user details

---

###### In Security Config

`addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)`
- Tells Spring Security to run my JWT filter before Spring's built-in UsernamePasswordAuthenticationFilter
- Used to replace Spring's default username/password authentication flow with JWT authentication
- Because of this, users don't need Spring Security's default generated password

`.class` in Java:
- Used to get the Class/type reference of a class
- It is NOT an object instance

Example:
jwtAuthFilter -> Object instance
JwtAuthFilter.class -> Class/type reference

UsernamePasswordAuthenticationFilter.class
- Refers to the filter TYPE, so Spring knows where to place my custom filter in filter chain
- Tt just needs to know which filter in the chain to place yours before. So you pass the type, not an instance.

Used commonly in:
- addFilterBefore()
- @ExceptionHandler(RuntimeException.class)
- Reflection
- Spring annotations/configuration

---

###### Mapper in JAVA
- A Mapper is used to convert one object into another. Instead of writing the same conversion logic in multiple places, we keep it in one Mapper. This reduces duplication and makes changes easier to maintain

```java
public class ApplicationMapper {

    public static JobApplicationResponse toResponse(JobApplication entity) {
        return new JobApplicationResponse(
            entity.getId(), entity.getJobId(), entity.getJobUrl(), entity.getCompany(),
            entity.getRoleTitle(), entity.getStatus(), entity.getSource(), entity.getNotes(),
            entity.getSalaryRange(), entity.getLocation(), entity.getAppliedDate(),
            entity.getCreatedAt(), entity.getUpdatedAt()
        );
    }
}
```

---

