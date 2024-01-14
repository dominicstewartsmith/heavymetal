import { useState } from "react";
import Set from "./set";
//Component holds the display per set, and the new set adder

/*
  weights & reps
  selected exercise, date, new set
*/

export default function SetContainer({ selectedExercise, setSelectedExercise }) {
  const [nextSet, setNextSet] = useState(["", ""]);

  let setComponentConstructor = [];
  for (let i = 0; i < selectedExercise.reps.length; i++) {
    setComponentConstructor.push(
      <Set
        key={i}
        id={i}
        selectedExercise={selectedExercise}
        setSelectedExercise={setSelectedExercise}
      />
    );
  }

  // After rendering the set list, render the controls for a new set
  // Only show the controls if there is an exercise selected
  let newSetControls;
  if (Object.keys(selectedExercise).length > 0) {
    newSetControls = <p>New Set Controls</p>
  }

  return (
    <>
      {setComponentConstructor}
      {newSetControls}
    </>
  )
  // async function handleNewSet() {
  //   if (nextSet[0] != "" || nextSet[1] != "") {
  //     const data = {
  //       date,
  //       name: selectedExercise,
  //       weight: nextSet[0],
  //       reps: nextSet[1],
  //     };

  //     //Send update to server
  //     await apiAddNewSet(data);
  //     //Re-load log
  //     reCalculateSets();
  //     //await reloadLog(today);
  //   }
  // }

  // let selectedExerciseComponentConstructor = [];
  // // Only execute if the user has selected an exercise
  // if (Object.keys(selectedExerciseSets).length) {
  //   //Begin constructing the array which will hold the new components that display the weights/reps
  //   for (let i = 0; i < selectedExerciseSets.reps.length; i++) {
  //     selectedExerciseComponentConstructor.push(
  //       <Set
  //         key={i}
  //         id={i}
  //         weight={selectedExerciseSets.weight[i]}
  //         reps={selectedExerciseSets.reps[i]}
  //         selectedExerciseSets={selectedExerciseSets}
  //         setSelectedExerciseSets={setSelectedExerciseSets}
  //       />
  //     );
  //   }
  // }

  // const addNewSetInput = (
  //   <section key={"inputControls"}>
  //     Weight
  //     <input
  //       type="text"
  //       value={nextSet[0]}
  //       onChange={(e) => handleNewSetChange(e, 0)}
  //     ></input>
  //     Reps
  //     <input
  //       type="text"
  //       value={nextSet[1]}
  //       onChange={(e) => handleNewSetChange(e, 1)}
  //     ></input>
  //     <button onClick={handleNewSet}>Save Set</button>
  //   </section>
  // );
  // selectedExerciseComponentConstructor.push(addNewSetInput);

  // function handleNewSetChange(event, field) {
  //   //Sanitise the user input to only allow digits.
  //   let current = event.target.value;
  //   const forbiddenChars = /[^\d]/g;

  //   if (forbiddenChars.test(current)) {
  //     alert("You may only enter digits!");
  //   } else {
  //     current = Number(current);
  //     setNextSet((prev) => {
  //       let update = [];

  //       if (field == 0) {
  //         update[0] = current;
  //         update[1] = prev[1];
  //       } else {
  //         update[0] = prev[0];
  //         update[1] = current;
  //       }

  //       return update;
  //     });
  //   }
  // }
}
