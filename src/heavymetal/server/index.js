import express from 'express';
import router from './routers.js';
import cors from 'cors'
import {mongoose} from './models.js'

const app = express();

app.use(cors())
   .use(express.json())
   .use(router);

mongoose
  .connect("mongodb://localhost:27017/heavymetal")
  .then(() => {
    console.log("Database connected.");
    app.listen(3000, () => console.log('Server listening on port 3000.'));
  });