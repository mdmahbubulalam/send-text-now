import React, { useEffect, useState } from 'react';
import './Sidebar.css';
import profileImg from '../../image/vlcsnap-2021-05-29-11h36m18s329.png';
import logo from '../../image/logo.png';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import SidebarChat from '../SidebarChat/SidebarChat';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import PeopleOutlineIcon from '@material-ui/icons/PeopleOutline';
import PeopleIcon from '@material-ui/icons/People';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import PersonIcon from '@material-ui/icons/Person';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { auth } from '../Auth/firebase.config';
import { useDispatch } from 'react-redux';
import { logout,selectUser } from '../../features/userSlice';
import db from "../Auth/firebase.config";
import firebase from "firebase";
import { useSelector } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  fab: {
    margin: theme.spacing(2),
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(3),
  },
}));


const Sidebar = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [rooms, setRooms] = useState([]);
  
  const classes = useStyles();

    useEffect(() => {
        const cleanUp = db.collection('rooms')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) =>
                setRooms(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    data: doc.data()
                }))
                )
            );
        return () => {
            cleanUp();
        }

    }, [])

  const signOut = async () => {
    await auth.signOut();
    dispatch(logout());
  }

  const addChatRoom = () => {
    const roomName = prompt("Please enter a name for chat room");
    if (roomName) {
      db.collection("rooms").add({
          name: roomName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
      })
  }
  }  

  
    return (
        <div className="sidebar">
          <div className="sidebar-header d-flex justify-content-between shadow">
            <img src={logo} alt="" className="img-fluid w-25"/>
            <div className="text-center">
            <img src={user.photoURL} alt="" className="img-fluid profileImg"/>
            <h5 className="small">{user.displayName}</h5>
            </div>
            
          </div>
          
          <div className="d-flex justify-content-center p-2">
            <TextField 
              className="w-100 mt-2 bg-light rounded"
              id="outlined-basic" 
              label="Search" 
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon style={{cursor: "pointer"}}/>
                  </InputAdornment>
                )
                }}
            />
          </div>
          <div className="display-sidebar-chat">
            {rooms.map(room => (
              <SidebarChat key={room.id} id={room.id} name={room.data.name} />
            ))}
          </div>
          <div className="sidebar-footer">
          <Tooltip title="Add Chat Room">
            <AddCircleOutlineIcon className="addCircleOutlineIcon" onClick={addChatRoom} style={{cursor: "pointer"}} data-toggle="tooltip" data-placement="bottom" title="Tooltip on bottom" />
          </Tooltip>
          <Tooltip title="Not Available">
            <ChatBubbleOutlineIcon className="chatBubbleOutlineIcon" style={{cursor: "pointer"}}/>
          </Tooltip> 
          <Tooltip title="Not Available">
            <PeopleOutlineIcon className="peopleOutlineIcon" style={{cursor: "pointer"}}/>
          </Tooltip>
          <Tooltip title="Not Available">
            <PersonOutlineIcon className="personOutlineIcon"  onClick = {signOut} style={{cursor: "pointer"}}/>
          </Tooltip>   
          </div>
          
        </div>
    );
};

export default Sidebar;