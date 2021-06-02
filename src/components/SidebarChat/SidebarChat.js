import { Avatar } from '@material-ui/core';
import React , { useEffect, useState } from 'react';
import './SideBarChat.css';
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import db from '../Auth/firebase.config';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import notificationTone from '../../messageTone/messageTone.mp3'


const SidebarChat = ({name,id}) => {
    const user = useSelector(selectUser);
    const { roomId } = useParams();
    const [messages, setMessages] = useState('');
    const [messageTone] = useState(new Audio(notificationTone));
    const [initialDataFetched, setInitialDataFetched] = useState(false);
    const [seed, setSeed] = useState('');

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 50));
        const cleanUp = db.collection('rooms')
            .doc(id)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .limit(1)
            .onSnapshot((snapshot) => {
                setMessages(snapshot.docs.map((doc) =>
                    doc.data()))
                setInitialDataFetched(true);
            }
            );
        return () => {
            cleanUp();
        }
    }, [])

    useEffect(() => {
        if (initialDataFetched) {
            if (messages[0]?.uid !== user.uid) {
                messageTone.play();
            }
        }

    }, [messages])

    return (
        <Link to={`/rooms/${id}`}>
        <div className= {`sidebar-chat ${id === roomId && "sidebar-chat-active"} `}>
            <Avatar variant="square" src={`https://picsum.photos/300/300?random=${seed}`} />
            <div className="sidebar-chat-info">
                <h2>{name}</h2>
                <p> {messages[0] && `${user.uid === messages[0]?.uid ? 'Me' : messages[0]?.name} : ${messages[0]?.message}`}</p>
            </div>
            <div className="sidebar-chat-timestamp">
                {messages[0]?.timestamp?.toDate().toLocaleDateString()}
            </div>
        </div>
        </Link>
    );
};

export default SidebarChat;