import { useState } from "react";

export default function Log({ date, setDate, log, setLog }) {
  const [selected, setSelected] = useState({})
  const [exerciseScheme, setExerciseScheme] = useState([])

  const exerciseArray = log.map((item) => item.exercises).flat();
  const exerciseNames = exerciseArray.map(item => {
    return <button onClick={handleExerciseSelection}>{item.name}</button>
  });

  function handleDateChange(e) {
    //TODO request new data from server on date change
    setDate(e.target.value);
  }

  function handleDateNavigate(e) {

  }

  function handleExerciseSelection(e) {
    for (let i of exerciseArray) {
      if (i.name == e.target.innerHTML) {
        setSelected(i)
        setExerciseScheme(prev => {return [{weight: i.weight, reps: i.reps}]})
      }
    }
  }
  
  let schemeOutput = exerciseScheme.map(exercise => {
    const output = exercise.weight.map( (weight, index) => {
      const rep = exercise.reps[index];
      return (
        <>
        <div>
          Weight
          <input type="text" value={weight} min="0"></input>
          <button>+</button>
          <button>-</button>
          Reps
          <input type="text" value={rep} min="1"/>
          <button>+</button>
          <button>-</button>
        </div>
        </>
      )
    });

    return output;
  })

  return (
    <>
      <button>-</button>
      <input type="date" value={date} onChange={handleDateChange}></input>
      <button>+</button>
      <button>Today</button>
      <section>
        <h1>Lifts</h1>

        {log.length &&
          exerciseNames}
      </section>

      <section>
        <h1>Log</h1>

        {exerciseScheme.length &&
          schemeOutput}
      </section>
    </>
  );
}
