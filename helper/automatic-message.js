var cron = require('node-cron');
var db = require('../config/connection')
var collections = require('../config/collection')
var Promise = require('promise');
const nodemailer = require("nodemailer");

module.exports.send =  () => {
    cron.schedule('0 0 0 * * *', () => {
        console.log('running a task every two minutes');
        return new Promise(async(resolve, reject) => {
            let birthdayDate = await db.get().collection(collections.CUSTOMERDATA_COLLECTIONS).find({
                "$expr": {
                    "$and": [
                        { "$eq": [{ "$dayOfMonth": "$date" }, { "$dayOfMonth": new Date() }] },
                        { "$eq": [{ "$month": "$date" }, { "$month": new Date() }] }
                    ]
                }
            }).toArray()
            
            // cron.schedule('*/2 * * * *',()=>{
                console.log("birthday",birthdayDate)
                for(i=0;i<=birthdayDate.length;i++){
                    // console.log("fffff",birthdayDate[i].email)
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'bipinalex2014@gmail.com',
                            pass: 'totalvirus123'
                        }
                    });
                    const mailOptions = {
                        from: 'bipinalex2014@gmail.com', // sender address
                        to: birthdayDate[i].email, // list of receivers
                        subject: 'test mail', // Subject line
                        html: '<h1>Happy Birthday</h1>'// plain text body
                    };
                
                    transporter.sendMail(mailOptions, function (err, info) {
                        if (err)
                            console.log(err)
                        else
                            console.log(info); 
                        resolve(info)
                    })
                }
            // })
        })
    });
}



// '*/ * * * *'      run cron on every minute

// cronTime: '00 */3 * * * * ' => Executes in every 3 seconds.

// cronTime: '* */1 * * * * ' => MEANING LESS. Executes every one second.

// cronTime: '00 */1 * * * * ' => Executes every 1 minute.

// cronTime: '00 30 11 * * 0-5 ' => Runs every weekday (Monday to Friday) @ 11.30 AM

// cronTime: '00 56 17 * * * ' => Will execute on every 5:56 PM