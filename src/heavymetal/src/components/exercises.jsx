import {
  apiGetExerciseData,
  apiAddNewExercise,
  apiDeleteExercise,
  apiAddToLog,
  apiGetLogData,
} from "../apiService";
import { useState, useEffect } from "react";

export default function Exercises({ date, log, setLog }) {
  const [allData, setAllData] = useState([]);
  const [displayData, setDisplayData] = useState([]);

  const [currentCategory, setCurrentCategory] = useState("");
  const [newExercise, setNewExercise] = useState("");

  async function handleCreateExercise(category, exercises) {
    if (!newExercise) {
      alert("You must input a name for the exercise.");
      return;
    }

    if (!displayData.includes(exercises)) {
      //Request that the server creates a new exercise
      const body = { category, exercises };

      //TODO - verify that the data was actually added and only then update the hook
      //atm it re-renders even if the data failed to add
      await apiAddNewExercise(body);

      //Update the hook containing all the data, so that the list re-renders
      //only refreshes visually, doesnt re-query db
      let update = [...allData];
      for (let i of update) {
        if (i.category == category) {
          i.exercises.push(exercises);
        }
      }
      update.forEach((category) => category.exercises.sort());
      setAllData(update);

      setNewExercise("");
    } else {
      alert("This exercise already exists.");
      setNewExercise("");
    }
  }

  async function handleDeleteExercise(item) {
    await apiDeleteExercise({ category: currentCategory, exercises: item });
    const update = [...allData];

    for (let i of update) {
      if (i.category == currentCategory) {
        i.exercises.splice(i.exercises.indexOf(item), 1);
      }
    }

    update.forEach((category) => category.exercises.sort());
    setAllData(update);
  }

  function handleCategory(category) {
    for (let i of allData) {
      if (i.category == category) {
        setCurrentCategory(i.category);
        setDisplayData(i.exercises);
      }
    }
  }

  function handleChange(e) {
    //Sanitise the user input to only allow Latin characters and spaces.
    const current = e.target.value;
    const forbiddenChars = /[^a-zA-Z ]/g;

    if (forbiddenChars.test(current)) {
      alert("You may only use letters for the exercise name.");
    } else {
      setNewExercise(e.target.value);
    }
  }

  async function handleAddToLog(data) {
    //Forbid adding the same exercise twice
    const exerciseList = log
      .map((exercises) => exercises.exercises.map((name) => name.name))
      .flat();

    if (exerciseList.includes(data.name)) {
      alert("Each exercise may only be logged once per workout.");
    } else {
      await apiAddToLog(data);
      const reloadLog = await apiGetLogData(date);
      setLog(reloadLog[0].data);
    }
  }

  //TODO add loading stage/if no server
  useEffect(() => {
    async function loadExercises() {
      try {
        const data = await apiGetExerciseData();
        data.forEach((category) => category.exercises.sort());

        setAllData(data);
      } catch (error) {
        console.log(error);
      }
    }

    loadExercises();
  }, []);

  return (
    <>
      {/* {Creates the category buttons} */}
      {allData.map((item) => {
        return (
          <div key={item._id}>
            <button onClick={() => handleCategory(item.category)} className="mgmt-category">
              {item.category}
            </button>
          </div>
        );
      })}

      {/* Creates the list of exercises per selected category */}
      <div>
        <br />
        {currentCategory != "" && <div className="mgmt-currentCategory">{currentCategory}</div>}
        <div>
          {displayData.map((item) => {
            return (
              <div key={item}>
                <button className="mgmt-exercise-delete" onClick={() => handleDeleteExercise(item)}>-</button>
                <button className="mgmt-exercise-name" onClick={() => handleAddToLog({date, category: currentCategory, name: item})}>Log {item}</button>
              </div>
            );
          })}
        </div>

        {/* Conditionally render the ability to create a new exercise */}
        {displayData.length > 0 && (
          <>
          <br />
            <button className="mgmt-exercise-newCreate" onClick={() => handleCreateExercise(currentCategory, newExercise)}>Create</button>
            <input
              type="text"
              value={newExercise}
              onChange={handleChange}
              maxLength="27"
              className="mgmt-exercise-newInput"
            ></input>
          </>
        )}
      </div>
    </>
  );
}
