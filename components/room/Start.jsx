import { getSocket } from "../../context/Socket";
import styles from "../../styles/room.module.scss";

export default function Start({ Master }) {
  return (
    <div className={styles.startContainer}>
      <img
        className="animate__animated animate__fadeInDown"
        src="/smirk-emoji.svg"
      />
      {Master ? (
        <button
          className="animate__animated animate__fadeInDown"
          onClick={() => {
            getSocket().emit("start");
          }}
        >
          START ROUND
        </button>
      ) : (
        <h3>Wait for the room master to start the round</h3>
      )}
    </div>
  );
}
