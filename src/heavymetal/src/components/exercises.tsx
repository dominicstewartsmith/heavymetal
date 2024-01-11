function amend (name: string, category: string, action: boolean): boolean {
  //interact with database
  //return true if ok, false if not

  return true;
}

export default function Exercises() {
  return (
    <>
      <h1>Exercise Management</h1>
      <input type="text" name="lift"></input><br></br>
      <input type="text" name="category"></input><br></br>
      <button>Add</button>

      <section>
        <h1>Database</h1>
      </section>
    </>
  )
}