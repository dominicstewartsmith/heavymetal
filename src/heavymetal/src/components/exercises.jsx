import apiGet, { apiAddExercise, apiDeleteExercise } from "../apiService";
import { useState, useEffect } from "react";

export default function Exercises({ date }) {
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
      await apiAddExercise(body);

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

  function handleAddToLog(obj) {
    //send post request with obj and date
    //append to the date the exercise
  }

  //TODO add loading stage/if no server
  useEffect(() => {
    async function loadExercises() {
      try {
        const data = await apiGet();
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
            <button onClick={() => handleCategory(item.category)}>
              {item.category}
            </button>
          </div>
        );
      })}

      {/* Creates the list of exercises per selected category */}
      <div>
        <ul>
          {displayData.map((item) => {
            return (
              <li key={item}>
                {item}
                <button onClick={() => handleAddToLog({currentCategory, exercise: item})}>Add to log</button>
                <button onClick={() => handleDeleteExercise(item)}>
                  Delete from database
                </button>
              </li>
            );
          })}
        </ul>

        {/* Conditionally render the ability to create a new exercise */}
        {displayData.length > 0 && (
          <>
            <button
              onClick={() => handleCreateExercise(currentCategory, newExercise)}
            >
              Create
            </button>
            <input
              type="text"
              value={newExercise}
              onChange={handleChange}
            ></input>
          </>
        )}
      </div>
    </>
  );
}
