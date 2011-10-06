// This will be the location for the 'Default' view
Ti.include('/views/Home/Default.js');
// another view
Ti.include('/views/Home/DoStuff.js');

(function(c) {
	function DefaultModel() {
	    return {
	        text : null,
	        value : 0
	    };
	}
    c.HomeController = {
        Default : function(text, other) {
		    // Create the model and populate it with some values
		    var model = DefaultModel();
		    model.text = text;
		    model.value = text;
		 
		    // This returns a view and tells the framework to render the
		    // 'Default' view using the model we created.
		    return this.view('Default', model);
		},
		// we could add another action here
		DoStuff : function (value) {
		    // manipulate the value parameter and return the appropriate view
		    return this.view('DoStuff', value + "!!!");
		}
    };
}(Mvc.Controllers));