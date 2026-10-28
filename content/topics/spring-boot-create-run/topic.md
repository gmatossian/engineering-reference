---
id: '2eae671e-54ad-4afa-b85f-26415d0cea59'
title: 'Create and run a Spring Boot app'
status: 'accepted'
iconKey: 'operations'
domains:
  - 'java'
  - 'http'
kind: 'operations'
childTopicIds: []
relatedTopicIds:
  - '31ee0d58-0999-457e-9d7c-5fe20ef9be56'
  - '973352f3-ac82-42a1-a38a-5c09e3946de0'
---

## Create the skeleton

| Method         | Generate the project                                       |
| -------------- | ---------------------------------------------------------- |
| **IntelliJ**   | File → New → Project → **Spring Boot**                     |
| **Initializr** | [start.spring.io](https://start.spring.io/) → **Generate** |

IntelliJ's wizard uses **Spring Initializr**. For these examples, choose **Java 21 ·
Maven · JAR**, a released Boot version, and dependencies **Spring Web + Validation**.

**Name:** `Products` · **Artifact:** `products` · **Group:** `com.example` ·
**Package:** `com.example.products`.

For a downloaded ZIP, extract it and open the folder containing `pom.xml` as a
Maven project in IntelliJ.

## Run the app

Run terminal commands from **the project root** (`products/`, containing `pom.xml`
and `mvnw`).

| From         | Start the application                          |
| ------------ | ---------------------------------------------- |
| **IntelliJ** | Run the generated `ProductsApplication.main()` |
| **Terminal** | `./mvnw spring-boot:run`                       |

### Check health with Actuator

Select **Spring Boot Actuator** in Initializr, or add this dependency inside
`pom.xml`'s `<dependencies>`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

**Run or restart** the app, then check:

```bash
curl http://localhost:8080/actuator/health
```

**Healthy response:** includes `"status": "UP"`; additional fields may appear.

Health is **exposed by default**; **no custom controller is required**.
`UP` reflects the configured health checks; it does not verify product endpoints.

### Run a packaged JAR

```bash
./mvnw package
java -jar target/products-0.0.1-SNAPSHOT.jar
```

`spring-boot:run` runs from the project; **`java -jar` runs the built artifact**.
Rebuild the JAR after changing source code.

## Create and fetch a product

| Request              | Successful response                         |
| -------------------- | ------------------------------------------- |
| `POST /products`     | **201 Created** + `Location` + product body |
| `GET /products/{id}` | **200 OK** + product body                   |

> Keep the controller and service **in or below the application's root package**
> (`com.example.products`) so default component scanning finds them.

### Request and response records

```java
record CreateProductRequest(
    @NotBlank String sku,
    @NotBlank String name,
    @NotNull @Positive BigDecimal price) {}

record ProductResponse(
    UUID id, String sku, String name, BigDecimal price) {}
```

### Controller

```java
@RestController
@RequestMapping("/products")
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(
            @Valid @RequestBody CreateProductRequest input) {
        Product product = service.create(input);
        URI location = URI.create("/products/" + product.getId());
        return ResponseEntity.created(location)
                .body(toResponse(product));
    }

    @GetMapping("/{id}")
    public ProductResponse get(@PathVariable("id") UUID id) {
        return toResponse(service.get(id));
    }

    private ProductResponse toResponse(Product product) {
        return new ProductResponse(product.getId(), product.getSku(),
                product.getName(), product.getPrice());
    }
}
```
