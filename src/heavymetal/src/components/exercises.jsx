import Get, { AddExercise } from "../apiService";
import { useState, useEffect } from "react";

export default function Exercises() {
  const [allData, setAllData] = useState([]);
  const [displayData, setDisplayData] = useState([]);

  const [currentCategory, setCurrentCategory] = useState("");
  const [newExercise, setNewExercise] = useState("");

  function handleClick(e) {
    setSelected(e.target.innerHTML);
  }

  async function handleCreate(category, exercise) {
    if (!displayData.includes(exercise)) {
      //Request that the server creates a new exercise
      const body = { category, exercise };
      await AddExercise(body);
    } else {
      //the exercise already exists in the database
      console.log("no");
    }
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
    setNewExercise(e.target.value);
  }

  useEffect(() => {
    async function loadExercises() {
      try {
        setAllData(await Get());
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
                <button>Add to log</button>
                <button>Delete from database</button>
              </li>
            );
          })}
        </ul>

        {/* Conditionally render the ability to create a new exercise */}
        {displayData.length > 0 && (
          <>
            <button onClick={() => handleCreate(currentCategory, newExercise)}>
              Create
            </button>
            <input type="text" onChange={handleChange}></input>
          </>
        )}
      </div>
    </>
  );
}
