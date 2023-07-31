const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DB on line')
    } catch (error) {
        console.log(error);
        throw new Error('error al conectar');
    }


}

module.exports = {
    dbConnection
};