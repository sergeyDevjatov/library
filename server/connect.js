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

    userSchema = mongoose.Schema({
        login: String, password: String, salt: String
    });

    authorSchema = mongoose.Schema({
        name: String, born: Date, dead: Date
    });

    genreSchema = mongoose.Schema({
        name: String
    });

    bookSchema = mongoose.Schema({
        title: String, author: authorSchema, genre: genreSchema
    });

    return {
        User: mongoose.model('User', userSchema),
        Author: mongoose.model('Author', authorSchema),
        Genre: mongoose.model('Genre', genreSchema),
        Book: mongoose.model('Book', bookSchema),
        close: mongoose.connection.close
    };
};

