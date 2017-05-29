const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
  name: {
  	type:String,
  	trim: true,
  	required: 'please enter store name'
  	},
  slug: String,
  description:{
  	type: String,
  	tyim: true
  },
  tags: [String]  
});

module.exports = mongoose.model('Store', storeSchema)