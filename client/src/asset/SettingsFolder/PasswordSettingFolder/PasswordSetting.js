import { useEffect, useState } from 'react';
import './PasswordSetting.css';
import axios from 'axios';

function PasswordSettings () {

    let loggedInName = JSON.parse(sessionStorage.getItem("username"));

    const [showUpdate, setShowUpdate] = useState();

    const [passwordChange, setPasswordChange] = useState();

    useEffect(() => {
        
            setTimeout(() => {

                setShowUpdate(' ')

            }, 7000)
    
    }, [showUpdate]);



    const handleChange = (event) => {

        setPasswordChange(event.target.value)
        console.log(passwordChange)
    
    }

    const changePassword = () => {

        if (passwordChange < 6) {

            setShowUpdate('password must not be less than 6 characters')
        }

        if (loggedInName && passwordChange) {

       
            axios.post("http://localhost:4000/changePassword", {

                loggedInUser: loggedInName,

                passcode: passwordChange

            }).then((response) => {

                if (response) {

                    setShowUpdate(response.data.result);

                }
                
            }).catch((err) => {

                if (err) {

                    setShowUpdate('failed to change password, try again.')

                }
                
            })

         }
    }


    return(
        <div className="password-settings-container">
            
            <div className="label">
                <label>Change password:</label>   
            </div>
        
            <p className="showUpdate">{showUpdate}</p>

            <div className="label-input">

                <input type="text" 
                
                className="password-text-style" 
                
                placeholder="  change password..."
           
                onChange = {handleChange}
                />

                <button className="password-change-btn" onClick={changePassword}>change</button>
            </div>

            
            
        </div>
    )
}

export default PasswordSettings;