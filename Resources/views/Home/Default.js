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
		 
		var view = Ti.UI.createView();
		var label = Ti.UI.createLabel({
		    text : model.text,
		    top: "5%",
		    height : "5%"
		});
		var textField = Ti.UI.createTextField({
		    value : model.value,
		    top : "10%",
		    width: "50%",
		    height: "5%",
			backgroundColor: "#ffffff",
		    keyboardType:Ti.UI.KEYBOARD_DEFAULT,
		});
		var button = Ti.UI.createButton({
		    title : "Submit",
		    width: "50%",
		    height : "15%"
		});
		 
		// This will call DoStuff
		button.addEventListener("click", function(e) {
		    // Uses a specific route ('DS') we defined in app.js
		    self.action("DS", textField.value);
		});
		view.add(label);
		view.add(textField);
		view.add(button);
		 
		return view;
    };
}(Mvc.Views));