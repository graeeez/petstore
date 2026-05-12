# Build stage
FROM maven:3.9.15-eclipse-temurin-26 AS build
WORKDIR /app

# Copy only the pom.xml first to leverage Docker cache
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build
COPY backend/src ./src
RUN mvn clean package -DskipTests -B

# Run stage
FROM eclipse-temurin:26-jre-jammy
WORKDIR /app

# Copy the built jar. The wildcard helps if the version changes.
COPY --from=build /app/target/petstore-backend-*.jar app.jar

# Standard Render port is 10000, but we'll use 8080 as configured in application.yml
ENV PORT=8080
EXPOSE 8080

# Run the application with the render profile
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=render"]
