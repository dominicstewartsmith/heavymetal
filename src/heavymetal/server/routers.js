import { Router } from "express";
import {
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
  updateSet,
  deleteSet
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

router.get("/log/:date", async (req, res) => {
  let data = await loadLogData(req.params.date);
  res.status(200).send(data);
});

router.get("/exercises", async (req, res) => {
  let data = await loadExerciseData(Exercise);
  data = JSON.stringify(data);
  res.status(200).send(data);
});

router.post("/addNew", async (req, res) => {
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

router.put("/addLog", async (req, res) => {
  await addToLog(req.body);
  res.status(200).send("OK");
});

router.put("/addNewSet", async (req, res) => {
  await addNewSet(req.body);
  res.status(200).send("OK");
});

router.delete("/deleteLog", async (req, res) => {
  await deleteFromLog(req.body);
  res.status(200).send("OK");
});

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

router.put("/updateSet", async (req, res) => {
  await updateSet(req.body);
  res.status(201).send('OK')
})

router.delete("/deleteSet", async (req, res) => {
  await deleteSet(req.body);
  res.status(201).send('OK')
})

export default router;
