import React, { useEffect } from 'react';
import './App.css';
import Login from './components/Auth/Login';
import Chat from './components/Chat/Chat';
import Sidebar from './components/Sidebar/Sidebar';
import { selectUser } from './features/userSlice'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { auth } from "./components/Auth/firebase.config";
import { login } from './features/userSlice';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(authUser => {
      if (authUser) {
        dispatch(login({
          email: authUser.email,
          uid: authUser.uid,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL
        })
        );
      }
    })
    return () => { unsubscribe() }
  }, []);
  return (
   <div className="container">
     {
       !user ? (
         <div className="row">
           <Login />
         </div>
         
       ) : (
      
        <div className="row mt-5"> 
          <div className="col-md-12 main">
            <Router>
              <Switch> 
                <Route path="/rooms/:roomId">
                  <Sidebar />
                  <Chat />
                </Route>
                <Route path="/">
                  <Sidebar />
                </Route>
              </Switch>
            </Router>
          </div>
        </div>
       ) 
     }
     
   </div>
  );
}

export default App;
