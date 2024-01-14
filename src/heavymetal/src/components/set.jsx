export default function Set({
  id,
  selectedExercise,
  setSelectedExercise
}) {
  //Component to render each set of the current exercise

  function handleClick(action, qty, type) {
    // If the action request is to decrement, and either the weight is 0 or reps are at 1, do nothing.
    if (
      !(
        action === "-" &&
        ((type === "weight" && selectedExercise.weight[id] === 0) || (type === "reps" && selectedExercise.reps[id] === 1))
      )
    ) {
      let update = { ...selectedExercise };
      action == "+" ? (update[type][id] += qty) : (update[type][id] -= qty);

      setSelectedExercise(update);
    }
  }

  function handleChange(event, type) {
    //TODO send update request to the server

    const forbiddenChars = /[^\d]/g
    if (forbiddenChars.test(event.target.value)) {
      alert('You may only enter digits!')
    } else {
      let update = {...selectedExercise};
      if (type == 'weight') update.weight[id] = event.target.value
      if (type == 'reps') update.reps[id] = event.target.value
      setSelectedExercise(update)
    }
  }

  function handleRemoveSet() {
    //TODO send server update request
    let update = { ...selectedExercise };
    update.weight.splice(id, 1);
    update.reps.splice(id, 1);

    setSelectedExercise(update);
  }

  return (
    <>
      <div>
        Weight
        <input type="text" value={selectedExercise.weight[id]} min="0" onChange={(e) => handleChange(e, 'weight')}/>
        <button onClick={() => handleClick("+", 1, "weight")}>+</button>
        <button onClick={() => handleClick("-", 1, "weight")}>-</button>
        Reps
        <input type="text" value={selectedExercise.reps[id]} min="1" onChange={(e) => handleChange(e, 'reps')}/>
        <button onClick={() => handleClick("+", 1, "reps")}>+</button>
        <button onClick={() => handleClick("-", 1, "reps")}>-</button>
        <button onClick={handleRemoveSet}>Remove Set</button>
      </div>
    </>
  );
}