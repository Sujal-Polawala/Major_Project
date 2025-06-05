import { io } from "socket.io-client";

const socket = io("https://trynbuy-backend.onrender.com", { withCredentials: true,
    autoConnect: false,
    transports: ["websocket"],
});
export default socket;
