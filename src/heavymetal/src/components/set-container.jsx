import { useState, useEffect } from "react";
import Set from "./set";
import { apiAddNewSet, apiGetLogData } from "../apiService";
//Component holds the display per set, and the new set adder

/*
  weights & reps
  selected exercise, date, new set
*/

export default function SetContainer({
  date,
  selectedExercise,
  setSelectedExercise,
}) {
  const [nextSet, setNextSet] = useState(["", ""]);
  useEffect(() => {
    //Reset the next set controls if the selected exercise changes.
    setNextSet(["", ""]);
  }, [selectedExercise]);

  //Handler functions
  async function handleNewSet() {
    if (nextSet[0] == "" || nextSet[1] == "") {
      alert("You must enter both a weight and reps for this set.");
    } else {
      const data = {
        date,
        name: selectedExercise.name,
        weight: nextSet[0],
        reps: nextSet[1],
      };
      //Send update to server
      await apiAddNewSet(data);
      //Update selectedExercise with new set to re-render the list of sets
      const update = { ...selectedExercise };
      update.weight.push(nextSet[0]);
      update.reps.push(nextSet[1]);
      setSelectedExercise(update);
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

  let setComponentConstructor = [];
  for (let i = 0; i < selectedExercise.reps.length; i++) {
    setComponentConstructor.push(
      <>
        <Set
          key={i}
          id={i}
          date={date}
          selectedExercise={selectedExercise}
          setSelectedExercise={setSelectedExercise}
        />
      </>
    );
  }

  // After rendering the set list, render the controls for a new set
  // Only show the controls if there is an exercise selected
  let newSetControls;
  if (Object.keys(selectedExercise).length > 0) {
    newSetControls = (
      <section key={"inputControls"}>
        <div className="set-new-container">
        <div>Add Set</div>
        <span className="set-new-weight-title">Weight (KG)</span>
        <input
          className="set-new-weight-input"
          type="text"
          value={nextSet[0]}
          onChange={(e) => handleNewSetChange(e, 0)}
        />
        <button className="set-new-weight-plus">+</button>
        <button className="set-new-weight-minus">-</button>
        <span className="set-new-reps-title">Reps</span>
        <input
          className="set-new-reps-input"
          type="text"
          value={nextSet[1]}
          onChange={(e) => handleNewSetChange(e, 1)}
        ></input>
        <button className="set-new-save" onClick={handleNewSet}>Save Set</button>
        <button className="set-new-reps-plus">+</button>
        <button className="set-new-reps-minus">-</button>
        </div>
      </section>
    );
  }

  return (
    <>
      <p className="set-exerciseName">{selectedExercise.name}</p>
      <br />
      {setComponentConstructor}
      {newSetControls}
    </>
  );
}
