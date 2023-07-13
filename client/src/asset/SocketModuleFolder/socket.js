//Here we're declaring our socket client connection in this special 
//module and then importing it to which ever component that need 
//it.

import io from 'socket.io-client';

const socket = io.connect("http://localhost:4000"); //making a connection to the server

export default socket;
