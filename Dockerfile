# Step 1: Choose a base image with Node installed
FROM node:20

# Step 2: Set the working directory inside the container
WORKDIR /ecom_cart

# Step 3: Copy only package files first (for caching)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the app’s source code
COPY . .

# Step 6: Expose the port your app runs on
EXPOSE 3000

# Step 7: Define the command to run the app
CMD ["npm", "run", "dev"]
