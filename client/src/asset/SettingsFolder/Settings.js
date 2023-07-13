import './Settings.css'
import ProfilePhotoSetting from "./ProfilePhotoSettingFolder/ProfilePhotoSetting";
import PasswordSettings from './PasswordSettingFolder/PasswordSetting';

import { useContext, useEffect } from 'react';
import { AddUserToChatListContext } from '../contextFolder/AddUserToChatListContext';

function Settings ( ) {
    const {addUserToChatListValue, setAddUserToChatListValue} = useContext(AddUserToChatListContext); 
    useEffect(() => {
        console.log('settings own' + addUserToChatListValue)
    }, [addUserToChatListValue])

    return(
        <div id="settings-body-div">
        <div className="settings-container">
            <ProfilePhotoSetting />

            <PasswordSettings />
        </div>

        </div>
    )
}

export default Settings;