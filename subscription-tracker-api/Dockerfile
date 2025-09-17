# ---- Build stage ----
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# ---- Run stage ----
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy built jar from build stage
COPY --from=build /app/target/subscription-tracker-api-0.0.1-SNAPSHOT.jar app.jar

# Create non-root user
RUN addgroup --system app && adduser --system --ingroup app app

# Expose the app port (default Spring Boot port)
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-Dserver.port=8080", "-jar", "app.jar"]

