import { useEffect, useState } from "react";
import {
  apiGetExerciseData,
  apiGetLogData,
  apiDeleteFromLog,
  apiAddNewSet,
} from "../apiService";

import SetContainer from "./set-container";

export default function Log({
  date,
  setDate,
  log,
  setLog,
  generateDateString,
}) {
  const [selectedExercise, setSelectedExercise] = useState({});

  const today = new Date();
  const exercisesForCurrentDate = log.map((item) => item.exercises).flat(); //All exercises for the selected day as a flat array

  // Construct the JSX to show a button per exercise for the day
  const exercisesForCurrentDateComponentConstructor =
    exercisesForCurrentDate.map((item) => {
      return (
        <div key={item.name}>
          <button
            onClick={() =>
              handleDeleteFromLog({
                date,
                name: item.name,
              })
            }
          >
            -
          </button>
          <button onClick={handleSelectedExercise}>{item.name}</button>
        </div>
      );
    });

  async function reloadLog(date) {
    const reloadLog = await apiGetLogData(date);
    if (reloadLog.length > 0) setLog(reloadLog[0].data);
    else setLog([]);
  }

  async function handleDateChange(e) {
    setSelectedExercise({});
    setDate(e.target.value);
    await reloadLog(e.target.value);
  }

  async function handleDateClick(action) {
    setSelectedExercise({});

    let newDate = new Date(date);
    if (action == "+") newDate.setDate(newDate.getDate() + 1);
    if (action == "-") newDate.setDate(newDate.getDate() - 1);
    if (action == "=") newDate = today;

    newDate = generateDateString(newDate);
    setDate(newDate);
    reloadLog(newDate);
  }

  function handleSelectedExercise(e) {
    let update = {};

    for (let i of exercisesForCurrentDate) {
      if (i.name == e.target.innerHTML) {
        update.name = i.name;
        update.weight = i.weight;
        update.reps = i.reps;

        setSelectedExercise(update);
      }
    }
  }

  async function handleDeleteFromLog(data) {
    await apiDeleteFromLog(data);
    setSelectedExercise({})
    await reloadLog(date);
  }

  return (
    <>
      <button onClick={() => handleDateClick("-")}>-</button>
      <input type="date" value={date} onChange={handleDateChange} />
      <button onClick={() => handleDateClick("+")}>+</button>
      <button onClick={() => handleDateClick("=")}>Today</button>
      <section>
        <h1>Lifts</h1>
        {log.length > 0 && exercisesForCurrentDateComponentConstructor}
      </section>
      <section>


        {/* Load the Set container here only if an exercise has been selected */}
        {Object.keys(selectedExercise).length > 0 && (
          <>
            <SetContainer
              date={date}
              selectedExercise={selectedExercise}
              setSelectedExercise={setSelectedExercise}
            />
          </>
        )}
      </section>
    </>
  );
}
