const mysql = require('mysql');
const fs = require('fs');
const { connect } = require('http2');

let instance = null;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    //password: 'test123',
    //database: 'maindatabase'
});
//read the sql initialization file
let init_ = [];
fs.readFile('sql/sqlInitializationQueris.sql', 'utf-8', function(err, result){
    if(err)console.log(err);//handle error
    init_ = result.split(';');

    startInitialization();
});
let startInitialization = function(){
    let dbName = init_[0].split(' ')[2];
    let error = false;

    connection.connect(function(err) {
    if (err){
        console.log(err);   
    }
    else{
        console.log("Connected to mysql!");
        connection.query(init_[0]+';', function(err, result){
            if(err){
                if(err.code = 'ER_DB_CREATE_EXISTS'){
                    console.log('\''+dbName+'\' database already exists!');
                    connection.query(init_[1]+';', function(err, result){
                        if(err){
                            error = true;
                        }
                    });
                }
                else{
                    console.log('Syntax error whilst creation of the database!');
                }
            }
            else{
                for(let i = 1; i<init_.length-1; i++){
                    connection.query(init_[i]+';', function(err, result){
                        if(err){
                            error = true;
                            console.log(err);
                        }
                    });
                }
            }
            if(!error)console.log('Successfully connected to\''+dbName+'\' database!');
            else console.log('Something went wrong whilst creation of database: \''+dbName+'\'!');
        });
        
    }
  });
}
class DbService{
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }

    async getAllData(qry){
        try {
            const response = await new Promise((resolve, reject) =>{
                connection.query(qry, (err, results) =>{
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = DbService;