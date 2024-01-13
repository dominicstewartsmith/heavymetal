import { useEffect, useState } from "react";
import {
  apiGetExerciseData,
  apiGetLogData,
  apiDeleteFromLog,
  apiAddNewSet,
} from "../apiService";

export default function Log({
  date,
  setDate,
  log,
  setLog,
  generateDateString,
}) {
  const [selectedExercise, setSelectedExercise] = useState({});
  const [selectedExerciseSets, setSelectedExerciseSets] = useState({}); //the weights and reps for the currently selected exercise
  const [nextSet, setNextSet] = useState(["", ""]);

  const exercisesForCurrentDate = log.map((item) => item.exercises).flat(); //All exercises for the selected day as a flat array
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

  const today = new Date();

  async function reloadLog(date) {
    const reloadLog = await apiGetLogData(date);
    if (reloadLog.length > 0) setLog(reloadLog[0].data);
    else setLog([]);
  }

  function handleDateChange(e) {
    setDate(e.target.value);
    reloadLog(e.target.value);
  }

  async function handleDateClick(action) {
    let newDate = new Date(date);
    if (action == "+") newDate.setDate(newDate.getDate() + 1);
    if (action == "-") newDate.setDate(newDate.getDate() - 1);
    if (action == "=") newDate = today;

    newDate = generateDateString(newDate);
    setDate(newDate);
    reloadLog(newDate);
  }

  function handleSelectedExercise(e) {
    for (let i of exercisesForCurrentDate) {
      if (i.name == e.target.innerHTML) setSelectedExercise(i.name);
      setSelectedExerciseSets({ weight: i.weight, reps: i.reps });
    }
  }

  async function handleDeleteFromLog(data) {
    await apiDeleteFromLog(data);
    await reloadLog(date);
  }

  async function handleNewSet() {
    if (nextSet[0] != "" || nextSet[1] != "") {
      const data = {
        date,
        name: selectedExercise,
        weight: nextSet[0],
        reps: nextSet[1],
      };

      //Send update to server
      await apiAddNewSet(data);
      //Re-load log
    }
  }

  function handleNewSetChange(event, field) {
    //Sanitise the user input to only allow digits.
    let current = event.target.value;
    const forbiddenChars = /[^\d]/g;

    if (forbiddenChars.test(current)) {
      alert("You may only enter digits!");
    } else {
      current = Number(current);
      setNextSet((prev) => {
        let update = [];

        if (field == 0) {
          update[0] = current;
          update[1] = prev[1];
        } else {
          update[0] = prev[0];
          update[1] = current;
        }

        return update;
      });
    }
  }

  let selectedExerciseComponentConstructor = [];
  // Only execute if the user has selected an exercise
  if (Object.keys(selectedExerciseSets).length) {
    //Begin constructing the array which will hold the new components that display the weights/reps
    for (let i = 0; i < selectedExerciseSets.reps.length; i++) {
      selectedExerciseComponentConstructor.push(
        <Set
          key={i}
          id={i}
          weight={selectedExerciseSets.weight[i]}
          reps={selectedExerciseSets.reps[i]}
          selectedExerciseSets={selectedExerciseSets}
          setSelectedExerciseSets={setSelectedExerciseSets}
        />
      );
    }

    const addNewSetInput = (
      <section key={"inputControls"}>
        Weight
        <input
          type="text"
          value={nextSet[0]}
          onChange={(e) => handleNewSetChange(e, 0)}
        ></input>
        Reps
        <input
          type="text"
          value={nextSet[1]}
          onChange={(e) => handleNewSetChange(e, 1)}
        ></input>
        <button onClick={handleNewSet}>Save Set</button>
      </section>
    );
    selectedExerciseComponentConstructor.push(addNewSetInput);
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
        <h1>Log</h1>
        {selectedExerciseComponentConstructor.length > 0 &&
          selectedExerciseComponentConstructor}
      </section>
    </>
  );
}

function Set({
  id,
  weight,
  reps,
  selectedExerciseSets,
  setSelectedExerciseSets,
}) {
  //Component to render each set of the current exercise

  function handleClick(action, qty, type) {
    // If the action request is to decrement, and either the weight is 0 or reps are at 1, do nothing.
    if (
      !(
        action === "-" &&
        ((type === "weight" && weight === 0) || (type === "reps" && reps === 1))
      )
    ) {
      let update = { ...selectedExerciseSets };
      action == "+" ? (update[type][id] += qty) : (update[type][id] -= qty);

      setSelectedExerciseSets(update);
    }
  }

  function handleChange() {
    //send update request to the server
  }

  function handleRemoveSet() {
    //TODO send server update request
    let update = { ...selectedExerciseSets };
    update.weight.splice(id, 1);
    update.reps.splice(id, 1);

    setSelectedExerciseSets(update);
  }

  return (
    <>
      <div>
        Weight
        <input type="text" value={weight} min="0" onChange={handleChange} />
        <button onClick={() => handleClick("+", 1, "weight")}>+</button>
        <button onClick={() => handleClick("-", 1, "weight")}>-</button>
        Reps
        <input type="text" value={reps} min="1" onChange={handleChange} />
        <button onClick={() => handleClick("+", 1, "reps")}>+</button>
        <button onClick={() => handleClick("-", 1, "reps")}>-</button>
        <button onClick={handleRemoveSet}>Remove Set</button>
      </div>
    </>
  );
}
