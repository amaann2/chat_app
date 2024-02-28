import { useEffect, useState } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/socketContext";
import { MdVideoCall } from "react-icons/md";
const MessageContainer = () => {
    const { selectedConversation, setSelectedConversation } = useConversation()
    const { onlineUsers } = useSocketContext()
    const [status, SetStatus] = useState('')
    const videoCall = () => {
        console.log('video call')
    }
    useEffect(() => {
        const isOnline = onlineUsers.some(user => user.toString() === selectedConversation?._id.toString());
        SetStatus(isOnline ? 'online' : 'offline');
    }, [onlineUsers, selectedConversation]);
    useEffect(() => {
        // cleanup unmount
        return () => setSelectedConversation(null)
    }, [setSelectedConversation])
    return (
        <div className='md:min-w-[450px] flex flex-col border border-gray-300'>
            {!selectedConversation ? <NoChatSelected /> : <>
                {/* Header */}
                <div className='bg-slate-500 px-4 py-2 mb-2 flex justify-between items-center'>
                    <span className='label-text text-gray-900 font-bold'>{selectedConversation.fullName}</span>
                    <span className="label-text text-gray-900 font-bold">{status}</span>
                    <div><MdVideoCall className="cursor-pointer text-2xl hover:text-gray-900" onClick={videoCall} /></div>
                </div>

                <Messages />
                <MessageInput />
            </>}
        </div>
    );
};
export default MessageContainer;

const NoChatSelected = () => {
    const { authUser } = useAuthContext()
    return (
        <div className='flex items-center justify-center w-full h-full'>
            <div className='px-4 text-center sm:text-lg md:text-xl text-gray-200 font-semibold flex flex-col items-center gap-2'>
                <p>Welcome 👋 {authUser.fullName} ❄</p>
                <p>Select a chat to start messaging</p>
                <TiMessages className='text-3xl md:text-6xl text-center' />
            </div>
        </div>
    );
};