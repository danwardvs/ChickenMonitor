import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { format } from "date-fns";
import ReactApexChart from "react-apexcharts";

interface DataPoint {
  temp: number;
  date: Date;
}

function App() {
  const [data, setData] = useState<DataPoint>();
  const [time, setTime] = useState<Date>();
  const [timeFetched, setTimeFetched] = useState<Date>();
  const [historicData, setHistoricData] = useState<DataPoint[]>([]);

  const options = {
    chart: {
      height: 350,

      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    title: {
      text: "Temperatures in the past 24 hours",
      align: "left",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
  };

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
      const procHistData = pulledHistData.map((e) => ({
        ...e.data,
        date: new Date(
          parseInt(e.request.responseURL.slice(-14).slice(0, -4)) * 1000
        ),
      })) as DataPoint[];
      setHistoricData(procHistData);
      console.log(procHistData);
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
        <div style={{ width: "50%", background: "white" }}>
          <ReactApexChart
            // @ts-expect-error dum
            options={options}
            series={[
              {
                name: "Desktops",
                data: historicData.map((e) => ({
                  x: e.date.getTime(),
                  y: e.temp,
                })),
              },
            ]}
            type="line"
            height={350}
          />
        </div>
        <p></p>
      </header>
      <body></body>
    </div>
  );
}

export default App;
