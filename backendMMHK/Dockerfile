# Image de base Java
FROM openjdk:17-jdk-slim

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier JAR généré
COPY target/*.jar app.jar

# Port exposé (changez si différent)
EXPOSE 8080

# Commande pour lancer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]