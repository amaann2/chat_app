import { useCallback, useEffect, useState } from "react"
import { useSocketContext } from "../context/socketContext"
import ReactPlayer from 'react-player'
import peer from "../utils/peer"
import './Room.css'
import { useNavigate } from "react-router-dom"
const Room = () => {
    const { socket } = useSocketContext()
    const navigate = useNavigate()
    const [remoteSocketId, setRemoteSocketId] = useState(null);
    const [myStream, setMyStream] = useState();
    const [remoteStream, setRemoteStream] = useState();
    const [isStreamsConnected, setIsStreamsConnected] = useState(false);
    const [isCallEnded, setIsCallEnded] = useState(false);


    const handleUserJoined = useCallback(({ username, id }) => {
        console.log(`username ${username} joined room`);
        setRemoteSocketId(id);
    }, []);

    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
        });
        const offer = await peer.getOffer();
        socket.emit("user:call", { to: remoteSocketId, offer });
        setMyStream(stream);
    }, [remoteSocketId, socket]);

    const handleIncommingCall = useCallback(
        async ({ from, offer }) => {
            setRemoteSocketId(from);
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: true,
            });
            setMyStream(stream);
            console.log(`Incoming Call`, from, offer);
            const ans = await peer.getAnswer(offer);
            socket.emit("call:accepted", { to: from, ans });
        },
        [socket]
    );

    const sendStreams = useCallback(() => {
        for (const track of myStream.getTracks()) {
            peer.peer.addTrack(track, myStream);
        }
        setIsStreamsConnected(true);
    }, [myStream]);

    const handleCallAccepted = useCallback(
        ({ ans }) => {
            peer.setLocalDescription(ans);
            console.log("Call Accepted!");
            sendStreams();
        },
        [sendStreams]
    );

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
    }, [remoteSocketId, socket]);

    useEffect(() => {
        peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
            peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
        };
    }, [handleNegoNeeded]);

    const handleNegoNeedIncomming = useCallback(
        async ({ from, offer }) => {
            const ans = await peer.getAnswer(offer);
            socket.emit("peer:nego:done", { to: from, ans });
        },
        [socket]
    );

    const handleNegoNeedFinal = useCallback(async ({ ans }) => {
        await peer.setLocalDescription(ans);
    }, []);

    useEffect(() => {
        peer.peer.addEventListener("track", async (ev) => {
            const remoteStream = ev.streams;
            console.log("GOT TRACKS!!");
            setRemoteStream(remoteStream[0]);
        });
    }, []);

    useEffect(() => {
        socket.on("user:joined", handleUserJoined);
        socket.on("incomming:call", handleIncommingCall);
        socket.on("call:accepted", handleCallAccepted);
        socket.on("peer:nego:needed", handleNegoNeedIncomming);
        socket.on("peer:nego:final", handleNegoNeedFinal);

        return () => {
            socket.off("user:joined", handleUserJoined);
            socket.off("incomming:call", handleIncommingCall);
            socket.off("call:accepted", handleCallAccepted);
            socket.off("peer:nego:needed", handleNegoNeedIncomming);
            socket.off("peer:nego:final", handleNegoNeedFinal);
        };
    }, [
        socket,
        handleUserJoined,
        handleIncommingCall,
        handleCallAccepted,
        handleNegoNeedIncomming,
        handleNegoNeedFinal,
    ]);

    const handleEndCall = () => {
        setIsCallEnded(true);
        navigate('/');
        window.location.reload();
    };


    useEffect(() => {
        if (isCallEnded) {
            // Add any additional cleanup logic here, such as stopping tracks or closing connections.
            if (myStream) {
                myStream.getTracks().forEach(track => track.stop());
            }
            if (remoteStream) {
                remoteStream.getTracks().forEach(track => track.stop());
            }
        }
    }, [isCallEnded, myStream, remoteStream]);


    return (
        <div>

            {!isStreamsConnected && (
                <>
                    <button
                        onClick={sendStreams}
                        className="p-2 bg-white text-black rounded-lg m-3"
                    >
                        Send Stream
                    </button>
                    <button
                        onClick={handleCallUser}
                        className="p-2 bg-white text-black rounded-lg m-3"
                    >
                        CALL
                    </button>
                </>
            )}


            <div className="stream">

                {remoteStream && (
                    <>
                        <div className="remoteStream">
                            <ReactPlayer
                                playing
                                height="100%"
                                width="100%"
                                url={remoteStream}
                            />
                        </div>
                    </>
                )}
                {myStream && (
                    <>
                        <div className="myStream">
                            <ReactPlayer
                                playing
                                height="100%"
                                width="100%"
                                url={myStream}
                            />
                        </div>
                    </>
                )}
            </div>
            {isStreamsConnected && <button
                className="p-2 bg-white text-black rounded-lg m-3"
                onClick={handleEndCall}
            >
                End call
            </button>}
        </div >
    );
};

export default Room