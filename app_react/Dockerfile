# Use nginx to serve the built React Vite app
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy the pre-built 'dist' folder from the local machine to the container
COPY dist/ . 

# # Remove the default Nginx configuration file
# RUN rm /etc/nginx/conf.d/default.conf

# # Copy a custom Nginx configuration file
# COPY nginx.conf /etc/nginx/conf.d/

# Expose the port Nginx will run on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
