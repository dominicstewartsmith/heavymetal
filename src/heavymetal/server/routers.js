import { Router } from "express";
import {
  readMocks,
  refreshExercises,
  loadExerciseData,
  createNewExercise,
  deleteExercise,
} from "./controllers.js";
import { Exercise } from "./models.js";

const router = Router();

router.get("/refresh", (req, res) => {
  refreshExercises(Exercise, readMocks());
  res.status(200).send("Mocks created");
});

router.get("/loadall", async (req, res) => {
  let data = await loadExerciseData(Exercise);
  data = JSON.stringify(data);
  res.status(200).send(data);
});

router.post("/add", async (req, res) => {
  const response = await createNewExercise(Exercise, req.body);

  if (response) {
    //Success
    res.status(201).send("Created");
  } else {
    //Fail
    res.status(400).send("Bad");
  }
});

router.delete("/delete", async (req, res) => {
  const response = await deleteExercise(Exercise, req.body);
  if (response) {
    //Success
    res.status(201).send("Deleted");
  } else {
    //Fail
    res.status(400).send("Bad");
  }
});

export default router;
