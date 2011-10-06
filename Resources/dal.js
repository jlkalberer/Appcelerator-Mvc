var dal = (function(app) {
	// if the dal has already been defined, return
	if(app.dal) {
		return;
	}

	// initialize the dal object and get a local reference
	var d = app.dal = {};

	return d;
}(Ti.App));

Ti.include("/joli.js");
Ti.include("/jsAutomapper.js");

// set up our database
joli.connection = new joli.Connection('SampleDatabase');

// run setup for all models
Ti.include("/models/Accounts.js");

// models have been setup. initialize the database
joli.models.initialize();
