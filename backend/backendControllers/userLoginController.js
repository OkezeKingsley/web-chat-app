const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')

//LOGIN ROUTE FUNCTION

const login = async (req, res) => {

    const { name, password } = req.body;
   
    if(!name || !password){
  
      console.log('please complete your login detail');
  
    }

    if (name && password) {  

      try { 

        //We would be checking if the email the user is using to login exists
        //if true, the check variable will return true and the data for that
        //document will be stored there...
        const check = await userModel.findOne({name})

        if (check) {

          console.log('username exist');

        }

        //Here, we're comparing the password the user input to the registered
        //password that was hashed for the email the user provide..
        //This is to check if the user is who they say they are...
        //The confirmPassword variable will return true if it's true.
        const confirmPassword = bcrypt.compareSync(password, check.password);

        //Here, we'd be checking if the check & confirmPassword are both true
        //and if they are both true, we'd return the user's user_id so as to assign
        //their unique account to them.
        if (check && confirmPassword) {

          //Here we storing the user_id which is the check.user_id inside an object 
          //property we created called result
          return res.json ( {result: check.name} )
            
        } else {
          //Here we storing the user_id which is the check.user_id inside an object 
          //property we created called error
          return res.json ({error: 'ERR'})

        }

      } catch (err) {

          console.log('db connection err on user logging in: ' + err)

          res.json('login try catch err: ' + err)
      }
  

    }//if name && password closing block


 
}


  
  
  
module.exports = login;
  
  
  
  
  
  
  
  
  
  