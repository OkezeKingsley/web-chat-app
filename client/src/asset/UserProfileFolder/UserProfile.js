import { useContext, useEffect, useState } from 'react';
import './UserProfile.css'
import { FaUserAlt } from "react-icons/fa";
import axios from 'axios';
import { LoggedInNameContext } from '../contextFolder/LoggedInNameContext';

function UserProfile () {

    //Let check the status of this user, if you're online or not
    let loggedInNameValue = JSON.parse(sessionStorage.getItem("username"));

    const [name, setName] = useState() 
    const [email, setEmail] = useState()
    const [profilePicture, setProfilePicture] = useState()
    const [status, setStatus] = useState()

    useEffect(() => {
        axios.post("http://localhost:4000/getUserProfile", {
            
        name: loggedInNameValue
    
    }).then((response) => {

            console.log(response.data)
            setName(response.data.name)
            setEmail(response.data.email)
            setProfilePicture(response.data.profile_picture)

        }).catch((err) => {
            
            console.log(err)
        })

    }, [])

    
    

    useEffect(() => {

        if (loggedInNameValue) {

            setStatus("online")
        }
    
    }, [loggedInNameValue])
    



    return(
        <div  className="user-profile-container"> 
         
        <div className="userProfile-body">

            <div className="top-flex">
                <div className="profile-photo">
                     {
                     
                      profilePicture ? <img src={profilePicture} id="profile-img"/> :
                     
                      <FaUserAlt className="photo"/>

                     }
                     
                </div>
            
                <div className="name">{name}</div>
            </div>


            <div className="grid">

                <div>
                    <label className="label">Name</label>
                    <p className='p'>{name}</p>
                </div>
               
                <div>
                    <label className="label">Email</label>
                    <p className='p'>{email}</p>
                </div>

                <div>
                    <label className="label">Phone number</label>
                    <p className='p'>none</p>
                </div>

                <div>
                    <label className="label">Status</label>
                    <p className='p'>{status}</p>
                </div>

            </div>

            <div className="btn-div">
                    <button className="btn"> save changes </button> 
            </div>
            
        </div>

    </div>   
    )
}

export default UserProfile;