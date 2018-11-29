const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuidv4 = require("uuid/v4");
const bcrypt = require("bcrypt");
const saltRounds = 16;
// if you get this error for bcrypt -> dyld: lazy symbol binding failed:
// DO THIS: npm rebuild bcrypt --build-from-source

module.exports = {
    getUserById: async function(id) {
        // error check
        if (!id) throw "Error: must provide an id";
        if (typeof id !== "object") throw "Error: id must be an ObjectID";

        // get collection and find
        const userCollection = await users();
        const foundUser = await userCollection.findOne({
            _id: id
        });

        // make sure you actually found something
        if (!foundUser) throw "Error: user not found";
        return foundUser; 
    },
    getUserByUsername: async function(username) {
        // error check
        if (!username) throw "Error: must provide a username";
        if (typeof username !== "string") throw "Error: username must be a string";

        // get collection and find
        const userCollection = await users();
        const foundUser = await userCollection.findOne({
            username: username
        });

        // make sure you actually found something
        if (!foundUser) throw "Error: user not found";
        return foundUser; 
    },
    getUserByEmail: async function(email) {
        // error check
        if (!email) throw "Error: must provide a email";
        if (typeof email !== "string") throw "Error: email must be a string";

        // get collection and find
        const userCollection = await users();
        const foundUser = await userCollection.findOne({
            email: email
        });

        // make sure you actually found something
        if (!foundUser) throw "Error: user not found";
        return foundUser; 
    },
    getUserBySessionID: async function(sessionID) {
        // error check
        if (!sessionID) throw "Error: must provide a sessionID";
        if (typeof sessionID !== "string") throw "Error: sessionID must be a string";

        // get collection and find
        const userCollection = await users();
        const foundUser = await userCollection.findOne({
            sessionID: sessionID
        });

        // make sure you actually found something
        if (!foundUser) throw "Error: user not found";
        return foundUser; 
    },
    addUser: async function(username, password, email) {
        // error check
        if (!username) throw "Error: Missing username";
        if (!password) throw "Error: Missing password";
        if (!email) throw "Error: Missing email";
        if (typeof(username) !== "string") throw "Error: username must be a string";
        if (typeof(password) !== "string") throw "Error: password must be a string";
        if (typeof(email) !== "string") throw "Error: email must be a string";

        const userCollection = await users();

        let usernameUser = undefined;
        try {
            usernameUser = await this.getUserByUsername(username);
        } catch (e) {
            //no op
        }

        let emailUser = undefined;
        try {
            emailUser = await this.getUserByEmail(email);
        } catch (e) {
            //no op
        }

        if (usernameUser !== undefined) {
            throw "Username already exists"
        }
        if (emailUser !== undefined) {
            throw "Email already exists"
        }

        //TODO: Check if a user with that email/username already exists
        let newUser = {
            username: username,
            email: email,
            password: await bcrypt.hash(password, saltRounds),
            sessionID: uuidv4(),
            savedEvents: [],
            sharedEvents: []
        }

        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw "Error: could not insert user";

        return await this.getUserById(insertInfo.insertedId);
    },
    setUserSession: async function(id, sessionID) {
        // error check
        if (!id) throw "Error: must provide an id";
        if (typeof id !== "object") throw "Error: id must be an ObjectID";
        if (!sessionID) throw "Error must provide a sessionID";
        if (typeof(sessionID) !== "string") throw "Error sessionID must be a string"

        // make sure the recipe is in the collection before updating
        await this.getUserById(id);

        // mark what we are updating
        let userUpdateInfo = {
            sessionID: sessionID
        };

        // get collection, update, and return
        const userCollection = await users();
        await userCollection.updateOne({
            _id: id
        }, {
            $set: userUpdateInfo
        });

        return await this.getUserById(id);
    },
    clearUserSession: async function(sessionID) {
        // error check
        if (!sessionID) throw "Error must provide a sessionID";
        if (typeof(sessionID) !== "string") throw "Error sessionID must be a string"

        await this.getUserBySessionID(sessionID);

        // mark what we are updating
        let userUpdateInfo = {
            sessionID: undefined
        };

        // get collection, update, and return
        const userCollection = await users();
        await userCollection.updateOne({
            sessionID: sessionID
        }, {
            $set: userUpdateInfo
        });

        return true;
    },
    removeUser: async function(id) {
        // error check
        if (!id) throw "Error: must provide an id";
        if (typeof id !== "object") throw "Error: id must be an ObjectID";

        // get collection
        const userCollection = await users();

        // delete and return
        const deletionInfo = await userCollection.removeOne({
            _id: id
        });

        if (deletionInfo.deletedCount === 0) throw `Error: could not remove user with id ${id}`;

        return true;
    }
}