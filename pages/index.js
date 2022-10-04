import React, { useState, useEffect } from "react";

function HomePage() {
  let [logData, setLogData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://nfield-log-default-rtdb.firebaseio.com/answerLog.json"
      );
      const data = await response.json();
      const transformedData = [];
      for (const key in data) {
        transformedData.push({
          id: key,
          answer: data[key],
        });
      }
      setLogData(transformedData);
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1>Nfield Logger</h1>
      <div>
        <ul>
          {logData.map((log) => (
            <li key={log.id}>{log.answer}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HomePage;
