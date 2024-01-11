import { Route, Routes } from "react-router-dom";
import Log from "./log.jsx";
import Exercises from "./exercises.jsx";
import { useEffect, useState } from "react";
import { apiGetLog } from "../apiService.jsx";

function createDefaultDateString() {
  //The Date input element in HTML takes a format of YYYY-MM-DD which needs
  //to be constructed because there is no native method!
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so we add 1
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

export default function ViewPort() {
  //Date is handled in the viewport because both components need access to it.
  const [date, setDate] = useState(createDefaultDateString());
  const [log, setLog] = useState([]);

  useEffect(() => {
    async function loadLog() {
      setLog(await apiGetLog('2024-11-02'))
    }

    loadLog();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Log date={date} setDate={setDate} log={log}/>} />
      <Route path="/mgmt" element={<Exercises date={date} />} />
    </Routes>
  );
}
