import { useState } from "react";

export default function Log({ date, setDate, log }) {
  function handleDateChange(e) {
    setDate(e.target.value);
  }

  return (
    <>
      <input type="date" value={date} onChange={handleDateChange}></input>
      <section>
        <h1>Lifts</h1>

        {log.length &&
          log.map((log) => {
          })}
      </section>

      <section>
        <h1>Log</h1>
      </section>
    </>
  );
}
