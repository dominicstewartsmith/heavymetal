import {readFile, readFileSync} from "fs";
import * as url from 'url'

function readMocks() {
  let data = readFileSync(url.fileURLToPath(new URL('.', import.meta.url) + './exercises.json'), 'utf-8')
  data = JSON.parse(data);
  return data;
}

function refreshExercises(model, data)
{
  //clear the database and then refresh it with the mock data
  model.deleteMany({}).then(() => {
    data.forEach(async item => {
      await model.create(item)
    })
  })
}

async function loadExerciseData(model, category) {
  //request the exercise data from the database by category
  //if no category is specified, retrieve all data

  console.log("Exercise data requested from server")
  return category ? await model.findOne({category: category}) : await model.find({})
}

export {readMocks, refreshExercises, loadExerciseData}