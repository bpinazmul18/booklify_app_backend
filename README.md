## Introduction

This project is the backend of booklify, an imaginary video rental app. I've used booklify as a practice project.

This is the implementation of booklify in Node.js.

## Setup

Make sure to follow all these steps exactly as explained below. Do not miss any steps or you won't be able to run this application.

### Install MongoDB

To run this project, you need to install the latest version of MongoDB Community Edition first.

https://docs.mongodb.com/manual/installation/

Once you install MongoDB, make sure it's running.

### Install the Dependencies

Next, from the project folder, install the dependencies:

    yarn install

### Populate the Database

    node seed.js

### Run the Tests

You're almost done! Run the tests to make sure everything is working:

    yarn test

All tests should pass.

### Start the Server

    yarn start

This will launch the Node server on port 3001. If that port is busy, you can set a different point in config/default.json.

Open up your browser and head over to:

http://localhost:3001/api/genres

You should see the list of genres. That confirms that you have set up everything successfully.

### (Optional) Environment Variables

If you look at config/default.json, you'll see a property called jwtPrivateKey. This key is used to encrypt JSON web tokens. So, for security reasons, it should not be checked into the source control. I've set a default value here to make it easier for you to get up and running with this project. For a production scenario, you should store this key as an environment variable.

On Mac:

    export booklify_jwtPrivateKey=yourSecureKey

On Windows:

    set booklify_jwtPrivateKey=yourSecureKey