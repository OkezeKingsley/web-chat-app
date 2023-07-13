const userModel = require("../models/userModel")

const searchAllUsers = async (req, res) => {

  const search = req.body.searchInput;
  
  try {

    //This will find and return every registered user in our database.
    //The .find() helps us with that, the {} in the first argument means
    //we are in search of every document in a collection or database
    await userModel.find({name: {

      $regex: search

    }}).then((data) => {

      if (data) {
        console.log("n" + data)
        data.forEach((r) => {
         
          let resNameData = [];

          resNameData.push(r.name)

          console.log('t' + resNameData, typeof resNameData)
          res.json(resNameData)
        })
        
       // res.json(data)

      }

    }).catch((err) => {

      console.log(err)

    })
    
  } catch (err) {

    console.log('db err on getting all users: ' + err)
  }


}

module.exports = searchAllUsers;