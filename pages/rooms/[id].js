import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../../styles/room.module.scss";
import { useRouter } from "next/router";
import { getSocket } from "../../context/Socket";
import { Start, Spreading, Spread, RumorOut, Score, Result } from "../../components/room"

export default function Room() {
    let router = useRouter();
    let { id } = router.query;
    const [roomMaster, setRoomMaster] = useState("");
    const [roomCode, setroomCode] = useState(id)
    const [Players, setPlayers] = useState([])
    const [Name, setName] = useState("");
    const [isMaster, setIsMaster] = useState(false);
    const [currentPage, setCurrentPage] = useState(null);
    const [VoteCount, SetVoteCount] = useState(0);
    const [Votes, setVotes] = useState(false);
    const [Rumor, setRumor] = useState(false);
    let requestedJoin = false;

    const initRoom = () => {
        if (!requestedJoin) {
            getSocket().emit("join", { roomCode: roomCode });
            requestedJoin = true;
            getSocket().on("start", (data) => {
            })
            getSocket().on("updateCount", (data) => {
                SetVoteCount(data.Count)
            })
            getSocket().on("updateStart", (data) => {
                setRoomMaster(data.master)
                setName(data.Name);
                setIsMaster(data.master == data.Name)
                setCurrentPage("START")
            })
            getSocket().on("updatePlayer", (data) => {
                setPlayers(data.players);
            })
            getSocket().on("rumor", (data) => {
                setCurrentPage("SPREAD")
            });

            getSocket().on("wait", (data) => {
                setCurrentPage("SPREADING")
            });

            getSocket().on("spread", (data) => {
                setCurrentPage("RUMOROUT")
                setRumor(data.rumor)
            })
            getSocket().on("result", (data) => {
                setCurrentPage("RESULT")
                SetVoteCount(0);
                setVotes(data.Votes)
            })
            getSocket().on("leave", (data) => {
                router.replace("/")
            })

        }
    }
    useEffect(initRoom, [])


    return (
        <div className={styles.container}>
            <Head>
                <title>ROOM - ICHA3AT</title>
                <meta name="description" content="Let's spread rumors for fun" />
                <link rel="icon" href="/favicon.ico" />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
                />
            </Head>
            <main className={styles.main}>
                <Score Players={Players} />
                {currentPage == "START" ? (<Start Master={Name == roomMaster} />) : null}

                {currentPage == "SPREAD" ? (<Spread />) : null}

                {currentPage == "SPREADING" ? (<Spreading />) : null}

                {currentPage == "RUMOROUT" ? (<RumorOut VoteCount={VoteCount} rumor={Rumor} />) : null}

                {currentPage == "RESULT" ? (<Result Master={Name == roomMaster} Votes={Votes} />) : null}

                <p className={styles.RoomCode}>YOUR NAME: {Name}</p>
                <p className={styles.RoomCode}>ROOM MASTER: {roomMaster}</p>
                <p className={styles.RoomCode}>ROOM CODE: {roomCode}</p>
            </main>

            <footer className={styles.footer}>Ⓒ 2023 BY Race Pure</footer>
        </div>
    );
}
