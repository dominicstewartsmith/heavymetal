import express from 'express';
import router from './routers.js';
import cors from 'cors'
import { Exercise, mongoose } from './models.js'
import { Log } from './models.js';
import { readMocks, refreshExercises } from './controllers.js';

const app = express();

app.use(cors())
  .use(express.json())
  .use(router);

mongoose
  .connect("mongodb://127.0.0.1:27017/heavymetal")
  .then(() => {
    console.log("Database connected.");
    app.listen(3000, () => console.log('Server listening on port 3000.'));

    Exercise.find({})
    .then(response => {
      if (response.length == 0) {
        console.log('First time loading. Populating database...')
        refreshExercises(Exercise, readMocks())
      }
    })
    .catch(err => console.log(err));
  });