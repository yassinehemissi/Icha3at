import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getSocket } from "../context/Socket";
import styles from "../styles/Home.module.scss";


export default function Home() {
  let router = useRouter();
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
        <title>WELCOME - ICHA3AT</title>
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
            className="animate__animated animate__fadeInDown"
            src="/mute-emoji.svg"
          />
        </section>
        <section className={styles.right_section}>
          <h3>
            WELCOME TO <span>ICHA3AT</span>
            <br />
            A SPACE TO SPREAD
            <br />
            RUMORS WITH FRIENDS
            <br />
          </h3>
          <div className={styles.button_container}>
            <Link href="/join">JOIN ROOM</Link>
            <a onClick={() => {
              getSocket().emit("new_room");
            }}>CREATE ROOM</a>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>Ⓒ 2023 BY Race Pure</footer>
    </div>
  );
}
