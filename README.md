
# mern-s3-filestore

A MERN tech stack application, to push audio and video files to AWS S3.


## Features

- Upload audio, video files by directly linking the application to your S3 bucket.
- Automated rejection of files exceeding 30mins duration.
- File metadata maintained in a database including a link to the S3 resource.
- User friendly and engaging UI.


## Documentation and UI workflow

[Documentation and UI workflow](https://docs.google.com/document/d/1DdXnX-n1eLOgdHBJgj10kQptFHugXiUmm2K6X0jmMXQ/edit?usp=sharing)


## Setting environment variables

Clone the project

```bash
  git clone https://github.com/JasonDsouza16/mern-s3-filestore
```
- Steps to setup the backend environment file

  1. Go to the project directory

  ```bash
    cd server
  ```

  2. Create the .env file 
  ```bash
    PORT={YOUR_SERVER_PORT_NUMBER}
    AWS_ACCESS_KEY={YOUR_AWS_ACCESS_KEY}
    AWS_SECRET_KEY={YOUR_AWS_SECRET_KEY}
    S3_BUCKET_NAME={YOUR_AWS_S3_BUCKET_NAME} 
    AWS_REGION={YOUR_AWS_REGION}
    MONGODB_URI={YOUR_MONGODB_URI}
  ```

  3. Start the server

  ```bash
    npm run start
  ```

  - Steps to setup the frontend environment file

  1. Go to the project directory

  ```bash
    cd client
  ```

  2. Create the .env file 
  ```bash
    REACT_APP_API_BASE_URL={YOUR_API_BASE_URL}
  ```
  
  3. Start the server

  ```bash
    npm run start
  ```

## Run Locally

Clone the project

```bash
  git clone https://github.com/JasonDsouza16/mern-s3-filestore
```

- Steps to run the backend server

  1. Go to the project directory

  ```bash
    cd server
  ```

  2. Install dependencies

  ```bash
    npm install
  ```

  3. Start the server

  ```bash
    npm run start
  ```


- Steps to run the frontend server

  1. Go to the project directory

  ```bash
    cd client
  ```

  2. Install dependencies

  ```bash
    npm install
  ```

  3. Start the server (port 3000)

  ```bash
    npm run start
  ```


## Tech Stack

**Client:** ReactJS, Material UI, Material Icons

**Server:** NodeJS, ExpressJS, AWS SDK, FFMPEG

**Database:** MongoDB with mongoose



## Authors

- [@jasondsouza16](https://www.github.com/jasondsouza16)

