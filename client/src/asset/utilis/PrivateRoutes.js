import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {

    let isAuthenticated = JSON.parse(sessionStorage.getItem("username"));

console.log(isAuthenticated)
    return(
        //THIS CHECKS IF THE VARIABLE CONTSINS ANY VALUE. IF NO, WHEN ANYONE TRY TO
        //GO TO A ROITE WITHOUT LOGGING IN FIRST, THEY GET REDIRECTED TO THE LOGIN PAGE
        //IF THEY ARE LOGGED IN ALREADY, THEN WHEN THEY TRY TO DIRECTLY ROUTE TO A PAGE
        //USING THE BROWSER'S URL, IT WILL WORK JUST FINE.
        isAuthenticated === null || isAuthenticated === "undefined" ? <Navigate to="/"/> || <Navigate to="/signup"/> : <Outlet/>
    )

}

export default PrivateRoutes;