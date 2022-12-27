import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { format } from "date-fns";

function App() {
  const [data, setData] = useState("");
  const [time, setTime] = useState<Date>();
  const [timeFetched, setTimeFetched] = useState<Date>();

  useEffect(() => {
    async function fetch() {
      const response = await axios.get(
        `https://chicken-api.us-east-1.linodeobjects.com/`
      );

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      const keys = xmlDoc.getElementsByTagName("Key");
      const length = keys.length;
      const keyArray = [];
      for (var i = 0; i < length; i++) {
        keyArray.push(keys[i].innerHTML);
      }
      keyArray.sort();
      const filename = keyArray[0];

      const record = await axios.get(
        `https://chicken-api.us-east-1.linodeobjects.com/` + filename
      );
      setData(record.data);
      const stamp = parseInt(filename.slice(6).split(".")[0]) * 1000;
      const t = new Date(stamp);
      setTime(t);
      setTimeFetched(new Date());
    }
    fetch();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>Danny's Chicken Coop Monitor</h3>
        <p>Current Temps: {data}</p>
        {time && <p>Time Recorded: {format(time, "PPpp")}</p>}
        {timeFetched && <p>Time Fetched: {format(timeFetched, "PPpp")}</p>}

        <p></p>
      </header>
    </div>
  );
}

export default App;
