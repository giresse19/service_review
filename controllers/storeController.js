const mongoose = require('mongoose');
const Store  = mongoose.model('Store');
const multer = require('multer'); // used for file handling
const jimp = require('jimp'); // package for resizing image
const uuid = require('uuid'); // make the findings unique..that is the images should be unique

const multerOptions = {
  storage: multer.memoryStorage(), // mimetype tells the type of file
  fileFilter (req, file, next){
  	const isPhoto = file.mimetype.startsWith('image/');
  	if(isPhoto){
  	  next(null, true);
  	} else{
  		next({message: 'That filetype is not allowed!' }, false)
  	}
  }
};

exports.homePage=(req, res)=> {	
	res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', {title: 'Add Store'});
};

exports.upload = multer(multerOptions).single('photo'); // rase it in memory of server
exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) {
    next(); // skip to the next middleware
    return;
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now we resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  // once we have written the photo to our filesystem, keep going!
  next();
};

exports.createStore = async (req, res) => {
  req.body.author = req.user._id;  
	const store = await(new Store(req.body)).save();	 
	req.flash('success', `successfully created ${store.name} care to leave a review?`);
	res.redirect(`/store/${store.slug}`);	
};

exports.getStores = async (req, res) => {
	// query db for all stores
	const stores = await Store.find();
	// console.log(stores); // passing stores variable into stores.pug template
	res.render('stores', {title: 'Stores', stores: stores }); 
};

const confirmedOwner = (store, user) => {
  if(!store.author.equals(user._id)) {
    throw Error ('You must own a store inorder to edit it');
  }
};

exports.editStore = async (req, res) => {
	// find a store base on the id
	const store = await Store.findOne({ _id: req.params.id })
	// res.json(store);
	//  confirm they are the owner of the store
  confirmedOwner(store, req.user);
	// render out the edit form, so user can update
	res.render('editStore', { title: `Edit ${store.name}`, store: store });
};

exports.updateStore = async (req, res) => {
	// set the location data to be a point
	req.body.location.type = 'point';
	// find and update the store
	const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
	  new: true, // return new store instead of old one	  runValidators: true
	}).exec(); // we use exec just o ensure the new updated data is the one coming
	
	req.flash('success', `successfully Updated <strong>${store.name}</strong>, 
		<a href="/stores/${store.slug}"> View Store</a>`);
	res.redirect(`/stores/${store._id}/edit`);
	// redirect then the store, and tell them it worked
};

exports.getStoreBySlug = async (req, res) => {
  const store = await Store.findOne({slug: req.params.slug}).populate('author');
  if(!store) return next();
  res.render('store', {store: store, title: store.name });
};

exports.getStoresByTag = async (req, res) => {
  const tag = req.params.tag;
  const tagQuery = tag || {$exists: true};  
  const tagsPromise =  Store.getTagsList();
  const storesPromise = Store.find({ tags: tagQuery });
  const [tags, stores] = await Promise.all([tagsPromise, storesPromise]); //awaiting all the promises
  // const result = await Promise.all([tagsPromise, storesPromise]); //awaiting all the promises
  // var tags = result[0]; // from   ESC 6 we can just add it into result
  // var stores = result[1];   
  res.render('tag', { tags, title: 'Tags', tag, stores });

};


exports.searchStores = async (req, res) => {
  const stores = await Store.find({
    // find stores that match
    $text: {
      $search: req.query.q
    }
  }, {

    score: {$meta: 'textScore'}
  })
  // then sort them
    .sort({
      score:{ $meta: 'textScore'}
    })
    // limit to 5 results
  .limit(5);
  res.json(stores);
};