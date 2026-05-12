# Build stage
FROM maven:3.9.15-eclipse-temurin-26 AS build
WORKDIR /app

# Copy the backend source code
COPY backend/pom.xml backend/
COPY backend/src backend/src/

# Build the application
RUN cd backend && mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:26-jre-jammy
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/backend/target/petstore-backend-1.0.0.jar app.jar

# Set environment variables
ENV PORT=8080
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=render"]
