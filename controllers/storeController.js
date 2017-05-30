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

exports.editStore = async (req, res) => {
	// find a store base on the id
	const store = await Store.findOne({ _id: req.params.id })
	// res.json(store);
	//  TODO confirm they are the owner of the store

	// render out the edit form, so user can update
	res.render('editStore', { title: `Edit ${store.name}`, store: store });
};

exports.updateStore = async (req, res) => {
	// find and update the store
	const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
	  new: true, // return new store instead of old one	  runValidators: true
	}).exec(); // we use exec just o ensure the new updated data is the one coming
	
	req.flash('success', `successfully Updated <strong>${store.name}</strong>, 
		<a href="/stores/${store.slug}"> View Store</a>`);
	res.redirect(`/stores/${store._id}/edit`);
	// redirect then the store, and tell them it worked
};

