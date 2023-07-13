const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')


//SIGN UP ROUTE FUNCTION
const signUp = async (req, res) => {
  
  //The req.body will hold all value we're getting from the frontend
  //which is name, email, password & user's unique id. So, doing {name, email, password, user_id}
  //means you're distructuring everything stored in the req.body
  const {name, email, password, user_id} = req.body;
 
  //This verifies if the form is completely filled
  if(name < 1 || email.length < 1 || password.length < 1 ) {
      console.log('please verify you provide all detail required')
  }

  if(!email.includes('@')){

    console.log('please provide a valid email')

  }
  
  //Now let's hash the users password so that it would be hard to know
  //in any case our database gets exposed to any unauthoriesed person
  //this will take some time to do, so let's put it in an Sync with
  //the genSalt, so together, they both be genSaltSync

  const saltRounds = 10;

  const salt = bcrypt.genSaltSync(saltRounds)
  const hashedPassword = bcrypt.hashSync(password, salt)
  
  //to compare hashed password
  //bcrypt.compareSync(loginPass, hashedPassword)



  //Now let's sign user up...  

 try {

  //The below will check if user and the email is already existed in the database  
  //before signing them up or creating an account for them. so in this case,
  //we are using the name or the email user provide to verify...
  //the findOne() method will go through the database and find the information
  //given by the user (in this case: name and email) if any of them exist, 
  //it will return true and if none of the exist, it will return false...
  //the boolean value for each will the be stored in the checkName and checkEmail variable. 
  //from there, we'd use the if statement that follows it to complete the rest operation.

    const checkName = await userModel.findOne({name})

    if (checkName) {
      
     return console.log('Username already taken')
  
    } 
    
    const checkEmail = await userModel.findOne({email})

    if(checkEmail){

      return console.log('email already used')
    }
    
    else { 

      //equating the password object to be the new hashed password
      const newUser = new userModel({ name, email, password: hashedPassword, user_id });

      newUser.save().then( () => {
  
      console.log('user created')  
      
      return res.json({result: 'successful signup'})
      
       
      } ).catch( (err) => {

      console.log(err)  

      return res.json("err while signup: " + err)
  
      })

     }
      

    } catch (error) {

        console.log("The try catch block error is: " + error)

        return res.json("couldn't connect to the database: " + error)

    }
 
    
}







module.exports = signUp