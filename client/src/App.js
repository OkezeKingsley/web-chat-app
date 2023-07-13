import './App.css';
import { BrowserRouter, Routes, Route, Switch, Link } from 'react-router-dom';
import Login from './asset/AccessFolder/Login';
import ChatParent from './asset/ChatParentFolder/ChatParent';
import Signup from './asset/AccessFolder/Signup';
import ChatProfile from './asset/ChatProfileFolder/ChatProfile';
import ChatList from './asset/ChatListFolder/ChatList';
import { useState } from 'react';
import { OtherUserNameContext } from './asset/contextFolder/OtherUserNameContext';//importing OtherUserName Context
import ChatBody from './asset/ChatBodyFolder/ChatBody';
import UserProfile from './asset/UserProfileFolder/UserProfile';
import { ProfileDisplayContext } from './asset/contextFolder/ProfileDisplayContext';
import { MessageDisplayContext } from './asset/contextFolder/MessageDisplayContext';
import Settings from './asset/SettingsFolder/Settings';
import { SettingsDisplayContext } from './asset/contextFolder/SettingsDisplayContext';
import { ProfilePhotoChangeContext } from './asset/contextFolder/ProfilePhotoChangeContext';
import PrivateRoutes from './asset/utilis/PrivateRoutes';
import MobileChatList from './asset/MobileViewFolder/MobileChatList';
import { AddUserToChatListContext } from './asset/contextFolder/AddUserToChatListContext';
import { NotificationContext } from './asset/contextFolder/NotificationContext';


function App(){

  //This context api useState carries the Name of the other user that you can chatting with
  const [otherUserNameValue, setOtherUserNameValue] = useState() 

  //This context api useState carries the instuction if user profile should be displayed after the option is clicked
  const [profileDisplayValue, setProfileDisplayValue] = useState(false)

  //context for display message
  const [messageDisplayValue, setMessageDisplayValue] = useState(false)

  //context for displaying the settings
  const [settingsDisplayValue, setSettingsDisplayValue] = useState(false)

  //this state context carries when user change their profile picture 
  const [profilePhotoChangeValue, setProfilePhotoChangeValue] = useState() 

  //This state adds user to your chatlist when they send you a message
  const [addUserToChatListValue, setAddUserToChatListValue] = useState()

  //This state holds the value for notification count
  const [notificationValue, setNotificationValue] = useState([])
 
  return(
    <div>
        <OtherUserNameContext.Provider value={ { otherUserNameValue, setOtherUserNameValue } }>
          <ProfileDisplayContext.Provider value={ { profileDisplayValue, setProfileDisplayValue } } >
            <MessageDisplayContext.Provider value={ { messageDisplayValue, setMessageDisplayValue } }>
              <SettingsDisplayContext.Provider value={ { settingsDisplayValue, setSettingsDisplayValue } }>
                <ProfilePhotoChangeContext.Provider value={ { profilePhotoChangeValue, setProfilePhotoChangeValue } }>
                  <AddUserToChatListContext.Provider value={ { addUserToChatListValue, setAddUserToChatListValue } }>
                    <NotificationContext.Provider value={ { notificationValue, setNotificationValue } } >
                      <BrowserRouter>
                        <Routes>
                          <Route path="/" element={<Login />} />
                          <Route path="/signup" element={<Signup />} />
                          <Route element={<PrivateRoutes />} >
                            <Route path="/dashboard" element={<ChatParent />} />
                            <Route path="/chatprofile" element={<ChatProfile />} />
                            <Route path="/chatlist" element={<ChatList />} />
                            <Route path="/chatbody" element={<ChatBody />} /> 
                            <Route path="/userprofile" element={<UserProfile />} />
                            <Route path="/settings" element={<Settings />} />
                          <Route path="/mobilechatList" element={<MobileChatList />} />
                          </Route>
                        </Routes>
                      </BrowserRouter>
                    </NotificationContext.Provider>
                  </AddUserToChatListContext.Provider>
                </ProfilePhotoChangeContext.Provider>
              </SettingsDisplayContext.Provider>
            </MessageDisplayContext.Provider>
          </ProfileDisplayContext.Provider>  
        </OtherUserNameContext.Provider>

</div>

  );

}

export default App;
