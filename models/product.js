const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    date_added: {
        "type": Date,
        "default": Date.now
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    description: String,
    imageUrl: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

//model name will be used to turn into collection name
//'Product' -> lower case 'product' + 's'
module.exports = mongoose.model('Product', productSchema);