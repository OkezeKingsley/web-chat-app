import './ChatParent.css';
import ChatBody from '../ChatBodyFolder/ChatBody';
import ChatHeader from '../ChatHeaderFolder/ChatHeader';
import ChatProfile from '../ChatProfileFolder/ChatProfile';
import ChatList from '../ChatListFolder/ChatList';
import { Link, Route, Routes } from 'react-router-dom';
import { useContext, useState } from 'react';
import { ProfileDisplayContext } from '../contextFolder/ProfileDisplayContext';
import UserProfile from '../UserProfileFolder/UserProfile';
import { MessageDisplayContext } from '../contextFolder/MessageDisplayContext';
import { SettingsDisplayContext } from '../contextFolder/SettingsDisplayContext';
import Settings from '../SettingsFolder/Settings';


function ChatParent(){

  const { profileDisplayValue, setProfileDisplayValue } = useContext(ProfileDisplayContext) 
  const { messageDisplayValue, setMessageDisplayValue } = useContext(MessageDisplayContext) 
  const { settingsDisplayValue, setSettingsDisplayValue } = useContext(SettingsDisplayContext)

    return(
        <div>
            <ChatHeader />

          <div className="AppGrid">

            <ChatProfile id="chat-list-component"/>

            <ChatList/>
          
          {/* Here we saying if profileDisplay is true, show it component. 

              same applies for other component other component like message component and settings component.

        */}
            { profileDisplayValue === true ? <UserProfile /> 
            : messageDisplayValue === true ? <ChatBody />
            : settingsDisplayValue === true ? <Settings />
            : <ChatBody /> }

            
            
          </div>
          
        </div>
    )
}

export default ChatParent;