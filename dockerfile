# Etapa 1: Build de Angular
FROM node:18-alpine as build

WORKDIR /app
COPY . .
RUN npm install -g @angular/cli
RUN npm install
RUN ng build --configuration=production

# Etapa 2: Servir con Nginx
FROM nginx:alpine
COPY --from=build /app/dist/ccp-project /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf