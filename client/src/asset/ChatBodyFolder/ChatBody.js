import './ChatBody.css';
import { v4 as uuid } from 'uuid';
import { FaTelegramPlane, FaTrash } from 'react-icons/fa'
import { useContext, useEffect, useRef, useState } from 'react';
import socket from '../SocketModuleFolder/socket';
import { OtherUserNameContext } from '../contextFolder/OtherUserNameContext';
import axios from 'axios';
import { AddUserToChatListContext } from '../contextFolder/AddUserToChatListContext';
import { NotificationContext } from '../contextFolder/NotificationContext';



//const socket = io.connect("http://localhost:4000"); //making a connection to the server


function ChatBody ( ){

    //THIS STATE IS FOR THE MESSAGE THAT WILL BE SENT TO THE SERVER  
    //SERVER SO IT CAN BE EMITTED.
    const [text, setText] = useState('')


    //THIS STATE IS WHAT WILL BE MAPPED AND PRINTED ON THE USERS UI 
    const [mappingTheCurrentChats, setMappingTheCurrentChats] = useState([])  


    //THIS IS FOR DISPLAYING WHEN THE OTHER USER IS TYPING...
    const[userIsTyping, setUserIsTyping] = useState('')

    

    //DEFINING THE USEREF'S...

    //THIS IS USED TO CHANGE THE VALUE OF INPUT STRING TO AN EMPTY STRING.
    const inputRef = useRef()


    //THIS IS FOR OUR SCROLLABLE CHAT BODY      
    const scrollRef = useRef()
    //   scrollRef.scrollTop = scrollRef.scrollHeight;
    
  
    //THIS IS THE scrollToBottomAlwaysOnNewMessageRef USEREF
    const scrollToBottomAlwaysOnNewMessageRef = useRef(null)

    //This is for the textbox parent div ref
    const textDivRef = useRef()


   
   
    //OUR USECONTEXT FOR THIS FILE . . . . . . . . . . . . . . . . . . . . . . . 
    //This holds value of the other person you are chatting with
    const { otherUserNameValue, setOtherUserNameValue } = useContext(OtherUserNameContext)

    //this hold value of who to add to add to chat list when they send you 
    //message and you're  currently not chatting with them
    const { addUserToChatListValue, setAddUserToChatListValue } = useContext(AddUserToChatListContext)

    //This hold the value for every notification we've. It stores the user that  
    //sent use message and have'nt responded to.
    const { notificationValue, setNotificationValue }  = useContext(NotificationContext)

console.log(notificationValue)
    //LET'S GET LOGGED IN USER NAME SAVED IN OUR SESSION STORAGE
    let loggedInNameValue = JSON.parse(sessionStorage.getItem("username"));


    
    //SAVING THE NAME OF OTHER USER IN SESSION STORAGE
    useEffect(() => {

        if (otherUserNameValue) {  

        sessionStorage.setItem("otherUserName", JSON.stringify(otherUserNameValue))

        }


    }, [otherUserNameValue])

    //GETTING THE NAME OF OTHER USER IN SESSION STORAGE ON PAGE REFRESH
    useEffect(() => {

        let storedOtherUserNameData = JSON.parse(sessionStorage.getItem("otherUserName"))

        if (storedOtherUserNameData) {

            setOtherUserNameValue(storedOtherUserNameData)

        }

    }, []);



    //FETCHING OLD CHATS WITH OTHERUSERNAMEVALUE

    const [mappingOldChats, setMappingOldChats] = useState([{}]);

    useEffect(() => {  
        
       //Let's first set the old messages to an empty array.
       setMappingOldChats([{}])

       axios.post("http://localhost:4000/fetchOldMessagesWithThisUser", {

       from: loggedInNameValue,

       to: otherUserNameValue

    }).then((response) => {
      
            response.data.forEach((responseData) => {
                
                let dataMessage = responseData.message;
                let dataMessageFrom = responseData.from;
                let dataMessageTo = responseData.to;

                //let's first set mappingOldChats as an array of empty object
                //then let's set mappingOldChats to the pasts messages.
                setMappingOldChats((prevState) => [...prevState, {dataMessage, dataMessageFrom, dataMessageTo }])

        
        })

    

    }).catch((err) => {

        console.log(err)
        
    })
    
    }, [otherUserNameValue]);



    //FETCHING OLD CHATS WITH OTHERUSERNAMEVALUE WHEN PAGE REFRESH WHILE CHATTING
    useEffect(() => {

        if (loggedInNameValue && otherUserNameValue) {  

            axios.post("http://localhost:4000/fetchOldMessagesWithThisUser", {
    
            from: loggedInNameValue,
    
            to: otherUserNameValue ? otherUserNameValue : ''
    
        }).then((response) => {
    
            response.data.forEach((responseData) => {
            
                let dataMessage = responseData.message;
                let dataMessageFrom = responseData.from;
                let dataMessageTo = responseData.to;
                console.log({dataMessage, dataMessageFrom, dataMessageTo});

                
                setMappingOldChats((prevState) => [...prevState, {dataMessage, dataMessageFrom, dataMessageTo }])

        
            })
    

            }).catch((err) => {

                console.log(err)
                
            })
        
        }

        }, []);


    
    //IF USER IS ON SMALL SCREEN, LET GET THE WINDOW HEIGHT, SO WE CAN HELP 
    //DO THE FLOATING TEXT BOX WHEN USER IS TYPING AND KEYBOARD IS VISIBLE...
    const [heightOfWindowWithoutKeyboard, setHeightOfWindowWithoutKeyboard] = useState()
    
    useEffect(() => {

        const matchResult = window.matchMedia("(max-width: 767px)");
            
        if (matchResult.matches === true) {

            setHeightOfWindowWithoutKeyboard(window.innerHeight)
        }
        
        
    
    }, [])    



    //HANDLE STATEMENT FUNCTIONS FOR THIS COMPONENT

    const [heightOfWindowWithKeyboard, setHeightOfWindowWithKeyboard] = useState()//hold value of screen height on small screen

    //HANDLING WHEN OTHER USER IS TYPING . . .
    //This will be used to dictect when the other user is typing...
    //and then it will send the ('typing') message
    //to the other user connected in the socket server.
    const handleTyping = () => {

        socket.emit('typing', {

            typingNotification: 'is typing...', 

            userNameTyping: loggedInNameValue, 

            userNameReceivingTyping: otherUserNameValue
        })



        //Then we want to get the height of the window the user is typing
        //on small screen
        const matchResult = window.matchMedia("(max-width: 767px)");
            
        if (matchResult.matches === true) {

            setHeightOfWindowWithKeyboard(window.innerHeight)

            //Then let's minus the height of window when keyboard is present
            //from the height of window when keyboard isn't present so we can
            //give text-box-div" or textDivRef a margin bottom of that value.
            let newMarginBottomFortextDivRef = heightOfWindowWithoutKeyboard - heightOfWindowWithKeyboard

            textDivRef.current.style.marginBottom = newMarginBottomFortextDivRef + "px";

        }


    }//HANDLE TYPING CLOSING FUNCTION BLOCK


    //THIS WILL INVOLKE WHEN OTHER USER IS NOT TYPING OR WHEN THEY
    //GETS OF THE TEXT BOX.
    const handleNotTyping = () => {

        socket.emit('notTyping', ' ')

        //Then also, if user is on small screen, let's set the margin 
        //bottom of textbox div parent or textDivRef to zero
        const matchResult = window.matchMedia("(max-width: 767px)");
            
        if (matchResult.matches === true) {

        textDivRef.current.style.marginBottom = "0px";

        }


    }

    


    
    //The sendMessage function will be used to send the message
    //data in the input box to the server so that the server can 
    //emit the message data to the clients it's suppode to it send it to.
    //NOTE: data must be sent to the server first before it can be
    //using their socket id. React can't directly emit the message
    //data to other client without first getting to the server.
    const sendMessage = () => {

        if (loggedInNameValue && otherUserNameValue) { 

        //Here we want to send message to the server to receive so
        //that it can emit it to other client. After the "send_message"
        //event listener, an object should follow it which will contain
        //the message data information
        socket.emit("send_message", { message: text, from: loggedInNameValue, to: otherUserNameValue })

        //This is used to change the value of the input to empty string
        //when the send button is clicked
        inputRef.current.value = " ";
        setText(' '); 

        } else {

            alert('Unable to read sender or receiver name.')

        }  
       
       
    };

 

    //We will be listening to the receive message event here after
    //the sever has receive a message from a user and want to emit it
    //to every user connected.
    useEffect(() => {

        socket.on("receive_message", (data)  => {  
           
        //The (data.message) below holds the message property value received 
        //from the server and we give each message a random unique ID so that 
        //we can do stuff like deleteing the message using it unique ID etc...

        const [m, f, t, i] = [data.message, data.from, data.to, uuid()];

        if (loggedInNameValue && otherUserNameValue) {  

        setMappingTheCurrentChats((prevState) => [...prevState, { dataMessage: m, id: i, dataMessageFrom: f, dataMessageTo: t } ]);

         }

        //This says whenever someone send you a message and the value of the 
        //otherUserName variable is not the same as the person sending you the message,
        //don't show us the message while we're chatting with other people. Why 
        //the message should not display? This is so so as to prevent message 
        //to avoid classhing with other user when we're chatting with them.
        if (f !== otherUserNameValue && t === loggedInNameValue) {
     
            if (otherUserNameValue === null || otherUserNameValue) {
                //This says whether there is value for otherUserNameValue or not, just 
                //leave what is inside mappingTheCurrentChats and then add nothing
                setMappingTheCurrentChats((prevState) => [...prevState]);







                const foundString  = notificationValue.find(element => element === f);

                if (foundString) {
                    console.log('found string')
                } else {
                    socket.emit("addToNotification", {userName: t, 
    
                        personToAddToNotificationList: f
    
                    });
                } 
                 
            }
            
            //when someone is online and they sends you message and the person isn't who you're  
            //chatting with, let's add that person to your chatlist and then add user to our 
            //notification list. . . . . . . . . . . . . . . . .  .. . . . . . . . . . . . . .
            //also let's only apply this when you're logged in on a device with larger screen
            //because this same process have been handled for when on small screen in the 
            //MobileChatlist Folder. So to avoid double adding to chatlist and notification list,
            //it's better as we handled them when on various screen size using the conditional.

            setAddUserToChatListValue(f);

           

         /*      
            let checkForUser = notificationValue.includes(f);


            if (checkForUser === true) {


            }
 
            else if (checkForUser === false) {

                console.log("this user is not in my notification list")

                socket.emit("addToNotification", {userName: t, 

                    personToAddToNotificationList: f

                });

            }
            */
           // if  (notificationValue.includes(f) == false) { 
                        
            //console.log("it doesnt include", notificationValue.indexOf(f), notificationValue)
                //Set notification count for unread message 
              /*          
                socket.emit("addToNotification", {userName: t, 

                    personToAddToNotificationList: f

                });
              */          

            //}

           
         }    
            
 
       



      
        });  

    }, [socket, loggedInNameValue, otherUserNameValue])

 

    //This useEffect handles when the other user is typing.
    //it receive the information from the server so
    //we can display it on the front end.

    useEffect(() =>{

        socket.on("isTyping", (data) => {
          
            setUserIsTyping(data.typingNotification) 
    
        })
        

    }, [socket])



    //THIS USEEFFECT HANDLES WHEN THE OTHER USER IS NOT TYPING,
    //WE'D GET AN EMPTY STRING
     useEffect(() => {

        socket.on("isNotTyping", (data) => {

            setUserIsTyping(data)

        })

     }, [socket])



     //THIS RECEIVES MY NOTIFICATION WHEN IT'S BEEN TRIGGER IN SERVER
     useEffect(() => {
        
        //Listenning for new notification and then adding it to our notification
        //array. But first check if the person to add to notification is not the
        //same as the current person we're chatting with which is the value 
        //otherUserNameValue variable holds
       
        socket.on("myNotification", (data) => {

        
            //importantly, let's check if the person to add to notification list
            //doesn't already exist in the notification array before adding.
            //why we do this is so that it won't cause having duplicates of a user
            //in the array which will directly affect the length of the notification count.
        
            if (data.personToAddToNotificationList !== otherUserNameValue) {

                let checkForUser = notificationValue.includes(data.personToAddToNotificationList);

                if (checkForUser === false) {
    
                setNotificationValue((prevState) => [...prevState, data.personToAddToNotificationList]);     
                console.log('new not list is' + notificationValue)

                }

            }

           return () => socket.off("myNotification")

        });


     }, [ socket ]);



     //SCROLL EFFECT: THIS MAKES SURE CHAT PAGE ALWAYS STAY DOWN WHEN NEW MESSAGE 
     //ENTERS. . . . . . . . . . . . . . . . . . . . . . . . . . .
     useEffect(() => {

        //This will make sure the bottom image is always shown when new message enters.
        scrollToBottomAlwaysOnNewMessageRef.current?.scrollIntoView(false)
        
    }, [mappingTheCurrentChats])






    return(

        <div className="chat-body-container">
          
            <div className="chatNav">
           
             <b > 

             { otherUserNameValue ? <strong className="image-behind-otherUserNameValue"> {otherUserNameValue.charAt(0)} </strong> 
             
             : '' 
             
             } 
             
             </b>
                     
                <b> {otherUserNameValue ? otherUserNameValue : ""}: <i id="userIsTyping">{userIsTyping}</i> </b>

            </div> {/*CHATNAV DIV ENDS*/}


    

            <div className="scroll" ref={scrollRef} >


             {/*THIS IS FOR MAPPING OLD/HISTORY CHATS BETWEEN USERS CHATTING*/}    

              { mappingOldChats ?
           
                mappingOldChats.map((mappingOldChat, id) => 
                    //checking messages that are for the sender so it can have different styling
                    mappingOldChat.dataMessageFrom === loggedInNameValue ? (  

                            <div key={id} className="fromOldListMessageData">

                               {mappingOldChat.dataMessage}

                            </div>
                                         

                    ) : (
                    //checking messages that are for the receiver so it can have different styling
                            <div key={id} className="toOldListMessageData">

                               {mappingOldChat.dataMessage}

                            </div> 

                        )
  
                     
                    )  : ""

                    
                } {/*MAPPING OLD CHATS CURLY CONTAINER ENDING*/}
                    





                {/*THIS IS FOR MAPPING CUREENT CHATS BETWEEN USERS CHATTING*/}

                {mappingTheCurrentChats.map((mappingTheCurrentChat, id) => 
                    //checking messages that are for the sender so it can have different styling
                    mappingTheCurrentChat.dataMessageFrom === loggedInNameValue ? (  

                            <div key={id} className="fromListMessageData">

                               {mappingTheCurrentChat.dataMessage}

                            </div>
                                         

                    ) : (
                    //checking messages that are for the receiver so it can have different styling
                            <div key={id} className="toListMessageData">

                               {mappingTheCurrentChat.dataMessage}

                            </div>

                    )

                    )        
        
                } {/*MAPPING THE CURRENT CHAT CURLY CONTAINER ENDS*/}


              {/*THIS IS DIV THAT MAKE SURE LAST MESSAGE IS ALWAYS SHOWING WHEN NEW MESSAGE ENTERS*/}    
              <div ref={scrollToBottomAlwaysOnNewMessageRef} />
        
               
            </div> {/*SCROLLABLE CHAT CONTAINER CLOSING DIV*/}



            {/*PARENT DIV FOR THE MESSAGE BOX AND SEND MESSAGE BUTTON*/}
            <div className="text-box-div" ref={textDivRef} >

                <textarea

                placeholder= {'reply to ' + otherUserNameValue + '...'}
                
                onChange={(e) => setText(e.target.value)} //This is to store what user write inside the text variable

                className="text"

                ref={inputRef}

                onMouseEnter={handleTyping}

                onMouseLeave={handleNotTyping}
         
                />

                {/* clicking the button below sends your message*/}
                {/* <button onClick={sendMessage} className="txt-btn">send message</button> */} 
                <div>
                     <FaTelegramPlane onClick={sendMessage} className="txt-btn"/>
                </div> 

                
            </div>{/*MESSAGE BOX AND SEND BUTTON PARENT DIV CLOSING DIV*/}
             
           
        </div>
    )
}


export default ChatBody;