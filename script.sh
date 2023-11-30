docker container prune
docker rmi -f $(docker images -q)
docker network create front
docker network create db
docker build -f ./database/DockerFile --tag mongo_image:1.0 ./database
docker build -t flask_image:1.0 ./backend
docker build -t angular_image:1.0 ./frontend/clinic
docker images
docker run -d -p 8080:80 --net front --name=angular_container angular_image:1.0
docker run -d -p 5000:5000 --net front --name=flaskapp flask_image:1.0
docker run -d --name mongo_container -p 27017:27017 --net db mongo_image:1.0
docker exec -ti mongo_container mongosh localhost:27017 mongoScript.js
docker network connect db flaskapp


