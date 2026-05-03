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

Interface methods are implicitly public!

`@Component` - tells Spring to create an instance of this class (you'll inject it later)
`@Value("${jwt.secret}")` - reads from application.yml

> In method chains, each method returns an object, and the next method in the chain belongs to that returned object's class.

CSRF - "Cross Site Request Forgery" - Its  security vulnerabiltity where attacker tricks an user to execute unwanted actions on a web application where they are authenticated
Some CSRF token is sent while making rquest this help to ensure its proper request but its disable in rest api as its statels and for statelsss we use token jwt one.


JWT UTIL : Its used for generating and validating the token