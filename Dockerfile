#Dockerfile

# Stage 1: Build the Vue.js application
FROM node:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Set up Nginx
FROM nginx:stable-alpine as production-stage
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build-stage /app/dist .

# Use um arquivo de configuração customizado para o Nginx se necessário
# COPY nginx.conf /etc/nginx/nginx.conf

# Substitua a porta padrão do Nginx (80) pela porta 8080
RUN sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]