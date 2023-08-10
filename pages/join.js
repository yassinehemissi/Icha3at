import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getSocket } from "../context/Socket";
import styles from "../styles/join.module.scss";

export default function Join() {
  const [roomCode, setroomCode] = useState("")
  let router = useRouter()
  let requestedJoin = false;
  useEffect(() => {
    if (!requestedJoin) {
      getSocket().on("move_to_room", (data) => {
        router.replace("/rooms/" + data.roomCode);
      })
      requestedJoin = true;
    }
  }, [])
  return (
    <div className={styles.container}>
      <Head>
        <title>JOIN ROOM - ICHA3AT</title>
        <meta name="description" content="Let's spread rumors for fun" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
        />
      </Head>

      <main className={styles.main}>
        <section className={styles.left_section}>
          <img
            className="animate__animated animate__fadeInUp"
            src="/smile-emoji.svg"
          />
        </section>
        <section className={styles.right_section}>
          <h3>ROOM CODE</h3>
          <input value={roomCode} onChange={(e) => setroomCode(e.target.value)} type="text" />
          <div className={styles.button_container}>
            <a onClick={() => getSocket().emit("join_room", { roomCode: roomCode })}>JOIN ROOM</a>
            <Link href="/">GO BACK</Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>Ⓒ 2023 BY Race Pure</footer>
    </div>
  );
}
