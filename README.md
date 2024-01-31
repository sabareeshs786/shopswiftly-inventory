# Shopswiftly Inventory Management Service
## This is a microservice used to upload the inventory of products to the database in order to display them to the user by the admin and editor. It is developed using node.js, express.js, mongodb and more.

### Installation instructions

Follow the below steps to set up the microservice in your local machine:

#### Prerequisites
- Node package manager(npm)
- Node JS
- Git

#### Steps to install the shopswiftly-profile microservice:

1. **Clone the repository**
    ```bash
   git clone https://github.com/sabareeshs786/shopswiftly-inventory
   cd shopswiftly-inventory

2. **Install the dependencies**
   ```bash
   npm install

3. **Create a .env file**
   
   In this the key to decrypt the access token and refresh token should be added. And also the URI of the mongodb database and the admin email id and password. Follow the upcoming steps to do this.
   
4. **Open terminal and run the following command**
   ```bash
   node
   require('crypto').randomBytes(64).toString('hex')
   ```
   Copy the 64 characters long string that is generated

5. **Add the following lines in the .env file that is created above**
   ```bash
   ACCESS_TOKEN_SECRET=COPIED_64_CHARACTERS_LONG_STRING
   ```
   Create another 64 characters long string with same command specified above and copy it.
   ```bash
   REFRESH_TOKEN_SECRET=COPIED_64_CHARACTERS_LONG_STRING
   ```

6. **Procure a MongoDB Database Cloud Storage from AWS, GCP or Azure for free by following the below link from MongoDB Atlas**
   Link: https://youtu.be/NcN9S0DR1nU?si=pEJW7jQIBoLwZqIc

7. **Copy the database URIs by following the instructions in the above link and paste it in the .env file as mentioned below**
   ```bash
   DATABASE_URI_ADMIN_PRODUCTS=COPIED_MONGODB_DATABASE_URI1
   DATABASE_URI_USER_PRODUCTS=COPIED_MONGODB_DATABASE_URI2

8. **Now run the following command to start a node.js server in development mode**
    ```bash
    npm run dev
    ```
    
9. **Install other microservices as well in the following links by following the instructions specified there**
    
    https://github.com/sabareeshs786/shopswiftly-profile
    
    https://github.com/sabareeshs786/shopswiftly-image-server
    
    https://github.com/sabareeshs786/shopswiftly-admin-ui
    
    https://github.com/sabareeshs786/shopswiftly-user-ui

    https://github.com/sabareeshs786/shopswiftly-listing-display

### Features provided by this microservice

1. **Product's brand management**
   Used to add, edit and delete the brands of the products in the database with a predefined category

2. **Product management**
   - Used to add, edit and delete the products with its specifications in the database
   - Images can also be uploaded

3. **Inventory management**
   Used to edit the quantity in the inventory of the products that are uploaded


### Features implemented in this microservice

1. **Added MongoDB Collection for each category**
   This is to make read/write operations more efficient

2. **Done backend pagination while fetching data**
   If the data stored in the database is very large, it is impossible to bring it to the frontend all at once and display. Therefore the pagination is implemented in the backend in order to limit the amount of data that is sent to the frontend

### Features under development

1. Product management
2. Inventory management

