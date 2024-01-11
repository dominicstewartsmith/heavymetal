import { readFile, readFileSync } from "fs";
import * as url from "url";

function readMocks() {
  let data = readFileSync(
    url.fileURLToPath(new URL(".", import.meta.url) + "./exercises.json"),
    "utf-8"
  );
  data = JSON.parse(data);
  return data;
}

function refreshExercises(model, data) {
  //clear the database and then refresh it with the mock data
  model.deleteMany({}).then(() => {
    data.forEach(async (item) => {
      await model.create(item);
    });
  });
}

async function loadExerciseData(model, category) {
  //request the exercise data from the database by category
  //if no category is specified, retrieve all data

  console.log("Exercise data requested from server");
  return category
    ? await model.findOne({ category: category })
    : await model.find({});
}

async function createNewExercise(model, { category, exercises }) {
  //Verify that this is a new exercise.
  const alreadyExists = await checkIfExerciseAlreadyExists(model, exercises);

  if (!alreadyExists) {
    //It's a new exercise
    await model.updateOne({ category: category }, {$push: { exercises: exercises }});
    console.log('Created', {category, exercises})
    return true;
  } else {
    //It's already in the DB so reject the request
    console.log({category, exercises}, 'already exists in database. Skipping update.')
    return false;
  }
}

async function checkIfExerciseAlreadyExists(model, exercise) {
  //Although this is also handled on the front end, we must also prevent
  //against direct http requests
  //If the database finds that the exercises is in the database it will return FALSE

  let result = await model.find({ exercises: exercise });
  return result.length ? true : false;
}

export { readMocks, refreshExercises, loadExerciseData, createNewExercise };
