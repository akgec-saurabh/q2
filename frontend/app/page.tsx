import { BarChart } from "../components/charts/bar-chart";
import { LineChart } from "../components/charts/line-chart";

const getData = async () => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}data/features`;
  console.log(url);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  return data.data.data;
};

export default async function Home() {
  const barData = await getData();
  console.log(barData);

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
      <BarChart data={barData} width={500} height={500} />
      <LineChart data={lineData} width={500} height={500} />
    </div>
  );
}
