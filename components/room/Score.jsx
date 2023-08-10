import { useState } from "react";
import styles from "../../styles/room.module.scss";


export default function Score({ Players }) {
    const [ScoreOn, setScoreOn] = useState(false)
    return <>
        <div onClick={() => { setScoreOn(!ScoreOn) }} className={`${styles.ScoreCheck} ${ScoreOn ? styles.ScoreOn : styles.ScoreOff}`}>{ScoreOn ? "CLOSE SCORE" : "CHECK SCORE"}</div>
        <div className={`${styles.Score} ${ScoreOn ? styles.ScoreListOn : null}`}>
            <section className={styles.names}>
                <h1>PLAYERS</h1>
                <ul>
                    {Players.map(e => <li key={e[0]}>{e[0]}</li>)}
                </ul>
            </section>
            <section className={styles.scores}>
                <h1>SCORES</h1>
                <ul>

                    {Players.map(e => <li key={e[0]}>{e[1]}</li>)}
                </ul>
            </section>

        </div></>
}
