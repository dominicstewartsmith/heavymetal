import { Router } from "express";
import {
  readMocks,
  refreshExercises,
  loadExerciseData,
  createNewExercise
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
  await createNewExercise(Exercise, req.body)
  res.status(200).send("OK");
});

export default router;
