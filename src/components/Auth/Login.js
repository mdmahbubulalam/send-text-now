import React, { useState } from 'react';
import './Login.css';
import { Backdrop, Button, Fade, Input, InputLabel, Link } from '@material-ui/core';
import logo from '../../image/logo.png';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { auth, storage } from "./firebase.config";
import { useDispatch } from 'react-redux';
import { login } from '../../features/userSlice';


function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

const Login = () => {
    const classes = useStyles();
    // getModalStyle is not a pure function, we roll the style only on the first render
    const [modalStyle] = React.useState(getModalStyle);
    const [openSignIn, setOpenSignIn] = useState(false);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [openSingUp, setOpenSignUp] = useState(false);
    const [image, setImage] = useState(null);
    const [username, setUsername] = useState('');
    const dispatch = useDispatch();

    const signIn = async event => {
        event.preventDefault();
        event.preventDefault();
        try {
            const authUser = await auth.signInWithEmailAndPassword(email, password)
            dispatch(login({
                email: authUser.user.email,
                uid: authUser.user.uid,
                displayName: authUser.user.displayName,
                photoURL: authUser.user.photoURL
            }));
            setOpenSignIn(false);
        }
        catch (error) {
            alert(error.message)
        }
    }

    const signUp = async event => {
        event.preventDefault();

        try {

            if (!username) {
                throw new Error('Please enter a username');
            }
            const result = await auth.createUserWithEmailAndPassword(email, password);

            let imageURL = null;

            if (image) {
                const uploadedImage = await storage.ref(`users/${result.user.uid}${image.name}`).put(image);
                imageURL = await uploadedImage.ref.getDownloadURL();
                console.log(uploadedImage );
            }
            console.log(result);
            console.log(imageURL);

            await result.user.updateProfile({
                displayName: username,
                photoURL: imageURL
            });

            dispatch(login({
                email: result.user.email,
                uid: result.user.uid,
                displayName: username,
                photoURL: imageURL
            })
            );

            setOpenSignUp(false);
            
        } catch (error) {
            alert(error.message)
            
        }
        
    }

    const handleImageChange = e => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    }
    
    return (
        <div className="login">
            <div className="login-card">
                <img src={logo} className="img-fluid mt-3" alt=""/>
                <div className="login-text mt-4">
                    <h5>A web chat application made by Mohammad Mahbubul Alam</h5>
                </div>
                <div>
                    <Button onClick = {() => setOpenSignIn(true)}> Sign In  </Button> 
                </div>
                <div>
                    <p>Don't have an account? <span><Link href="#" onClick = {() => setOpenSignUp(true)}> Sign Up</Link></span></p>
                </div>
            </div>
           
           

            <Modal
                    open={openSignIn}
                    onClose={() => setOpenSignIn(false)}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 1000,
                    }}
                    
                >
                    <Fade in={openSignIn}>
                        <div style={modalStyle} className={classes.paper} >
                            <form className="login-signup">
                                <img src={logo} className="img-fluid mt-3 login-headerImage" alt="" />

                                <Input
                                    placeholder="email"
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <Input
                                    placeholder="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button type="submit" onClick={signIn}> Sign In </Button>
                            </form>
                        </div>
                    </Fade>
                </Modal>

            <Modal
                    open={openSingUp}
                    onClose={() => setOpenSignUp(false)}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 1000,
                    }}
                >
                    <Fade in={openSingUp}>
                        <div style={modalStyle} className={classes.paper} >
                            <form className="login-signup">
                                <img src={logo} className="img-fluid mt-3 login-headerImage" alt="" />

                                <Input
                                    placeholder="username"
                                    type="text"
                                    value={username}
                                    required
                                    onChange={(e) => setUsername(e.target.value)}
                                />

                                <Input
                                    placeholder="email"
                                    type="text"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <Input
                                    placeholder="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <InputLabel htmlFor="image" variant='filled' shrink={true} >Profile Picture (optional)</InputLabel>
                                <Input
                                    id="image"
                                    placeholder="upload an image"
                                    type="file"
                                    onChange={handleImageChange}
                                />


                                <Button type="submit" onClick={signUp}> Sign Up </Button>
                            </form>
                        </div>
                    </Fade>
                </Modal>

        </div>
    );
};

export default Login;