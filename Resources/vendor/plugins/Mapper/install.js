var dal = (function(app) {
	// if the dal has already been defined, return
	if(app.dal) {
		return;
	}

	// initialize the dal object and get a local reference
	var d = app.dal = {};

	return d;
}(Ti.App));

Ti.include('/vendor/plugins/Mapper/joli.js');
Ti.include('/vendor/plugins/Mapper/jsAutomapper.js');

// set up our database
Ti.include('/config/initializers/mapper.js');

// run setup for all models
// Ti.include("/app/models/Accounts.js");
var dfo = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory + 'app/models/');
var files = dfo.getDirectoryListing();
// var re = new RegExp(/[A-Z](.*)Controller.js/);
for(var i = 0, ii = files.length; i < ii; i++) {
	// if(re.test(files[i])) {
		Ti.include('/app/models/' + files[i]);
	// }
}


// models have been setup. initialize the database
joli.models.initialize();