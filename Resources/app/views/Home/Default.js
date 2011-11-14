(function(v) {
	// Create the 'Home' object if it doesn't already exist
	if(!v.Home) {
		v.Home = {};
	}

	/*
	* Render the default page
	*/
	v.Home.Default = function(model) {
		// get a reference to the view
		var self = this;

		var view = View({className: 'HomeView'});
		var label = Label({className: 'HomeLabel', text: model.text});
		var textField = TextField({className: 'HomeTextField', value: model.value});
		var button = Button({className: 'HomeButton', title: 'Submit'});

		// This will call DoStuff
		$(button).click(function() {
			// Uses a specific route ('DS') we defined in app.js
			self.action("DS", textField.value);
		});

		view.add(label);
		view.add(textField);
		view.add(button);
		return view;
	};
}(Mvc.Views));