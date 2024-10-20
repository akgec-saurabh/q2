"use client";

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { BarChart } from "./charts/bar-chart";
const socket = io("http://localhost:5000");

export default function RealTimeData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Listen for 'data' lineevent from the server
    socket.on("data", (updatedData) => {
      console.log("Received updated data:", updatedData);
      setData(updatedData); // Update state with new data
    });

    // Clean up the connection when the component unmounts
    return () => {
      socket.off("data");
    };
  }, []);

  return (
    <div>
      RealTimeData
      <BarChart data={data} width={500} height={500} />
    </div>
  );
}
