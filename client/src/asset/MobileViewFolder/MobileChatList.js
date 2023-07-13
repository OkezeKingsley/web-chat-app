import { useContext, useEffect, useRef, useState } from "react";
import { FaAdn, FaCheck, FaExclamationCircle, FaRegBell, FaSistrix } from "react-icons/fa";
import './MobileChatList.css';
import axios from 'axios';
import { OtherUserNameContext } from "../contextFolder/OtherUserNameContext";
import { MessageDisplayContext } from "../contextFolder/MessageDisplayContext";
import { ProfileDisplayContext } from "../contextFolder/ProfileDisplayContext";
import { SettingsDisplayContext } from "../contextFolder/SettingsDisplayContext";
import { useNavigate } from "react-router-dom";
import socket from '../SocketModuleFolder/socket';


 function MobileChatList ( ) {

    //Let's get the name of the user that logged in (which is you)
    //from the session storage . .  . . . . . . . . . . . . . . .
    let loggedInNameValue = JSON.parse(sessionStorage.getItem("username"));


    //---------- [ CONTEXT API FOR THIS FILE... ] ----------//
    const { otherUserNameValue, setOtherUserNameValue } = useContext(OtherUserNameContext) 

    //Displays message component when you click on list of conversed with user
    const { messageDisplayValue, setMessageDisplayValue } = useContext(MessageDisplayContext)
    const { profileDisplayValue, setProfileDisplayValue } = useContext(ProfileDisplayContext)
    const { settingsDisplayValue, setSettingsDisplayValue } = useContext(SettingsDisplayContext)

    //This hold the value for every notification we've. It stores the user that  
    //sent use message and have'nt responded to.
    const [ notificationValue, setNotificationValue ]  = useState()
    

   //THIS SET THE VALUE OF OUR OTHERNAMEVALUE TO EMPTY ON LOAD OF THIS PAGE
   window.onload = () => {  

    setOtherUserNameValue(sessionStorage.setItem("otherUserName", JSON.stringify(" ")));

    console.log('onload of mobile chat' + otherUserNameValue);

   }


   //THIS LISTENS FOR RECEIVING MESSAGES FROM SOCKET SERVER
    socket.on("receive_message", (data)  => {  

        console.log('works' + JSON.stringify(data));

        const [f, t] = [data.from, data.to];
        
        if (f !== otherUserNameValue && t === loggedInNameValue) {
    
                //if conversedWithList doesn't include this particular user, add the user
                //to my chatlist.
    
                if (!conversedWithLists.includes(f)) {
    
                    //saving this user to our chatlist and notfication database
                    //but first checking if on small screen befor initialization 
                      console.log('doesnt include this user in chatlist')  
                    saveToChatList(f)

                }

                /* 
                let confirmIfUserIsInNotificationList = notificationValue.filter(i => i === f);

                if  (!confirmIfUserIsInNotificationList ) { 

                    console.log("this user is not in my notification list")*/
                //Set notification count for unread message 
               /*        
                    socket.emit("addToNotification", {userName: t, 

                            personToAddToNotificationList: f

                    }); 
    
                }
    */
        
        }


    });



    
    //Let's listen for notification reponse. . . . . . . . . . . . . . . . . 
    socket.on("myNotification", (data) => {
 
        if (data.personToAddToNotificationList !== otherUserNameValue) {
           
            //This will add user to notification if the personToAddToNotification
            //isn't the same as the person we're currently chatting with.

            setNotificationValue((prevState) => [...prevState, data.personToAddToNotificationList]);
            
        }

    });





    


    //-------- [ OUR USEREF FOR THIS COMPONENT... ] --------//

    //THIS IS FOR OUR SCROLLABLE CHAT list      
    const scrollableChatListRef = useRef();

    //THIS IS FOR THE FILTERING OF SEARCH DIV
    const filterParentContainerRef = useRef();

    //THIS IS FOR THE CONVERSED WITH DIV
    const conversedWithParentContainerRef = useRef();

    //THIS IF HANDLING HIDING UNREAD MESSAGE ICON
    const unReadRef = useRef();


    //THIS HIDES THE FILTER PARENT CONTAINER DIV ONCE A USER THAT 
    //DISPLAY ON SEARCH LIST IS CLICKED ON . . . . . . 
    const hideFilterParentContainerRef = () => {

        filterParentContainerRef.current.style.display = "none"

        conversedWithParentContainerRef.style.display = "true"

    }

    //THIS SHOWS FILTERED PARENT CONTAINER WHEN YOU START SEARCHING
    //FOR USER IN THE SEARCH BOX. . . . . . . . . . . . 
    const showFilterParentContainerRef = () => {

        filterParentContainerRef.current.style.display = "block"

   //     conversedWithParentContainerRef.style.display = "none"

    }


    //THIS REMOVES USER FROM YOUR NOTIFICATION LIST WHEN THEY ARE CLICKED
    //ON . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
    const handleRemovingThisUserFromNotificationList = (thisUser) => {

        setNotificationValue([])//first let's empty the notification array.

        //Let's then send the name of the person we want to remove to
        //our DB then return the remaining people in our saved notification
        //list in the database then put that value in the notification array. 

        
        axios.post("http://localhost:4000/removeThisUserNotification", {

            loggedInUser: loggedInNameValue,

            personToRemove: thisUser

        }).then((result) => {

            if (result) {

                result.data.forEach((resData) => {

                    let addThis = resData.personToAddToNotificationList

                    //when we get the result of people in our notification list,
                    //let's add them to our notification array and also (don't
                    //add people that already exist in the array to prevent name
                    //appearing twice which will affect the length of the array.
                    //mind you, the length of the array will we used to count how
                    //many notification we have . . . . . . . . . . . . . . . .)
                    if ( !notificationValue.includes(addThis) ) { 

                    setNotificationValue((prevState) => [...prevState, addThis])

                    }

                });
 
               
            }
            
            
        }).catch((err) => {

            console.log(err)

        });    

        
        //This hides the notification alert symbol icon that shows close to user
        
        unReadRef.current.style.display = "none";
        

    }


   
    

    //If on large screen, this makes sure the message component is what is 
    //visible (not the profile or setting component) .  . . . . . . . 
    const clickMessage = () => {
        setProfileDisplayValue(false)
        setSettingsDisplayValue(false)
        setMessageDisplayValue(true)
    }
    
    

    /* - - - - - [ALL USESTATE FOR THIS PARTICULAR COMPONENT] - - - - - */

    //This is for navigating to chat message room (when on small screen)
    const navigate = useNavigate();

    //This will help us storing the list of user that we've conversed with
    const [conversedWithLists, setConversedWithLists] = useState([])

    //This setFilteredData will store the filtered element based on the user
    //search input and then store it in the filteredData variable so we can
    //map it
    const [filteredData, setFilteredData] = useState([])

    //This is used for capturing what the user types into the search box
    const [searchWord, setSearchWord] = useState();
   


    /* - - - - - [ALL OUR FUNCTIONS FOR THIS PARTICULAR COMPONENT] - - - - -*/

    //This is to store what the user type in the search box so we can
    //use for filtering and also filter the name of user in realtime 
    //based on serach input
    const onChangeFunction = ( event ) => {

        //This will grab the value in the user type in the input box and store it in the searchFilter state
        //please note: the toLowerCase() will convert the value to lowercase so that it can match with the
        //lowercase name properties in the database. (we'd convert all name properties in DB to lowercase too)
        setSearchWord(event.target.value.toLowerCase())
        
        //This will filter out users that matches the character inputted by the user in realtime
        //and then store it in the newFilter variable. please note: the toLowerCase() will convert the value of the
        // DB name property to lowercase so that it can match with the value from the search input which we already 
        //convertted to lowercase using the toLowercase() method.
    
        //Here we're returning users that their names matches with the value the user is inputting as they
        //are typing it out on the go...
        
        if (searchWord) {
       
            axios.post("http://localhost:4000/searchAllUsers",{
    
                searchInput: searchWord.toLowerCase()
                
    
            }).then((response) => {
    
                console.log(response.data)
    
                response.data.forEach((resData) => {
    
                    let name = resData;
    
                    //Here let check if filteredData already have this user stored in it already 
                    //to avoid duplicate display of names that already exist in this array.
                    let checkIfThisUserExistUsingItName = filteredData.some((object) => object === name);
    
                   

                    if (!checkIfThisUserExistUsingItName) {
                        
                        setFilteredData([{name: name}])
                    }
    
                
                })
    
        
            } ).catch ( (error) => {
            
                console.log("oops! Couldn't reach the server" + error)
            
            } )
    
        } 



        if (!searchWord || searchWord === " ") {

            hideFilterParentContainerRef()
        }

        //This shows the filters parent container whenonChange of the input search box
        showFilterParentContainerRef();


    }




    let [show, setShow] = useState('block')
    !filteredData ? show = 'none' : show = 'block'

   
    //This function is used for getting the user with the name that matches what the user is typed in
    //the search box once they clicked the search button close to the search input box
    const searchUser = () => {
   
        if (searchWord) {
       
            axios.post("http://localhost:4000/getAllUsers",{
    
                searchInput: searchWord.toLowerCase()
                
    
            }).then((response) => {
    
                console.log(response.data)

                response.data.forEach((resData) => {

                    let name = resData;
            
                    //Here let check if filteredData already have this user stored in it already 
                    //to avoid duplicate display of names that already exist in this array.
                    let checkIfThisUserExistUsingItName = filteredData.some((object) => object === name);
    
                    
                    if (!checkIfThisUserExistUsingItName) {
                       
                        setFilteredData([{name: name}])
     
                     }
     
                  
                 })
     
           
             } ).catch ( (error) => {
             
                 console.log("oops! Couldn't reach the server" + error)
             
             } )


        }

            //This shows the filters parent container SEARCH button is clicked
            showFilterParentContainerRef()
    

    }


    //OPEN MESSAGE CHAT 
    const openMessageChat = () => {

        navigate('/chatbody')
    }

    //OPEN SETTINGS FEATURE
    const goToSettings = () => {
        navigate('/settings')
    }

    //GO TO MY PROFILE
    const goToProfile = () => {
        navigate('/userprofile')
    }

     
    //THIS FUNCTION SAVE A PERSON TO YOUR CHATLIST IN OUR DATABASE WHEN
    //THEY ARE BEING CLICK ON AND THEN ADD THE PERSON TO OUR CONVERSED 
    //WITH ARRAY IN OUR FRONTEND AFTER DB SAVE IS SUCCESSFUL. . . . . .
    function saveToChatList (nameToSaveToChatList) {

        if (loggedInNameValue && nameToSaveToChatList) {

            axios.post("http://localhost:4000/saveToChatList", {

                loggedInUser:  loggedInNameValue,

                personToSaveToChatList: nameToSaveToChatList

            }).then((response) => {

                 //let's add the person our conversed with array
                setConversedWithLists((prevState) => [...prevState, response.data.result])

            }).catch((err) => {

                console.log(err)

            });

        }

    }

    
     //THIS USEEFFECT IS USED TO FETCH ALL SAVED CONVERSED WITH LIST ON EVERY PAGE RENDER
     useEffect(() => {
    
        if (loggedInNameValue) { 

            axios.post("http://localhost:4000/getMyChatList", {

                loggedInUser: loggedInNameValue

            }).then((response) => {

            //filtering all the people in my chatlist and then putting it in my conversed with list
            const c = response.data.filter((item) => {

                return setConversedWithLists((prevState) => [...prevState, item.personToSaveToChatList]);
                
            })

            }).catch((err) => {

                console.log(err);

            });

        }

    
    }, [])




    //THIS EFFECT WILL BE USED TO GET ALL YOUR AVAILABLE NOTIFICATION ON PAGE
    //RELOAD
    useEffect(() => {

        //first let's empty the notification value
        setNotificationValue([])

        axios.post("http://localhost:4000/getMyNotifications", {

            username: loggedInNameValue

        }).then((response) => {

            response.data.forEach((resData) => {

                let addThis = resData.personToAddToNotificationList

                    setNotificationValue((prevState) => [...prevState, addThis])

            });
            
        }).catch((err) => {

            console.log(err)

        });



    }, [])
    


    //LET REMOVE THE ICON CLOSE A USER WE'RE CURRENTLY CHHATING WITH IF
    //THEY ARE IN THE NOTIFICATION LIST...
    if (notificationValue.includes(otherUserNameValue)) {

        setNotificationValue(notificationValue.filter((i) => i !== otherUserNameValue)) 

    }
   
   

 
    return(
        <div className="mobile-chat-list-container" >

           <div className="mobile-view-top-header-parent-div">

            <div className="mobile-view-top-flex">

                <h2 className="h2">Messages</h2>

                <div>
                    <FaRegBell className="mobile-view-FaRegBell"/> <b id="count">{notificationValue.length}</b>
                </div >

            </div>
            
            {/*This is for the search user's input box*/}

            <div className="mobile-view-search-input-div">

                <input type="text" className="mobile-view-search-input" onChange={onChangeFunction}></input>
            
                <FaSistrix className="mobile-view-search-input-icon" onClick={searchUser}/>    
               
            </div>


            <ul className="ul-list">
                <li onClick={goToProfile}>profile</li>
                <li onClick={goToSettings}>settings</li>
                <li>{ loggedInNameValue ? <FaAdn id="ul-active-icon"/> : 'offline' }</li>
            </ul>



            </div>{/*TOP HEADER DIV END*/}

        

            <div className="mobile-view-scrollable-chat-list">{/*SCOLLABLE DIV*/}

            {/*This is for when user is searching for name. It filters the names available based on
               the user query or search */}
            <div className="mobile-view-filterAndConversewithParentDiv">


             <div className="mobile-view-filterParentContainer" ref={filterParentContainerRef} >

                {
                    filteredData.map((filter, id) => ( 

                    <div key={id} className="mobile-view-filtered-user" style={{display: show}} onClick={( ) => {

                        if (conversedWithLists.includes(filter.name)) {

                  
                        } else if ( !conversedWithLists.includes(filter.name) ){

                        //if user's name is not in our list of converesed with, it should
                        //add it to it.
                              saveToChatList(filter.name);
                        }

                        hideFilterParentContainerRef();
                        
                        }}>
                      
                        
                      <p className="mobile-view-filteredFlex" >

                            <p>
                            { /*THIS CHECKS IF FILTERED USER HAS PROFILE PICTURE SO IT CAN BE DISPLAYED
                                CLOSE TO THE NAME AND IF NO, IT SHOULD DISPLAY THE FIRST LETTER THAT 
                                BEGINS IT NAME AS THE PICTURE CLOSE TO THE NAME */

                            filter.name ?  <b className="mobile-view-image-behind-filter-name">{ 
                                
                                String(filter.name).charAt(0) 
                            
                            }</b>  : ""

                        
                            }
                            </p>         

                            <p className="mobile-view-filterName">
                                {filter.name}
                            </p>


                        </p>

                    </div>
                    
                    ))
              
                 }
           
             </div>{/*filterParentContainer CLOSING DIV*/}


            { filteredData.length > 0 ? <p id="convo-p">CONVERSED WITH...</p> : "" }
            
            {/*THIS MAPS WHO YOU HAVE CONVERSED WITH. IT SHOWS ALL THE LIST*/}
            <div className="mobile-view-conversedWithParentContainer">
               { 
                conversedWithLists.map((conversedWithList, id) => ( 

                <div key={id}  className="mobile-view-conversed-user" onClick={ ( ) => {

                   {/*onClick of a user in the chatlist will pass the name of the user to 
                    the chatbody using the contextapi crafted for OtherUserNameValue*/} 
                  
                    setOtherUserNameValue(conversedWithList);

                    openMessageChat();

                    //Removing from notification list & hiding unread message icon behind it if any.
                    handleRemovingThisUserFromNotificationList(conversedWithList)

                   
                }}>
                    
                   <p> 
                    { 
                    
                    conversedWithList ? <b className="mobile-view-image-behind-conversed-name">{ 

                        String(conversedWithList).charAt(0) 

                    }</b> : ""

                    }  

                        { conversedWithList }
                        
                    </p>


                    <p>
                    {
                    
                    //Gives an alert like signal icon to indicate unread message
                
                     notificationValue.includes(conversedWithList) ? 
                     
                     <b ref={unReadRef}><FaExclamationCircle className="mobile-view-unreadMessageIcon"/></b> : ""

                    }
                    </p>

                   
                </div>
                
                ))
            }  

        </div>{/*ConversedwithParentContainer CLOSING DIV*/}



        </div>{/*filterAndConversewithParentDiv CLOSING DIV*/}


        </div>{/*SCROLLABLE DIV CLOSING DIV*/}    

        </div>
    )
}



export default MobileChatList;