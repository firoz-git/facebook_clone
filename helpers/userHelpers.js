var db = require("../config/connection");
const bcrypt = require("bcrypt")
var objId = require("mongodb").ObjectID;
var collection = require('../config/collections');
const { response } = require("../app");





module.exports = {
    signUp: (signupData) => {
        return new Promise(async (resolve, reject) => {
            signupData.password = await bcrypt.hash(signupData.password, 10);
            db.get()
                .collection(collection.USER_COLLECTION)
                .insertOne(signupData)
                .then((response) => {
                    resolve(response);
                });
        });
    },
    loginCheck: (loginData) => {
        return new Promise(async (resolve, reject) => {
            // console.log(loginData)
            let response = {};
            let user = await db
                .get()
                .collection(collection.USER_COLLECTION)
                .findOne({ email: loginData.email });
            // console.log(user);
            if (user) {
                bcrypt.compare(loginData.password, user.password).then((status) => {
                    if (status) {
                        response.user = user;
                        response.status = true;
                        resolve(response);
                    } else {
                        resolve({ status: false });
                    }
                });
            } else {
                console.log("login failed");
                resolve({ status: false });
            }
        });
    },

    getFriends: (sessionId) => {
        return new Promise(async (resolve, reject) => {
            let friends = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(friends)

        });
    },
    makeFriends: (friendId, ownId) => {
        return new Promise(async (resolve, reject) => {
            let person = objId(friendId)

            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: objId(ownId) })
            if (user) {
                db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objId(ownId) }, { $push: { friends: { frnd: person } } }).then(() => {
                    resolve({ status: true })
                })
            }
        });
    },
    deleteFriends: (friendId, ownId) => {
        console.log('unfriend working')
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: objId(ownId) })
            if (user) {
                db.get().collection(collection.USER_COLLECTION).updateOne({ _id: objId(ownId) }, { $pull: { friends: { frnd: objId(friendId) } } }).then(() => {
                    resolve({ status: true })
                })
            }
        });
    },

    addpost: (data, user) => {
        console.log(data,user)
        return new Promise(async (resolve, reject) => {
            let post = {
                id: new objId,
                data: data.description
            }
            db.get().collection(collection.USER_COLLECTION).updateOne({ id: objId(user) }, { $push: { posts: post } }).then((response) => {
                resolve(response)
            })
        });
    }

}