const MongoClient = require("mongodb").MongoClient;
const settings = {
    mongoConfig: {
        serverUrl: "mongodb://josh:event_finder1@ds237700.mlab.com:37700/event_finder",
        // database: "event_finder"
    }
};
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
    if (!_connection) {
        _connection = await MongoClient.connect(mongoConfig.serverUrl, {
            useNewUrlParser: true
        });
        _db = await _connection.db(mongoConfig.database);
    }

    return _db;
};