# production environment
FROM nginx:1.19.10-alpine

WORKDIR /app

COPY ./build/ /usr/share/nginx/html

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# FROM node:14.17.0-alpine

# WORKDIR /app

# COPY ["package.json", "./"]

# RUN npm install --production

# COPY . ./

# RUN npm run build

# # production environment
# FROM nginx:1.19.10-alpine
# COPY --from=0 /app/build /usr/share/nginx/html

# COPY --from=0 /app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]