import { BarChart } from "../components/charts/bar-chart";
import { LineChart } from "../components/charts/line-chart";
import RealTimeData from "../components/real-time-data";

export default function Home() {
  const data = [
    { feature: "A", time: 4048 },
    { feature: "B", time: 2269 },
    { feature: "C", time: 3206 },
    { feature: "D", time: 2276 },
    { feature: "E", time: 3045 },
    { feature: "F", time: 2384 },
  ];

  const lineData = [
    {
      x: "2024-10-01",
      y: 120,
    },
    {
      x: "2024-10-02",
      y: 135,
    },
    {
      x: "2024-10-03",
      y: 100,
    },
    {
      x: "2024-10-04",
      y: 150,
    },
    {
      x: "2024-10-05",
      y: 180,
    },
    {
      x: "2024-10-06",
      y: 140,
    },
    {
      x: "2024-10-07",
      y: 160,
    },
  ];

  return (
    <div>
      <h1>Hello World</h1>
      <BarChart data={data} width={500} height={500} />
      <LineChart data={lineData} width={500} height={500} />
      <RealTimeData />
    </div>
  );
}
