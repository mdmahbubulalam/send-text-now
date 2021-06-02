import React from 'react';
import { Avatar } from "@material-ui/core";
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import './Messages.css'

const Messages = ({ name, text, profileImageSrc, isSender }) => {
    return (
        <div className={`message ${isSender && "message-sent"}`}>
        {!isSender && <div className='message-name' > {name} </div>}
        <Avatar variant="square" className="message-avatar" src={profileImageSrc} />
        {isSender ? < ArrowRightIcon className="message-sentArrow" /> : < ArrowLeftIcon className="message-receivedArrow" />}
        <div className="message-info">
            <div className="message-text">{text}</div>
        </div>
    </div>
    );
};

export default Messages;