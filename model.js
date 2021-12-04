const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Todo = new Schema({
    description: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    },
});


// creating a model called TODO based on Todo
module.exports = mongoose.model('TODO', Todo);

// With this code in place we’re now ready to access the MongoDB database by using the Todo schema.