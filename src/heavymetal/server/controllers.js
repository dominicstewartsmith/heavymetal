import { readFile, readFileSync } from "fs";
import * as url from "url";
import { Log } from "./models.js";

//TODO Prevent requests with undefined exercises
//TODO Prevent requests with non Latin chars

function readMocks() {
  let exerciseData = readFileSync(
    url.fileURLToPath(new URL(".", import.meta.url) + "./exercises.json"),
    "utf-8"
  );
  exerciseData = JSON.parse(data);
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

function readLogMocks() {
  let exerciseData = readFileSync(
    url.fileURLToPath(new URL(".", import.meta.url) + "./user-mocks.json"),
    "utf-8"
  );
  exerciseData = JSON.parse(exerciseData);
  return exerciseData;
}

function generateLogMocks(model) {
  const data = readLogMocks();

  model.deleteMany({}).then(() => {
    data.forEach(async (item) => {
      await model.create(item);
    });
  });
}

async function loadExerciseData(model, category) {
  //request the exercise data from the database by category
  //if no category is specified, retrieve all data

  console.log("Exercise data requested from server.");
  return category
    ? await model.findOne({ category: category }).exec()
    : await model.find({}).exec();
}

async function loadLogData(date) {
  console.log(`Log data requested from server for ${date}.`);
  return await Log.find({ date }).exec();
}

async function addToLog(data) {
  console.log(
    `Log insertion for ${data.date} requested: ${JSON.stringify(data)}`
  );

  let logForDateExists = await Log.findOne({ date: data.date });
  let queryResponse;

  //Only update if there is data for this date, otherwise create a new document
  if (logForDateExists) {
    //Check if we have already logged any exercises for the selected category
    if (
      Object.values(logForDateExists.data)
        .map((x) => x.category)
        .includes(data.category)
    ) {
      queryResponse = await Log.updateOne(
        { date: data.date, "data.category": data.category },
        {
          $push: {
            "data.$.exercises": { name: data.name, weight: [], reps: [] },
          },
        }
      );
    } else {
      //Data for this date exists, but no exercises for this category
      queryResponse = await Log.updateOne(
        { date: data.date },
        {
          $push: {
            data: {
              category: data.category,
              exercises: [{ name: data.name, weight: [], reps: [] }],
            },
          },
        }
      );
    }
  } else {
    //Create a new document for this date
    queryResponse = await Log.create({
      date: data.date,
      data: [
        {
          category: data.category,
          exercises: [{ name: data.name, weight: [], reps: [] }],
        },
      ],
    });
  }
}

async function deleteFromLog(data) {
  console.log(
    `Log deletion for ${data.date} requested: ${JSON.stringify(data)}`
  );

  const alreadyExists = await Log.find({ date: data.date });

  if (alreadyExists) {
    const queryResponse = await Log.updateOne(
      { date: data.date },
      { $pull: { "data.$[].exercises": { name: data.name } } }
    );
  }
}

async function createNewExercise(model, { category, exercises }) {
  //Verify that this is a new exercise.
  const alreadyExists = await checkIfExerciseAlreadyExists(model, exercises);

  if (!alreadyExists) {
    //It's a new exercise
    await model.updateOne(
      { category: category },
      { $push: { exercises: exercises } }
    );
    return true;
  } else {
    //It's already in the DB so reject the request
    //TODO - bug in this function?
    console.log(
      { category, exercises },
      "already exists in database. Skipping update."
    );
    return false;
  }
}

async function deleteExercise(model, { category, exercises }) {
  await model.updateOne(
    { category: category },
    { $pull: { exercises: exercises } }
  );

  return true;
}

async function addNewSet(data) {
  console.log(data);

  console.log(
    `Set update for ${data.name} / ${data.date} requested.`
  );

  const alreadyExists = await Log.findOne({ date: data.date });

  if (alreadyExists) {
    const queryResponse = await Log.updateOne(
      { date: data.date },
      { $push:
        {
          "data.$[categoryElem].exercises.$[exerciseElem].weight": data.weight,
          "data.$[categoryElem].exercises.$[exerciseElem].reps": data.reps
        }
      },
      {
        arrayFilters: [
          {"categoryElem.category": {$exists: true}},
          {"exerciseElem.name": data.name}
        ]
      }
    );
  }
}

async function checkIfExerciseAlreadyExists(model, exercise) {
  //Although this is also handled on the front end, we must also prevent
  //against direct http requests
  //If the database finds that the exercises is in the database it will return FALSE

  let result = await model.find({ exercises: exercise });
  return result.length ? true : false;
}

export {
  readMocks,
  refreshExercises,
  loadExerciseData,
  createNewExercise,
  deleteExercise,
  generateLogMocks,
  loadLogData,
  addToLog,
  deleteFromLog,
  addNewSet,
};
