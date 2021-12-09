# Steps to deploy this project

1. download or clone this repository
2. extract this in a folder
3. open folder in command prompt
4. run these commands

   $npm install

   make sure you install already NODEJS in your computer
   if not go this link and download and install

   https://nodejs.org/en/download/

5. set some configuration in project 

   open config folder set your configuration like

   /config/custom-environment-variables.json

   {
       "db":"your-db-url",
       "jwtPrivateKey":"your-jwt-key"
   }
6. set config through cmd

   export mydb=your-db-url
   export myjwtkey=your-jwt-key

   Note: myjwtkey is name of your custom-environment-variable of jwtPrivateKey

7. set mail username and password in /routes/userRoute.js
   
   auth: {
          user: 'your-gmail-username',
          pass: 'your-password'
        }

   and also set your link url in mail lenk
   make sure mail will be less secure
8. make a folder public as static in root directory
   inside the public folder make a folder uploads here we store 
   user document using multer package.
   
9. run project 
   
   npm run dev (for development)
   npm start (for production)

   Note: (npm run dev ) command run if install nodemon in your system as dev dependency
      
      npm install nodemon --save-dev
