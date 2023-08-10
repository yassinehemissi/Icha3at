import { useState } from "react";
import { getSocket } from "../context/Socket";
import styles from "../styles/disclaimer.module.scss";

export default function Disclaimer({ setRulesShown }) {
  const [Name, setName] = useState("")
  return (
    <div className={styles.container}>
      <h1>DISCLAIMER</h1>
      <p>
        THIS SPACE IS SET FOR ENTERTAINEMENT
        <br />
        AND SHOULD NOT BECOME A WAY TO HARM <br />
        OR RUIN PEOPLE RELATIONSHIPS OR LIVES. <br />
      </p>
      <input placeholder="TYPE YOUR NAME" value={Name} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => {
        if (Name.length > 2) {
          getSocket().emit("set_name", { Name: Name });
          setRulesShown(true)
        }
      }}>I AGREE</button>
    </div>
  );
}
