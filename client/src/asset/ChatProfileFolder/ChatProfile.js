import './ChatProfile.css'
import { FaCommentDots, FaRegBell, FaRegSun, FaUser, FaUserAlt } from 'react-icons/fa';
import { useContext, useEffect, useState } from 'react';
import { ProfileDisplayContext } from '../contextFolder/ProfileDisplayContext';
import { MessageDisplayContext } from '../contextFolder/MessageDisplayContext';
import { SettingsDisplayContext } from '../contextFolder/SettingsDisplayContext';
import axios from 'axios';
import { ProfilePhotoChangeContext } from '../contextFolder/ProfilePhotoChangeContext';
import { NotificationContext } from '../contextFolder/NotificationContext';


function ChatProfile(){

    //This useState carries the Name of the User that logged in
    let loggedInNameValue = JSON.parse(sessionStorage.getItem("username"));


    //This context api state carries info about when user change their profile picture
    const { profilePhotoChangeValue, setProfilePhotoChangeValue } = useContext(ProfilePhotoChangeContext)
    

    const { profileDisplayValue, setProfileDisplayValue } = useContext(ProfileDisplayContext)
    const { messageDisplayValue, setMessageDisplayValue } = useContext(MessageDisplayContext)
    const { settingsDisplayValue, setSettingsDisplayValue } = useContext(SettingsDisplayContext)
    const { notificationValue, setNotificationValue }  = useContext(NotificationContext)

    //THIS MAKES YOUR PROFILE VISIBLE WHEN YOU CLICK ON THE PROFILE FEATURE
    const clickProfile = () => {
        setMessageDisplayValue(false)
        setSettingsDisplayValue(false)
        setProfileDisplayValue(true)

    }

    //THIS MAKES YOUR PROFILE VISIBLE WHEN YOU CLICK ON THE MESSAGE FEATURE
    const clickMessage = () => {
        setProfileDisplayValue(false)
        setSettingsDisplayValue(false)
        setMessageDisplayValue(true)
    }

    //THIS MAKES YOUR PROFILE VISIBLE WHEN YOU CLICK ON THE SETTINGS FEATURE
    const clickSettings = () => {
        setProfileDisplayValue(false)
        setMessageDisplayValue(false)
        setSettingsDisplayValue(true)

    }





    //FETCH MY PROFILE PHOTO ON PAGE REFRESH
    const [fetchMyProfilePhoto, setFetchMyProfilePhoto] = useState()
    useEffect(() => {

        if (loggedInNameValue) {  

            axios.post("http://localhost:4000/getMyProfile", {

                name: loggedInNameValue

            }).then((response) => {

                setFetchMyProfilePhoto(response.data.myProfilePhoto)

            }).catch((error) => {

                console.log(error)
            })

        }
    }, [ ])


    
    //THIS USEEFECT WILL RUN WHEN THE USER CHANGE THEIR PROFILE PICTURE
    //WE'RE DOING THIS SO THE USER WON'T HAVE TO ALWAYS REFRESH THE PAGE
    //SO SEE TO SEE THE NEW EFFECT WHEN THEY CHANGE THEIR PROFILE PICTURE.

    useEffect(() => {

        if (loggedInNameValue) {  
 
            axios.post("http://localhost:4000/getMyProfile", {

                name: loggedInNameValue

            }).then((response) => {

                setFetchMyProfilePhoto(response.data.myProfilePhoto)
        
            }).catch((error) => {

                console.log(error)
            })

        }

    }, [ profilePhotoChangeValue ])






    
    return(
        <div className="chat-profile-container">
           

            <div className="profile-top">

                {/*THIS IS TO DISPLAY YOUR PROFILE PICTURE */}
                { fetchMyProfilePhoto ? <img src={fetchMyProfilePhoto} width="110px" className="myPhoto"/> : 
                
                <FaUserAlt className="icon"/> 
                
                }

                <p>
                  {/* localStorageName ? localStorageName : 'username?' */}
                  {loggedInNameValue ? loggedInNameValue : 'username not detected'}
                 
                </p>
                 

            </div>
        
            <div className="prof">
            <div className="profile-list"><FaRegBell className="FaRegBell"/> Notification { notificationValue.length }</div>
                <div className="profile-list" onClick={clickProfile}><FaUser className="FaUser"/>Profile</div>
                <div className="profile-list" onClick={clickMessage}><FaCommentDots className="FaCommentDots"/> Message</div>
                <div className="profile-list" onClick={clickSettings}><FaRegSun className="FaRegSun"/> Setting</div>
            </div>
        </div>
    )
}

export default ChatProfile;