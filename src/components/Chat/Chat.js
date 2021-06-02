import React, { useState,useRef, useEffect } from 'react';
import Messages from '../Messages/Messages';
import ChatDate from '../ChatDate/ChatDate';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import SendIcon from '@material-ui/icons/Send';
import './Chat.css';
import db from '../Auth/firebase.config';
import firebase from "firebase";
import { selectUser } from '../../features/userSlice';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';


const Chat = () => {
    const inputRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [roomName, setRoomName] = useState("");
    const user = useSelector(selectUser);
    const { roomId } = useParams();
    const messagesEndRef = useRef(null);
    useEffect(() => {
        const cleanUp1 = db.collection('rooms').doc(roomId).onSnapshot((snapshot) => {
            if (snapshot.data()) {
                setRoomName(snapshot.data().name)
            }
        });


        const cleanUp2 = db.collection('rooms').doc(roomId).collection('messages').orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) => {
                setMessages(snapshot.docs.map(doc => doc.data()))
            });

        return () => {
            cleanUp1();
            cleanUp2()
        }

    }, [roomId])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView();
    }, [messages]);

    
    const sendMessage = e => {
        e.preventDefault();
        db.collection('rooms').doc(roomId).collection('messages').add({
            message: inputRef.current.value,
            name: user.displayName,
            uid: user.uid,
            profileImage: user.photoURL,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        db.collection('rooms').doc(roomId).update({
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })

        inputRef.current.value = "";
    };

   

    return (
        <div className="chat">
           <div className="d-flex justify-content-between text-white chat-header shadow">
                <h5>{roomName}</h5>
            </div>
            <div className="chat-body">
            {messages.map((message, index) => {
                const prevMessage = messages[index - 1];
                const showDate = !prevMessage || (message?.timestamp?.seconds - prevMessage?.timestamp?.seconds) > 60;
                const dateNow = new Date();
                const showFullDate = ((dateNow.getDate() !== message.timestamp?.toDate().getDate()) ||
                    (dateNow.getMonth() !== message.timestamp?.toDate().getMonth()) ||
                    dateNow.getYear() !== message.timestamp?.toDate().getYear())
                    return (
                        <>
                            {showDate && <ChatDate date={message.timestamp?.toDate()} showFullDate={showFullDate} />}
                            <Messages
                                name={message.name}
                                text={message.message}
                                profileImageSrc={message.profileImage}
                                isSender={message.uid === user.uid}
                            />
                        </>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat-footer">
                {/* <RecordVoiceOverOutlinedIcon /> */}
                <form className="m-3">
                    <div class="form-group">
                        <textarea ref={inputRef} class="form-control rounded" rows="2" placeholder="Enter a Message" ></textarea>
                    </div>
                    <div className="text-end form-group pl-2 pt-3">
                        <abbr title="Not Available" style={{cursor: "pointer"}}><SentimentVerySatisfiedIcon className="sentimentVerySatisfiedIcon pr-2"/></abbr>
                        <button type="Submit" onClick={sendMessage} className="chatSubmitBtn pr-2"><SendIcon className="sendIcon"/></button>
                        
                    </div>
                </form>
            </div>
    
        </div>
    );
};

export default Chat;