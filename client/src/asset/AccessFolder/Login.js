//Here we create the login page for the chat application

import './Login.css';
import axios from 'axios'
import {useContext, useEffect, useState} from 'react';
import { FaUser } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom';
import socket from '../SocketModuleFolder/socket';

function Login(){
    const navigate = useNavigate();
    const [userName, setUserName] = useState('');
    const [userPassword, setUserPassword] = useState('');

 
    //SUBMIT LOGIN DETAIL TO BACKEND FOR PROCESSES.
    const handleSubmit = async (e) => {

        e.preventDefault();
       

       axios.post("http://localhost:4000/login", {

        name: userName,

        password: userPassword

       }).then((response) => {

 //         console.log(response.data) 

          //If we get a positive result from the response of the fetch and not an error,
          //we should get the user_id of the user loggin in so that we can 
          //use that to retreive all the unique information about that specific 
          //user throughout our application. The user_id will be stored in the new object
          //called {result} that we created in our server controller for handling login.
          if(response.data.result){

           const loggedInName = response.data.result;

           sessionStorage.setItem("username", JSON.stringify(loggedInName))



          //THIS EMITS THE USERNAME OF THE LOGGED IN USER TO THE SERVER ONCE LOGIN
          //SUCCESSFUL SO THAT IT CAN ASSIGN A SOCKET ID TO THE LOGIN USER
          //(SOCKET ID: THIS IS WHAT THE SERVER WILL USER TO IDENTIFY A USER WHEN
          //WHEN IS WANTS TO SEND MESSAGE TO THEM). . . 
        
            if (loggedInName) {

                socket.emit("username", { username: loggedInName } );

            } else {

                alert('Error ehile getting your name, kindly logout and login again.');
            }


           
          //if the user is accessing this application on a larger screen size, we are then
          //going to route from this page to the dashboard once login is successful. if 
          //user is accessing this application with smaller screen, we'd route the to the mobile
          //chat list page.
           const matchResult = window.matchMedia("(max-width: 767px)");

           { matchResult.matches === true ? navigate('/mobilechatList') : navigate('/dashboard') }


          } else if(response.data.error){
            //If there was an error with getting due to wrong user login input, we'd get 
            //notified here...
            console.log('bad')
            alert('Error while loggin in.')
          }
        

       }).catch((error) => {
             //This error is for the promise. If there was an error while the promise is 
             //executing, we get notified here...
             console.log(error) 
             alert('Sorry! error while trying log in.')
             console.log('err while login')
       });


    };










    return(

        <div className="login-center">

            <form className="login-container" onSubmit={handleSubmit}>

                <div className='f'>

                `<FaUser id="loginFaUser"/>

                </div>
                    `
                <h2 className="login-header">Sign in to open chat</h2>
                
                <div className="user-input">
                    <input
                        type="text"
                        required
                        placeholder="username"
                        name="username"
                        id="username"
                        className="username-input"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        /> 

                    <input
                        type="password"
                        required
                        placeholder="password"
                        minLength={6}
                        name="password"
                        id="password"
                        className="password-input"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        /> 
                </div>

                    <div className="btn-container">
                        <button className="login-cta">SIGN IN</button>
                    </div>

                    <p className="login-sign-up">Dont have an account? <Link to="/signup">Sign up</Link></p>
                    <p className="forgot-password">
                        <a href="#" >forgot password</a>
                    </p>

            </form>
            
        </div>

    )
}

export default Login;




















