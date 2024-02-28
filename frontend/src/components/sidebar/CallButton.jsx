import { MdVideoCall } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSocketContext } from "../../context/socketContext";
import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";

const CallButton = () => {
    const [roomID, setRoomID] = useState('');
    const { socket } = useSocketContext()
    const { authUser } = useAuthContext()

    const navigate = useNavigate()

    const roomJoined = () => {
        const roomId = prompt('Please enter the room Id ')
        setRoomID(roomId);
        if (!roomID) {
            if (socket) {
                socket.emit('room:join', { username: authUser.username, room: roomId })
            }
        }
    }
    useEffect(() => {
        const handleJoinedRoom = (data) => {
            const { room } = data
            navigate(`/room/${room}`)
        }
        if (socket) {

            socket.on('room:join', handleJoinedRoom)
            return () => {
                socket.off('room:join', handleJoinedRoom)
            }
        }
    }, [navigate, socket])
    return (
        <>
            <MdVideoCall className='w-6 h-6 outline-none cursor-pointer ' onClick={roomJoined} />
        </>
    )
}

export default CallButton