import { getSocket } from "../../context/Socket";
import styles from "../../styles/room.module.scss";

export default function Result({ Votes, Master }) {
  return (
    <div className={styles.startContainer}>
      <h3 className="animate__animated animate__fadeInDown">
        The round is over! check the results and wait for the master to start a
        new round.
      </h3>{" "}
      <section className={styles.voteArea}>
        <div className="animate__animated animate__fadeInDown">
          <img
            className={Votes.FACT <= Votes.LIE ? styles.active : null}
            src="/boredom-emoji.svg"
          />
          <p>LIES: {Votes.LIE}</p>
        </div>
        <div className="animate__animated animate__fadeInDown">
          <img
            className={Votes.FACT >= Votes.LIE ? styles.active : null}
            src="/kiss-emoji.svg"
          />
          <p>FACTS: {Votes.FACT}</p>
        </div>
      </section>
      {Master ? (
        <button
          className="animate__animated animate__fadeInDown"
          onClick={() => {
            getSocket().emit("start");
          }}
        >
          START ROUND
        </button>
      ) : null}
    </div>
  );
}
