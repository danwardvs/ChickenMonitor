import "./App.css";
import { format } from "date-fns";
import ReactApexChart from "react-apexcharts";
import { DataPoint } from "./App";

const Chart: React.FC<{
  data: DataPoint[];
}> = ({ data }) => {
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
    xaxis: {
      labels: {
        formatter: function (value: number) {
          if (isNaN(value)) return value;
          const y = new Date(value);
          return format(y, "ccc pp");
        },
      },
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
  };

  return (
    <ReactApexChart
      // @ts-expect-error dum
      options={options}
      series={[
        {
          name: "Temperature",
          data: data.map((e) => ({
            x: e.date.getTime(),
            y: e.temp,
          })),
        },
      ]}
      type="line"
      height={350}
    />
  );
};

export default Chart;
