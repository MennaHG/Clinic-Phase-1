pipeline {
    agent any
    environment{
        DOCKERHUB_CREDENTIALS= credentials('menna-jenkins')
    }
    stages {
        stage('CI') {
            steps {

               sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u mennahg --password-stdin"
               sh "pwd"
               sh "docker build -t mennahg/angular_image ./frontend/clinic"
               sh "docker build -t mennahg/mongo_image ./database"

               sh "docker build -t mennahg/flask_image ./backend"
               sh "docker push mennahg/angular_image"
               sh "docker push mennahg/flask_image"
               sh "docker push  mennahg/mongo_image"
                }
            }
        

        stage('CD') {
            steps {
               sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u mennahg --password-stdin"
                sh "docker network prune -f"
              sh "docker network create front"
              sh "docker network create db"
              sh "docker run -d --name mongo_container -p 27017:27017 --net db mennahg/mongo_image"
              sh "docker exec -i mongo_container mongosh localhost:27017 mongoScript.js"
              sh "docker run -d -p 4000:5000 -e PORT=4000 -e db_url=mongo_container:27017 --name=flaskapp mennahg/flask_image" 
              sh "docker run -d -p 3000:80 -e flaskPort=4000 --net front --name=angular_container mennahg/angular_image"
              sh "docker network connect db flaskapp"
              sh "docker network connect front flaskapp"
            }
        }
    }
        
    }
