const mongo = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");
const generateToken = require('./JWT');

const URL = "mongodb://localhost:27017";
const DBNAME = "JWT_Webapp";
const COLLECTION = "Users";

// UTILS

/**
* Update/Insert User with hashed password
* @param {string} username
* @param {string} password
*/
function makeUser(username,password) {
   mongo.connect(
      URL,
      {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      },
      (err, client) => {
         if (err) {
            console.error(err);
            return;
         }
         
         const db = client.db(DBNAME);
         const collection = db.collection(COLLECTION);
         
         // hash the password
         bcrypt.hash(password, 10, (err, hash) => {
            // store the hash in db
            try{
               collection.update({username:username}, {$set:{password:hash, token:'', status:'inactive'}},{upsert:true});
            } catch(err) {
               console.error(err);
            }
         });
      }
   );
};
   
/**
* save token
* @param {string} username 
* @param {string} token 
*/
function updateToken(username, token){
   mongo.connect(
      URL,
      {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      },
      (err, client) => {
         if (err){
            console.error(err);
            return;
         }
         
         const db = client.db(DBNAME);
         const collection = db.collection(COLLECTION);
         
         try{
            collection.update({username:username}, {$set: {token:token}},{upsert:false});
         } catch(err){
            console.error(err);
         }
         
         client.close();
      }
   );
}

/**
* authenticate user
* @param {string} username 
* @param {string} password 
*/
async function authenticateUser(username, password) {
   mongo.connect(
      URL,
      {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      },
      (err, client) => {
         if (err) {
            console.error(err);
            return;
         }
         const db = client.db(DBNAME);
         const collection = db.collection(COLLECTION);
         try{
            // get saved password
            const truePassword = await collection.findOne({username: username,password:password},{password:true}).password; 
            
            // compare passwords
            bcrypt.compare(password, truePassword, (err, res)=>{
               if(res){
                  // // generate token
                  // const token = generateToken(username);
                  // // save token
                  // saveToken(username, token);
                  res.redirect("/getToken");
               }else{
                  res.status(400);
               }
            })
            
            
         } catch(err) {
            console.error(err);
         }
         client.close();
         
      }
   );
}
      

   
/**
* authenticate token
*/
async function authenticateToken(username, token) {
   mongo.connect(
      URL,
      {
         useNewUrlParser: true,
         useUnifiedTopology: true,
      },
      (err, client) => {
         if (err) {
            console.error(err);
            return;
         }
         
         const db = client.db(DBNAME);
         const collection = db.collection(COLLECTION);
         
         try{
            const trueToken = await collection.findOne({username:username},{token:true}).token;

            bcrypt.compare(token,trueToken, (err, res)=>{
               if(res){
                  res.render("/home");
               } else{
                  res.status(400);
               }
            });
         } catch(err){
            console.error(err);
         }
         
         client.close();
      },
   );
}
            

module.exports = {
   authenticateUser: authenticateUser,
   authenticateToken: authenticateToken,
   updateToken: updateToken,
}