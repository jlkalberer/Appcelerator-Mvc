var dal = Ti.App.dal;

// dal has not been initialized or accounts have already been initailized
if(!dal) {
	exports = Ti.App.dal = dal = {};
}
if(!dal.accounts) {
	dal.accounts = new joli.model({
		table : 'Accounts',
		columns : {
			id : 'INTEGER PRIMARY KEY AUTOINCREMENT',
			firstName : 'TEXT',
			lastName : 'TEXT',
			email : 'TEXT',
		}
	});
	// automapper mappings for this model
	
	// include view models - models can be mapped to multiple view models
	var automapper = require("/vendor/")
	var AccountViewModel = require("/lib/Accounts/AccountViewModel");
	
	// This maps an Account to an AccountViewModel -- I pass in the destination key
	// as a function so automapper can use it to create viewmodels
	automapper.createMap("Account", AccountViewModel)
		// we don't actually need the 'firstName' since the column name matches the view model name 1-to-1
		// I just include it as an example
		.forMember("firstName", function() { return this.mapFrom("firstName") })
		// ignore this field since we already have it implemented
		.forMember("fullName", function() { return this.ignore(); });
	
	// model maps 1-to-1 -- we don't need to set up any members
	automapper.createMap("Account", "CreateAccountViewModel");
	
	// This maps an AccountViewModel to an Account
	automapper.createMap("CreateAccountViewModel", "Account")
		/*
		* forAllMembers is run for every mapping
		* dest - the destination object
		* prop - the property name to set
		* value - the value from the source
		*/
		.forAllMembers(function(dest, prop, value) {
			// tell joli to properly set the values
			dest.set(prop, value);
		})
		// ignore joli internal properties
		.forMember("_data", function() { this.ignore(); })
		.forMember("_metadata", function() { this.ignore(); })
		.forMember("_options", function() { this.ignore(); })
		.forMember("_originalData", function() { this.ignore(); })
		.forMember("isNew", function() { this.ignore(); });
}