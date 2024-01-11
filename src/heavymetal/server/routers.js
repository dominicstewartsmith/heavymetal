import { Router } from "express";
import {
  readMocks,
  refreshExercises,
  loadExerciseData,
  createNewExercise,
  deleteExercise,
  generateLogMocks,
  loadLogData,
} from "./controllers.js";
import { Exercise, Log } from "./models.js";

const router = Router();

router.get("/refresh", (req, res) => {
  refreshExercises(Exercise, readMocks());
  res.status(200).send("Mocks created");
});

router.get("/logrefresh", (req, res) => {
  generateLogMocks(Log);
  res.status(200).send("Mocks created");
});

router.get("/logload/:date", async (req, res) => {
  let data = await loadLogData(req.params.date);
  res.status(200).send(data);
});

router.get("/loadall", async (req, res) => {
  let data = await loadExerciseData(Exercise);
  data = JSON.stringify(data);
  res.status(200).send(data);
});

router.post("/add", async (req, res) => {
  const response = await createNewExercise(Exercise, req.body);
  console.log("Insertion requested for ", req.body);

  if (response) {
    //Success
    res.status(201).send("Created");
  } else {
    //Fail
    res.status(400).send("Bad");
  }
});

router.post("/logadd", async (req, res) => {});

router.delete("/delete", async (req, res) => {
  const response = await deleteExercise(Exercise, req.body);
  console.log("Deletion requested for ", req.body);
  if (response) {
    //Success
    res.status(201).send("Deleted");
  } else {
    //Fail
    res.status(400).send("Bad");
  }
});

export default router;
