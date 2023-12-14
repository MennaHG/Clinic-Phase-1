

docker container prune
docker network prune -f
docker network create front
docker network create db
docker network create kaf
docker images
docker-compose  -f ./kafka/zk-kafka.yml up -d
docker network connect kaf kafka1
docker run -d -p 8080:80 --net front --name=angular_container angular_image:1.0
docker run -d --name mongo_container -p 27017:27017 --net db mongo_image:1.0
winpty docker exec -ti mongo_container mongosh localhost:27017 mongoScript.js
sleep 1m
docker run -d -p 5000:5000 --net kaf --name=flaskapp flask_image:1.0
docker network connect db flaskapp
docker network connect front flaskapp



