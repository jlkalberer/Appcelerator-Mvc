(function(controller) {
	// This will be the location for the 'Default' view
	Ti.include('/app/views/Home/Default.js');

	controller.HomeController = {
		Default : function(text, other) {
			var params = {};
			params.text = 'I am a label!';
			params.value = 'Home';

			// This returns a view and tells the framework to render the
			// 'Default' view using the model we created.
			return this.view('Default', params, {tabBarHidden: true, title: 'Home'});
		},
		// we could add another action here
		DoStuff : function (value) {
			// manipulate the value parameter and return the appropriate view
			return this.view('DoStuff', value + "!!!", {title: 'Details'});
		}
	};
}(Mvc.Controllers));