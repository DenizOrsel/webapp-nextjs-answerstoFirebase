import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/database";

// Your Firebase configuration
const firebaseConfig = {
  // Your Firebase config values (apiKey, authDomain, projectId, etc.)
  projectId: "nfield-log",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function HomePage() {
  let [logData, setLogData] = useState([]);

  useEffect(() => {
    // Create a reference to your Firebase Realtime Database
    const databaseRef = firebase.database().ref("answerLog");

    // Define the real-time listener function
    const handleDataChange = (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const transformedData = Object.entries(data).map(([id, answer]) => ({
          id,
          answer,
        }));
        setLogData(transformedData);
      }
    };

    // Attach the real-time listener
    databaseRef.on("value", handleDataChange);

    // Detach the listener when the component unmounts
    return () => databaseRef.off("value", handleDataChange);
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
