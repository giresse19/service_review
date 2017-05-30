const mongoose = require('mongoose');
const Store  = mongoose.model('Store');
exports.homePage=(req, res)=> {	
	res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', {title: 'Add Store'});
};

exports.createStore = async (req, res) => {
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

