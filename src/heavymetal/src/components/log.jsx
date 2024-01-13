import { useEffect, useState } from "react";
import { apiGetExerciseData, apiGetLogData } from "../apiService";

export default function Log({
  date,
  setDate,
  log,
  setLog,
  generateDateString,
}) {
  const [selectedExerciseSets, setSelectedExerciseSets] = useState({}); //the weights and reps for the currently selected exercise

  // let exercisesForCurrentDate = [];
  // let exercisesForCurrentDateComponentConstructor = [];

  // if (log.length > 0) {
  //   console.log('log', log)
  //   exercisesForCurrentDate = log.map((item) => item.exercises).flat(); //All exercises object for the selected day as a flat array
  //   console.log('flat array', exercisesForCurrentDate)
  //   exercisesForCurrentDateComponentConstructor = exercisesForCurrentDate.map(
  //     (item) => {
  //       console.log('name', item.name)
  //       return (
  //         <button key={item.name} onClick={handleSelectedExercise}>
  //           {item.name}
  //         </button>
  //       );
  //     }
  //   );
  // }

  const exercisesForCurrentDate = log.map((item) => item.exercises).flat(); //All exercises for the selected day as a flat array
  const exercisesForCurrentDateComponentConstructor =
    exercisesForCurrentDate.map((item) => {
      return (
        <button key={item?.name} onClick={handleSelectedExercise}>
          {item?.name}
        </button>
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
      if (i.name == e.target.innerHTML)
        setSelectedExerciseSets({ weight: i.weight, reps: i.reps });
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
  }

  // if (loading) return <h1>Loading</h1>

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
    let update = { ...selectedExerciseSets };
    update.weight.splice(id, 1);
    update.reps.splice(id, 1);

    setSelectedExerciseSets(update);

    //If you remove the final set, also remove the exercise
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
