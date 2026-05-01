# start-backend.ps1
# Reliable script to start the Petstore Backend on Java 26

$JAVA_PATH = "C:\Program Files\Java\jdk-26.0.1"
$MAVEN_PATH = "C:\Program Files\apache-maven-3.9.15\bin"
$PORT = 8080

Write-Host "--- Starting Petstore Backend Setup ---" -ForegroundColor Cyan

# 1. Clear port 8080 if in use
Write-Host "Checking for processes on port $PORT..."
$portProcess = Get-NetTCPConnection -LocalPort $PORT -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($portProcess) {
    Write-Host "Killing process $portProcess using port $PORT..." -ForegroundColor Yellow
    Stop-Process -Id $portProcess -Force
    Start-Sleep -Seconds 2
}

# 2. Set Environment Variables
$env:JAVA_HOME = $JAVA_PATH
$env:PATH = "$JAVA_PATH\bin;$MAVEN_PATH;" + $env:PATH
$env:SPRING_PROFILES_ACTIVE = "dev"

# 3. Verify Java Version
Write-Host "Using Java version:"
java -version

# 4. Run Maven
Write-Host "Starting Spring Boot application..." -ForegroundColor Green
cd backend
mvn spring-boot:run
