import { useEffect, useState } from "react";
import { getSocket } from "../../context/Socket";
import styles from "../../styles/room.module.scss";


export default function Spread() {
    const [Rumor, setRumor] = useState()
    const [Seconds, setSeconds] = useState(60)
    useEffect(() => {
        setTimeout(() => {
            setSeconds(Seconds - 1);
        }, 1000);
    }, [Seconds])
    return <div className={styles.startContainer}>
        <h3>Type a rumor then click the spread button to send it, remember no one knows that you are spreading:</h3>
        <textarea className="animate__animated animate__fadeInDown"
            onChange={(e) => setRumor(e.target.value)} value={Rumor}></textarea>
        <button className="animate__animated animate__fadeInDown"
            onClick={() => {
                getSocket().emit("spread", { rumor: Rumor })
            }}>
            SPREAD!
        </button>
        <h3>Timer: {Seconds}s</h3>
    </div>
}