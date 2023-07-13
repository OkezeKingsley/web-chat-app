import './Signup.css'
import {useState} from 'react';
import { FaUser } from 'react-icons/fa';
import axios from 'axios';
import { v4 as uuid } from 'uuid';//To create unique user id
import { useNavigate } from 'react-router-dom';

function Signup(){
    const navigate = useNavigate(); 
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPassword, setUserPassword] = useState('');

    //making the id short in lenght by slicing them...
    const unique_id = uuid()
    const small_id = unique_id.slice(0, 10)


    //SUBMITS USER DATA TO BACKEND FOR SIGNUP
    const handleSubmit = (e) => {
        e.preventDefault();

       axios.post('http://localhost:4000/signUp', {

        name: userName, 

        email: userEmail, 

        password: userPassword,

        user_id: small_id,

        profile_picture: null

    }).then((response) => {

       if(response.data.result) {

        //When we get a succefully registeration, user will be redirected to the 
        //login page so they can login with their newly registered detail.
        navigate('/');

       }

    }).catch((error) => {

        console.log(error)
    })

       
    };

    return(

        <div className="signup-center">

            <form className="signup-container" onSubmit={handleSubmit}>

            <div className='f'>
                <FaUser id="signupFaUser"/>
            </div>
            
            
                <h2 className="signup-header">Sign up</h2>
                
                
                <div className="signup-input">

                <div className="label">
                    <label >Username:</label>
                </div>
                
                    <input
                        type="text"
                        required
                        placeholder="username"
                        minLength={3}
                        name="username"
                        id="username"
                        className="username-input"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        /> 

                    <div className="label">
                        <label >Email:</label>
                    </div>
                    
                    <input
                        type="email"
                        required
                        placeholder="something@gmail.com"
                        name="email"
                        id="email"
                        className="email-input"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        /> 

                    <div className="label">
                        <label>Password:</label>
                    </div>
                    
                    <input
                        type="password"
                        required
                        placeholder="password"
                        name="password"
                        id="password"
                        className="password-input"
                        value={userPassword}
                        onChange={(e) => setUserPassword(e.target.value)}
                        />   


                   

                    <div className="btn-container">
                        <button className="signup-cta" onClick={handleSubmit}>SUBMIT</button>
                    </div>

                    </div> 
            </form>
        </div>

    )
}

export default Signup;


