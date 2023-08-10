import { useEffect, useState } from "react";
import styles from "../../styles/room.module.scss";


export default function Spreading() {
    const [Seconds, setSeconds] = useState(60)
    useEffect(() => {
        setTimeout(() => {
            setSeconds(Seconds - 1);
        }, 1000);
    }, [Seconds])
    return <div className={styles.startContainer}>
        <img className="animate__animated animate__fadeInDown"
            src="/smirk-emoji.svg" />
        <h3 className="animate__animated animate__fadeInDown"
        >
            Someone is spreading! please wait until he finishes so the vote starts!
        </h3>
        <h3>Timer: {Seconds}s</h3>
    </div>
}