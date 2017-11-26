module.exports = function () {
    const mongoose = require('mongoose');
    const _ = require('underscore');
    const dateFormat = require('./dateformat-ru.js');
    const dayMonthYearDateFormat = _.partial(dateFormat, _, "d mmmm yyyy года");
    const login = 'root',
        password = 'yUxULlfXhwk1ijkM';

    const mongo_url = `mongodb://${login}:${password}@mongocluster-shard-00-00-atksi.mongodb.net:27017,
                   mongocluster-shard-00-01-atksi.mongodb.net:27017,
                   mongocluster-shard-00-02-atksi.mongodb.net:27017
                   /test?ssl=true&replicaSet=MongoCluster-shard-0&authSource=admin`;



    mongoose.connect(mongo_url, {useMongoClient: true});

    mongoose.Promise = global.Promise;

    userSchema = mongoose.Schema({
        login: String, password: String, salt: String, orders: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }]
    });

    authorSchema = mongoose.Schema({
        name: String, born: Date, dead: Date
    });

    authorSchema.virtual('bornFormatted').get(function (){ return dayMonthYearDateFormat(this.born); });

    authorSchema.virtual('deadFormatted').get(function (){ return dayMonthYearDateFormat(this.dead); });

    genreSchema = mongoose.Schema({
        name: String
    });

    bookSchema = mongoose.Schema({
        title: String, author: authorSchema, genre: genreSchema, order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order'
        }
    });

    orderSchema = mongoose.Schema({
        receivingDate: {
            type: Date,
            default: Date.now
        },
        returningDate: Date,
        user: String,
        book: bookSchema
    });

    orderSchema.virtual('receivingDateFormatted').get(function (){ return dayMonthYearDateFormat(this.receivingDate); });

    orderSchema.virtual('returningDateFormatted').get(function (){ return dayMonthYearDateFormat(this.returningDate); });

    orderSchema.methods.isOrderFor = function(userLogin){
        return this.user === userLogin;
    };

    return {
        User: mongoose.model('User', userSchema),
        Author: mongoose.model('Author', authorSchema),
        Genre: mongoose.model('Genre', genreSchema),
        Book: mongoose.model('Book', bookSchema),
        Order: mongoose.model('Order', orderSchema),
        close: mongoose.connection.close
    };
};

