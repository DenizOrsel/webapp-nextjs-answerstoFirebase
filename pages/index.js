import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import "firebase/database";
import Chart from "chart.js/auto"; // Import Chart.js

// Your Firebase configuration
const firebaseConfig = {
  // Your Firebase config values (apiKey, authDomain, projectId, etc.)
  projectId:"nfield-log",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function HomePage() {
  const [logData, setLogData] = useState([]);
  const [chartData, setChartData] = useState({});

  // Ref to keep track of the chart instance
  const chartRef = useRef(null);

  useEffect(() => {
    // Create a reference to your Firebase Realtime Database
    const databaseRef = firebase.database().ref("answerLog");

    // Define the real-time listener function
    const handleDataChange = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Aggregate the data
        const aggregatedData = {};
        for (const key in data) {
          const answer = data[key];
          if (aggregatedData[answer]) {
            aggregatedData[answer]++;
          } else {
            aggregatedData[answer] = 1;
          }
        }

        // Convert the aggregated data to Chart.js format
        const labels = Object.keys(aggregatedData);
        const values = Object.values(aggregatedData);

        // Update the state with aggregated data
        setLogData(
          labels.map((label, index) => ({ id: index, answer: label }))
        );
        setChartData({
          labels,
          datasets: [
            {
              label: "Answers",
              data: values,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      }
    };

    // Attach the real-time listener
    databaseRef.on("value", handleDataChange);

    // Detach the listener when the component unmounts
    return () => databaseRef.off("value", handleDataChange);
  }, []);

  // Use Chart.js to create a bar chart
  useEffect(() => {
    if (chartData.labels && chartData.labels.length > 0) {
      // If a previous chart instance exists, destroy it before creating a new one
      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const ctx = document.getElementById("barChart").getContext("2d");
      const newChart = new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      // Save the chart instance in the ref
      chartRef.current = newChart;
    }
  }, [chartData]);

  return (
    <div>
      <h1>Responses</h1>
      <div className="chart">
        <canvas id="barChart" width="400" height="200"></canvas>
      </div>
    </div>
  );
}

export default HomePage;
