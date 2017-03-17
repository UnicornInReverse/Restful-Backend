var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var albumModel = new Schema({
   title: {
       type: String
   },
    artist: {
        type: String
    },
    tracks: {
        type: String
    },
    year: {
        type: String
    }
    // favourite: {
    //     type: Boolean, default: false
    // }
});

module.exports = mongoose.model('Album', albumModel);