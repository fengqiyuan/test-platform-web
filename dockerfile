# Use Node.js 16 as the base image
FROM node:18.12.1-alpine as build-stage

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the source code to the container
COPY . .

# Build the app for production
RUN npm run build

# production stage
FROM nginx:1.21.3-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
