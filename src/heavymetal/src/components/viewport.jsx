import { Route, Routes } from "react-router-dom";
import Log from "./log.jsx";
import Exercises from "./exercises.jsx";
import { useEffect, useState } from "react";
import { apiGetLogData } from "../apiService.jsx";

function generateDateString(date) {
  //The Date input element in HTML takes a format of YYYY-MM-DD which needs
  //to be constructed because there is no native method!
  const currentDate = new Date(date);

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so we add 1
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

export default function ViewPort() {
  //Date is handled in the viewport because both components need access to it.
  const [date, setDate] = useState(generateDateString(new Date()));
  const [log, setLog] = useState([]);

  useEffect(() => {
    async function loadLog() {
      //Mongoose returns the result in an array,
      //but because we are only finding a single document just split out the 0th element
      //and send the data property as the prop, making handling the mapping a bit cleaner the Log component

      const today = generateDateString(new Date()); //When the app loads by default we show the data for the current day
      const logForCurrentDate = await apiGetLogData(today);

      if (logForCurrentDate.length > 0) setLog(logForCurrentDate[0].data)
      else setLog([])

      //setLog(result[0].data);
    }

    loadLog();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Log
            date={date}
            setDate={setDate}
            log={log}
            setLog={setLog}
            generateDateString={generateDateString}
          />
        }
      />
      <Route
        path="/mgmt"
        element={<Exercises date={date} log={log} setLog={setLog} />}
      />
    </Routes>
  );
}
