require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

//va el puerto del cluster entre ('')
const uri = 'mongodb+srv://Juli:1234@surtitech.jtgao.mongodb.net/?retryWrites=true&w=majority&appName=SURTITECH';
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.log(error);
  }
}

run();

// Import routes

const usercontroller = require('./routes/users-routes');




//use routes

app.use('/users', usercontroller);



//debe ser el puerto por defecto el (4000) y va entre comillas paradas (`)
app.listen(4000, () => {
    console.log(`Server running at http://localhost:${4000}`);
  });