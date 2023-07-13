import { useContext, useEffect, useState } from 'react';
import './ProfilePhotoSetting.css'
import { FaUser } from 'react-icons/fa';
import axios from 'axios';
import { LoggedInNameContext } from '../../contextFolder/LoggedInNameContext';
import { ProfilePhotoChangeContext } from '../../contextFolder/ProfilePhotoChangeContext';
import imageCompression from 'browser-image-compression';

function ProfilePhotoSetting () {

      //Let's get the name of the user that logged in (which is you)
      //from the session storage . .  . . . . . . . . . . . . . . .
      let loggedInNameValue = JSON.parse(sessionStorage.getItem("username"));

      const { profilePhotoChangeValue, setProfilePhotoChangeValue } = useContext(ProfilePhotoChangeContext)

      //This handles the upload of profile picture
      const [postImage, setPostImage] = useState( {myFile : ""} )

      //getting response from the server on post request on profile picture
      const [serverPostResponse, setServerPostResponse] = useState()

      //making the value in serverPostResponse disappear after some seconds of display
      useEffect(() => {

         setProfilePhotoChangeValue(serverPostResponse);

         setTimeout(() => {

            setServerPostResponse(' ');

         }, 7000);

      }, [serverPostResponse]);


      const createPost = async (newImage) => {
        try {

            await axios.post("http://localhost:4000/uploadProfilePhoto", newImage).then((response) => {

                setServerPostResponse(response.data.result);

            })

        } catch (error) {
            console.log(error)
        }
      }

      const handleSendImage = async () => {
        createPost(postImage)
        console.log(postImage)
        console.log("uploaded")
      }

      const handleFileUpload = async (e) => {

        const file = e.target.files[0]

        //let's compress the image using the library we installed
        const options = {
            maxSiszeMb: 0.5,
            maxWidthOrHeight: 1920
        }

        try{

            const compressedFile = await imageCompression(file, options)

            const base64 = await convertToBase64(compressedFile /*file*/)
        
            setPostImage({...postImage, myFile : base64, name: loggedInNameValue })

        } catch (err) {

            console.log(err)

        }

       
     
      }

      function convertToBase64(file){

        return new Promise((resolve, reject) => {

            const fileReader = new FileReader();

            fileReader.readAsDataURL(file)

            fileReader.onload = () => {

                resolve(fileReader.result)

            };

            fileReader.onerror = (error) => {
                reject(error)
            }
        })
      }



      //This handles the change password
      
  
    return(

            <div className="profile-photo-setting-body">

                <h1>Settings...</h1>

                <div className="setDiv">

                    <div className="photo-change">

                        <p>profile photo: </p>

                            <p>{serverPostResponse}</p>

                        <div className="pic-display">
  
                        { postImage.myFile ? <img src={postImage.myFile} width="200px" id="img"/> : <FaUser id="FaUser"/> }

                        </div>

                        <div className="imageSelect-and-sendBtn-div">
                            <input type="file" name="myFile" className="imageSelect" onChange={ handleFileUpload } accept="jpeg, .png, .jpg"/> 
                            <button onClick={handleSendImage} className="photoBtn">save picture</button>
                        </div>
                    </div>


                </div>



          </div>


    );
}

export default ProfilePhotoSetting;