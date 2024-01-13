function Set({
  id,
  weight,
  reps,
  selectedExerciseSets,
  setSelectedExerciseSets,
}) {
  //Component to render each set of the current exercise
  const [nextSet, setNextSet] = useState(["", ""]);

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
  function handleRemoveSet() {
    //TODO send server update request
    let update = { ...selectedExerciseSets };
    update.weight.splice(id, 1);
    update.reps.splice(id, 1);

    setSelectedExerciseSets(update);
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
      {addNewSetInput}
    </>
  );
}
