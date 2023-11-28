FROM node:latest as build1
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build1 /app/dist/clinic /usr/share/nginx/html