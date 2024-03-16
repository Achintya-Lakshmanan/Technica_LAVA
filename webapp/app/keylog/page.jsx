"use client";

import Navbar from "@/components/Navbar";
import styles from "./page.module.css";
import { useState } from "react";

function Keylog() {
    
    var keyPressLogs = [];

    var keyPressStartTime = {};

    function handleKeyDown(event) {
      var key = event.key;
      var time = new Date().getTime();
      keyPressStartTime[key] = time;
      keyPressLogs.push(time);
      console.log(key)
    }

    function handleKeyUp(event) {
      var key = event.key;
      var time = new Date().getTime();
      if (keyPressStartTime[key]) {
        keyPressLogs.push(time);
        delete keyPressStartTime[key];
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    function sendLogsToFlask() {
      const xhr = new XMLHttpRequest();
      const url = 'http://localhost:5000/save-logs';
      const data = JSON.stringify(keyPressLogs);

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onMiddle = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          console.log('Logs sent to Flask successfully.');
        }
      };

      xhr.send(data);
    }

    window.addEventListener('beforeunload', sendLogsToFlask);

    function retrieveKeyPressLogs() {
      const jsonLogs = localStorage.getItem('keypresslogs');
      if (jsonLogs) {
        keyPressLogs = JSON.parse(jsonLogs);
        console.log(keyPressLogs)
        console.log('KeyPress logs retrieved successfully.');
      }
    }

    function clearKeyPressLogs() {
      localStorage.removeItem('keypresslogs');
      keyPressLogs = [];
      console.log('KeyPress logs cleared successfully.');
    }

    window.addEventListener('click', clearKeyPressLogs);
    window.addEventListener('load', retrieveKeyPressLogs);

    function send() {
        const response = fetch('http://localhost:5173/save-logs', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(keyPressLogs)
          }).then(response => response.json())
    }

    const [onClick, setOnClick] = useState(false);

    return <>
        <Navbar page={2} />

        <div className={styles.outerBox}>
            <div className={styles.box}>
                <h1>Key Press Logger</h1>
                <p>Type something in this document.</p>
                <button className={styles.this} onClick={e => setOnClick(true)}>Submit</button>
            </div>
        </div>

        {prediction && <div style={{ textAlign: "center"}}>{prediction}</div>}
        <div style={{textAlign: "center", margin: "100px"}}></div>

    </>

    
}

export default Keylog;
