(function(v) {
		// Create the 'Accounts' object if it doesn't already exist
	if(!v.Accounts) {
		v.Accounts = {};
	}
	Ti.include("/lib/utils.js");

	/*
	 * Render the Create page
	 */
	v.Accounts.Create = function(model) {
		var self = this;

		var view = Ti.UI.createView({
			backgroundColor : "#777777",
			height: "100%"
		});

		var fnLabel = Ti.UI.createLabel({
			text : "First Name",
			top: "5%",
			height : "5%"
		});
		var fnTextField = Ti.UI.createTextField({
			width:'50%', 
			top : "10%", 
			height:"5%", 
			backgroundColor: "#ffffff",
		    keyboardType:Ti.UI.KEYBOARD_DEFAULT,
		});
		model.firstName = utils.bind(fnTextField, model.firstName); // bind the textfield to the view model

		var lnLabel = Ti.UI.createLabel({
			text : "Last Name",
			top : "20%",
			height : "5%"
		});
		var lnTextField = Ti.UI.createTextField({
			width:'50%', 
			top : "25%", 
			height:"5%", 
			backgroundColor: "#ffffff",
		    keyboardType:Ti.UI.KEYBOARD_DEFAULT,
		});
		model.lastName = utils.bind(lnTextField, model.lastName); // bind the textfield to the view model

		var emailLabel = Ti.UI.createLabel({
			text : "Email",
			top : "35%",
			height : "5%"
		});
		var emailTextField = Ti.UI.createTextField({
			width:'50%', 
			top : "40%", 
			height:"5%", 
			backgroundColor: "#ffffff",
		    keyboardType:Ti.UI.KEYBOARD_DEFAULT,
		});
		model.email = utils.bind(emailTextField, model.email); // bind the textfield to the view model

		var submit = Ti.UI.createButton({top : "50%", height: "10%"});

		if(model.id) {
			submit.title = "Update";
		} else {
			submit.title = "Create";
		}

		submit.addEventListener("click", function() {
			self.action("CreateFinish", model);
			self.action("Accounts"); // /!\ Delete this line
		});

		view.add(fnLabel);
		view.add(fnTextField);
		view.add(lnLabel);
		view.add(lnTextField);
		view.add(emailLabel);
		view.add(emailTextField);

		view.add(submit);

		return view;
	};
}(Mvc.Views));