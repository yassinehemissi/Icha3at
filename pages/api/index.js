import { Server } from "socket.io";
import { rooms } from "../../utility/RoomsData";
import { getRandomArbitrary } from "../../utility/useful";

let io;

const onConnection = (socket) => {
  let token = socket.handshake.query.token;
  let roomCode;
  let Name;
  const onPlayerJoin = (data) => {
    roomCode = data.roomCode;
    socket.join(roomCode)
    rooms[roomCode].players[token] = {
      points: 0,
      id: socket.id,
      currentVote: false,
      Name: Name
    }
    let updateData = []
    for (const player in rooms[roomCode].players) {
      updateData.push([rooms[roomCode].players[player].Name, rooms[roomCode].players[player].points])
    }
    io.to(socket.id).emit("updateStart", { master: rooms[roomCode].players[rooms[roomCode].owner].Name, Name: rooms[roomCode].players[token].Name })
    io.to(roomCode).emit("updatePlayer", { players: updateData })
  }
  let forceVoteEnd = () => {
    clearTimeout(rooms[roomCode].timer);
    let WinningVote = (rooms[roomCode].currentVotes.FACT > rooms[roomCode].currentVotes.LIE ? "FACT" : "LIE");
    io.to(roomCode).emit("result", { Votes: rooms[roomCode].currentVotes })
    let updateData = [];
    for (const player in rooms[roomCode].players) {
      if (rooms[roomCode].currentVotes.FACT == rooms[roomCode].currentVotes.LIE && rooms[roomCode].players[player].currentVote) {
        rooms[roomCode].players[player].points++;
      } else if (rooms[roomCode].players[player].currentVote == WinningVote) {
        rooms[roomCode].players[player].points++;
      } else if (rooms[roomCode].players[player].currentVote == false) {
        rooms[roomCode].players[player].points--;
      }
      rooms[roomCode].players[player].currentVote = false;
      updateData.push([rooms[roomCode].players[player].Name, rooms[roomCode].players[player].points])
    }
    io.to(roomCode).emit("updatePlayer", { players: updateData })
    rooms[roomCode].numberVotes = 0;
    rooms[roomCode].currentVotes = {
      FACT: 0,
      LIE: 0
    }
  }
  let onPlayerVote = (data) => {
    if (rooms[roomCode].players[token].currentVote != false)
      return;
    rooms[roomCode].players[token].currentVote = data.Vote;
    rooms[roomCode].currentVotes[data.Vote]++;
    rooms[roomCode].numberVotes++;
    io.to(roomCode).emit("updateCount", { Count: rooms[roomCode].numberVotes });
    if (rooms[roomCode].numberVotes == Object.keys(rooms[roomCode].players).length) {
      clearTimeout(rooms[roomCode].timer);
      let WinningVote = (rooms[roomCode].currentVotes.FACT > rooms[roomCode].currentVotes.LIE ? "FACT" : "LIE");
      io.to(roomCode).emit("result", { Votes: rooms[roomCode].currentVotes })
      let updateData = [];
      for (const player in rooms[roomCode].players) {
        if (rooms[roomCode].players[player].currentVote == WinningVote) {
          rooms[roomCode].players[player].points++;
        }
        rooms[roomCode].players[player].currentVote = false;
        updateData.push([rooms[roomCode].players[player].Name, rooms[roomCode].players[player].points])

      }
      io.to(roomCode).emit("updatePlayer", { players: updateData })
      rooms[roomCode].numberVotes = 0;
      rooms[roomCode].currentVotes = {
        FACT: 0,
        LIE: 0
      }

    }
  }
  let onPlayerSpread = (data) => {
    if (rooms[roomCode].spreader != token)
      return;
    clearTimeout(rooms[roomCode].timer);
    rooms[roomCode].timer = null
    rooms[roomCode].currentRumor = data.rumor;
    rooms[roomCode].timer = setTimeout(() => {
      forceVoteEnd();
    }, 60000)
    io.to(roomCode).emit("spread", { rumor: data.rumor })
  }

  let onStartRound = (data) => {
    if (token == rooms[roomCode].owner) {
      rooms[roomCode].timer = setTimeout(() => {
        rooms[roomCode].numberVotes = 0;
        rooms[roomCode].currentVotes = {
          FACT: 0,
          LIE: 0
        }
        io.to(roomCode).emit("result", { Votes: rooms[roomCode].currentVotes })

      }, 60000)
      rooms[roomCode].spreader = Object.keys(rooms[roomCode].players)[getRandomArbitrary(0, Object.keys(rooms[roomCode].players).length - 1)]
      io.to(rooms[roomCode].players[rooms[roomCode].spreader].id).emit("rumor")
      io.to(roomCode).except(rooms[roomCode].players[rooms[roomCode].spreader].id).emit("wait")
    }
  }
  let onPlayerDisconnect = (data) => {
    if (!roomCode)
      return;
    if (token == rooms[roomCode].owner) {
      delete rooms[roomCode];
      io.to(roomCode).emit("leave");
      return;
    }
    if (rooms[roomCode].players[token].currentVote) {
      rooms[roomCode].numberVotes--;
      rooms[roomCode].currentVotes[rooms[roomCode].players[token].currentVote]--;
      io.to(roomCode).emit("updateCount", { Count: rooms[roomCode].numberVotes });
    }
    delete rooms[roomCode].players[token]
    let updateData = [];
    for (const player in rooms[roomCode].players) {
      updateData.push([rooms[roomCode].players[player].Name, rooms[roomCode].players[player].points])
    }
    io.to(roomCode).emit("updatePlayer", { players: updateData })
    if (rooms[roomCode].numberVotes == Object.keys(rooms[roomCode].players).length) {
      forceVoteEnd();
    }
  }
  let onPlayerCreateRoom = (data) => {
    let roomcode = getRandomArbitrary(1, 99999);
    rooms[roomcode] = {
      players: {

      },
      numberVotes: 0,
      owner: socket.handshake.query.token,
      currentSpreader: "",
      currentRumor: "",
      currentVotes: {
        "FACT": 0,
        "LIE": 0
      },
      timer: null
    }
    io.to(socket.id).emit("move_to_room", { roomCode: roomcode });
  }

  let onPlayerJoinAttempt = ({ roomCode }) => {
    if (Object.keys(rooms).includes(roomCode)) {
      io.to(socket.id).emit("move_to_room", { roomCode: roomCode });
    } else {
      return;
    }
  }

  let onPlayerSetName = (data) => {
    Name = data.Name
  }

  socket.on("join", onPlayerJoin);
  socket.on("vote", onPlayerVote)
  socket.on("spread", onPlayerSpread);
  socket.on("start", onStartRound)
  socket.on("disconnect", onPlayerDisconnect)
  socket.on("new_room", onPlayerCreateRoom)
  socket.on("join_room", onPlayerJoinAttempt)
  socket.on("set_name", onPlayerSetName)
};

export default function handler(req, res) {
  if (res.socket.server.io) {
    res.end();
    return;
  }
  io = new Server(res.socket.server);
  res.socket.server.io = io;
  io.on("connection", onConnection);
  res.end();
}
