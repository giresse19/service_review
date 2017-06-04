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
  description: {
  	type: String,
  	trim: true
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number,
      required: 'You must supply coordinates!'
    }],
    address: {
      type: String,
      required: 'You must supply an address!'
    }
  },
  photo: String,
  author:{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  }
});
// define our indexes
storeSchema.index({
  name: 'text',
  description: 'text'
});

storeSchema.pre('save', async function(next) {
  if (!this.isModified('name')) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.name);
   // find other stores that have a slug of wes, wes-1, wes-2
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const storesWithSlug = await this.constructor.find({slug: slugRegEx});
  if(storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }
  next();
  // TODO make more resiliant so slugs are unique
});
// adding method to store schema for easy manipulation with data in database
storeSchema.statics.getTagsList = function() {
  // using aggregate which is like findbyid, and has many operators.. on docs.. and start with dollar sign
  return this.aggregate([
    {$unwind: '$tags'}, // creating instance of various tags in the stores
    {$group: {_id: '$tags', count: {$sum: 1}}}, // group items base on tags while summing it self
    {$sort: { count: -1 }}
  ]); 
}; 

module.exports = mongoose.model('Store', storeSchema);