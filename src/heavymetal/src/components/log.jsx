import { CgArrowLeftR } from "react-icons/cg";
import { CgArrowRightR } from "react-icons/cg";
import { FiMinusSquare } from "react-icons/fi";

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
          <button className="log-controller-delete" onClick={() => handleDeleteFromLog({ date, name: item.name })}>-</button>
          <button className="log-controller-selector" onClick={handleSelectedExercise}>{item.name}</button>
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
      <div className="log-date-controls">
        <button className="log-date-minus" onClick={() => handleDateClick("-")} >&lt;</button>
        <input className="log-date-input" type="date" value={date} onChange={handleDateChange} />
        <button className="log-date-plus" onClick={() => handleDateClick("+")} >&gt;</button>
        <button className="log-date-today" onClick={() => handleDateClick("=")} >Today</button>
      </div>

      {
        log.length == 0 &&
        <div>
          <p>Nothing logged yet.</p>
          <br />
          <p>Select exercises from the management page.</p>
        </div>
      }

      {log.length > 0 && exercisesForCurrentDateComponentConstructor}


      <div>
        {/* Load the Set container here only if an exercise has been selected */}
        {Object.keys(selectedExercise).length > 0 && (
          <>
          <br />
            <SetContainer
              date={date}
              selectedExercise={selectedExercise}
              setSelectedExercise={setSelectedExercise}
            />
          </>
        )}
      </div>
    </>
  );
}
