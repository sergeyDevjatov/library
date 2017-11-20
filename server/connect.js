module.exports = function () {
    const mongoose = require('mongoose');
    const login = 'root',
        password = 'yUxULlfXhwk1ijkM';

    const mongo_url = `mongodb://${login}:${password}@mongocluster-shard-00-00-atksi.mongodb.net:27017,
                   mongocluster-shard-00-01-atksi.mongodb.net:27017,
                   mongocluster-shard-00-02-atksi.mongodb.net:27017
                   /test?ssl=true&replicaSet=MongoCluster-shard-0&authSource=admin`;

    mongoose.connect(mongo_url, {useMongoClient: true});

    mongoose.Promise = global.Promise;

    return {
        User: mongoose.model('User', mongoose.Schema({
            login: String, password: String, salt: String
        })),
        close: mongoose.connection.close
    };
};

