import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { format } from "date-fns";
import Chart from "./Chart";

type ERROR = "N/A";
export interface RawDataPoint {
  temp: number | ERROR;
  date: Date;
}
export interface DataPoint {
  temp: number;
  date: Date;
}

function App() {
  const [data, setData] = useState<DataPoint>();
  const [time, setTime] = useState<Date>();
  const [timeFetched, setTimeFetched] = useState<Date>();
  const [historicData, setHistoricData] = useState<DataPoint[]>([]);
  const [extremes, setExtremes] = useState<DataPoint[]>([]);

  useEffect(() => {
    async function fetch() {
      const response = await axios.get(
        `https://chicken-api.us-east-1.linodeobjects.com/`
      );

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      const keys = xmlDoc.getElementsByTagName("Key");
      const length = keys.length;
      let keyArray = [];
      for (var i = 0; i < length; i++) {
        keyArray.push(keys[i].innerHTML);
      }
      keyArray = keyArray.filter((elem) => elem.startsWith("daily_"));
      keyArray.sort().reverse();
      console.log(keyArray);
      const filename = keyArray[0];

      const record = await axios.get(
        `https://chicken-api.us-east-1.linodeobjects.com/` + filename
      );
      setData(record.data);
      const stamp = parseInt(filename.slice(6).split(".")[0]) * 1000;
      const t = new Date(stamp);
      setTime(t);
      setTimeFetched(new Date());

      const historicKeys = keyArray.filter((elem) => {
        const str = elem.slice(6, -1);
        const date = new Date(parseInt(str) * 1000);
        const day = 1000 * 60 * 60 * 24;

        return date.getTime() > Date.now() - day;
      });
      let pulledHistData = await Promise.all(
        historicKeys.map((key) =>
          axios.get(`https://chicken-api.us-east-1.linodeobjects.com/` + key)
        )
      );
      const rawProcHistData = pulledHistData.map((e) => ({
        ...e.data,
        date: new Date(
          parseInt(e.request.responseURL.slice(-14).slice(0, -4)) * 1000
        ),
      })) as RawDataPoint[];

      const procHistData = rawProcHistData.filter(
        (elem) => elem.temp !== "N/A"
      ) as DataPoint[];

      setHistoricData(procHistData);
      console.log(procHistData);
      const phd = [...procHistData];
      const low = phd.sort((a, b) => a.temp - b.temp)[0];
      const high = phd.sort((a, b) => b.temp - a.temp)[0];
      setExtremes([low, high]);
    }
    fetch();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>Danny's Chicken Coop Monitor</h3>
        <p>Current Temps: {data?.temp}</p>
        {time && <p>Time Recorded: {format(time, "PPpp")}</p>}
        {timeFetched && <p>Time Fetched: {format(timeFetched, "PPpp")}</p>}

        <p>24 Hour Low: {extremes[0]?.temp ?? "N/A"}</p>
        <p>24 Hour High: {extremes[1]?.temp ?? "N/A"}</p>

        <div style={{ width: "50%", background: "white" }}>
          <Chart data={historicData} />
        </div>
        <p></p>
      </header>
      <body></body>
    </div>
  );
}

export default App;
