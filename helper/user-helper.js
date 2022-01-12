var db = require('../config/connection')
var collections = require('../config/collection')
var Promise = require('promise');
var objectId = require('mongodb').ObjectId
const nodemailer = require("nodemailer");
var bcrypt = require('bcrypt');
var cron = require('node-cron')

module.exports = {
    doLogin: (loginData) => {
        return new Promise(async (resolve, reject) => {

            let response = {}
            db.get().collection(collections.USER_COLLECTION).findOne({ username: loginData.username }).then((dataBaseUser) => {
                if (dataBaseUser === null) {
                    resolve({ status: false })
                }
                else {
                    bcrypt.compare(loginData.password, dataBaseUser.password).then((status) => {

                        if (status) {
                            response.user = dataBaseUser
                            response.status = true
                            resolve(response)

                        }
                        else {
                            resolve({ status: false })
                        }
                    })
                }
            })
        })
    },
    setCustomerData: (customerData) => {
        console.log('customer', customerData)
        date = new Date(customerData.date)
        let number = Number(customerData.mobile)
        customerData.date = date
        customerData.mobile = number
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CUSTOMERDATA_COLLECTIONS).insertOne(customerData).then((data) => {
                resolve(data)
            })
        })
    },
    getCustomerData: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CUSTOMERDATA_COLLECTIONS).find({}).toArray().then((data) => {
                resolve(data)
            })
        })
    },
    getBirthdayDate: () => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.CUSTOMERDATA_COLLECTIONS).find({
                "$expr": {
                    "$and": [
                        { "$eq": [{ "$dayOfMonth": "$date" }, { "$dayOfMonth": new Date() }] },
                        { "$eq": [{ "$month": "$date" }, { "$month": new Date() }] }
                    ]
                }
            }).toArray().then((data) => {
                resolve(data)
            })
        })
    },
    doBirthdayWish: (dataId) => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection(collections.CUSTOMERDATA_COLLECTIONS).findOne({ _id: objectId(dataId) })
            let email = data.email
            console.log('email', email)
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'bipinalex2014@gmail.com',
                    pass: 'totalvirus123'
                }
            });
            const mailOptions = {
                from: 'bipinalex2014@gmail.com', // sender address
                to: email, // list of receivers
                subject: 'test mail', // Subject line
                html: '<h1>Happy Birthday</h1>'// plain text body
            };
            // cron.schedule('* * * * *',()=>{
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err)
                        console.log(err)
                    else
                        console.log(info);
                    resolve(info)
                })
            // })
            


        })
    },
    createUser: (data) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collections.USER_COLLECTION).findOne({
                username: data.username
            }).then((result) => {
                console.log(result);
                if (result) {
                    resolve({ status: false, message: "Username already exist" });
                }
                else {
                    db.get().collection(collections.USER_COLLECTION).insertOne(data).then((result) => {
                        resolve({ status: true });
                    })
                }
            })
        })
    },
    getLogin: (data) => {
        // console.log(data);
        return new Promise((resolve, reject) => {
            db.get().collection(collections.USER_COLLECTION).findOne({ username: data.username }).then((user) => {
                if (!user) {
                    resolve({ status: false, msg: "Username does not exist" });
                }
                else {
                    bcrypt.compare(data.password, user.password).then((result) => {
                        if (result) {
                            resolve({ status: true });
                        }
                        else {
                            resolve({ status: false, msg: "Incorrect password" });
                        }
                    })
                }
            })
        })
    }

}