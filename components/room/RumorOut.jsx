import { useState, useEffect } from "react";
import { getSocket } from "../../context/Socket";
import styles from "../../styles/room.module.scss";

export default function RumorOut({ rumor, VoteCount }) {
  const [Vote, setVote] = useState("CHOOSE");
  const [Seconds, setSeconds] = useState(60);
  useEffect(() => {
    setTimeout(() => {
      setSeconds(Seconds - 1);
    }, 1000);
  }, [Seconds]);
  return (
    <div className={styles.startContainer}>
      <h3>
        Choose one of the emojis then lock your vote using the lock button, the
        vote end once everyone voted:
      </h3>
      <textarea
        className="animate__animated animate__fadeInDown"
        value={rumor}
        disabled
      ></textarea>
      <section className={styles.voteArea}>
        <div className="animate__animated animate__fadeInDown">
          <img
            className={Vote == "LIE" ? styles.active : null}
            onClick={() => {
              if (!Vote.includes("LOCKED")) setVote("LIE");
            }}
            src="/boredom-emoji.svg"
          />
          <p>LIE</p>
        </div>
        <div className="animate__animated animate__fadeInDown">
          <img
            className={Vote == "FACT" ? styles.active : null}
            onClick={() => {
              if (!Vote.includes("LOCKED")) setVote("FACT");
            }}
            src="/kiss-emoji.svg"
          />
          <p>FACT</p>
        </div>
      </section>
      <button
        className="animate__animated animate__fadeInDown"
        onClick={() => {
          if (Vote != "LIE" && Vote != "FACT") return;
          getSocket().emit("vote", { Vote: Vote });
          setVote("LOCKED " + Vote);
        }}
      >
        {Vote.includes("LOCKED") ? Vote : "LOCK VOTE"}
      </button>
      <h3>Timer: {Seconds}s</h3>
      <h3>Current Votes: {VoteCount}</h3>
    </div>
  );
}
