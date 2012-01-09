var joli = requires('/vendor/plugins/Mapper/joli');

// set up our database
requires('/config/initializers/mapper');

// run setup for all models
// Ti.include("/app/models/Accounts.js");
//var dfo = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory + 'app/models/');
//var files = dfo.getDirectoryListing();
// var re = new RegExp(/[A-Z](.*)Controller.js/);
//for(var i = 0, ii = files.length; i < ii; i++) {
	// if(re.test(files[i])) {
//		Ti.include('/app/models/' + files[i]);
	// }
//}


// models have been setup. initialize the database
joli.models.initialize();