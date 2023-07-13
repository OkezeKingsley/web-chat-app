//This Context api is for passing around the name of the user that succefully login - throughout our application
//we're going to be needing this in other to get all information that's unique to the particular user when requesting
//for stuffs relating to the user from the backend.

import { createContext } from "react";

export const LoggedInNameContext = createContext(null)