import io from "socket.io-client";


let socket;
let token;

const initSocket = () => {
    if (socket)
        return;
    token = (Math.random() + 1).toString(36).substring(2);
    socket = io({ query: { token: token } });
}

const getSocket = () => {
    return socket;
}

const getToken = () => {
    return token;
}

export { initSocket, getSocket, getToken };