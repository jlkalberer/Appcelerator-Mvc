(function(v) {
	// Create the 'Accounts' object if it doesn't already exist
	if(!v.Accounts) {
		v.Accounts = {};
	}
	v.Accounts.Default = function(model) {
		var self = this;

		var view = Ti.UI.createView({
			backgroundColor : "#000"
		});

		// a button to add a new account
		var createButton = Ti.UI.createButton({
			title : "Create Account",
			top : 0,
			height: "10%"
		});

		createButton.addEventListener("click", function(e) {
			self.action("Create");
		});

		view.add(createButton);

		var accounts = model.accounts,
		data = [];
		for(var i = 0; i < accounts.length; i += 1) {
			data.push(Ti.UI.createTableViewRow({
				title : accounts[i].fullName(),
				// used to store data in the row so we can update later
				_id : accounts[i].id
			}));
		}

		// alert so you can choose to edit or delete
		var alertDialog = Ti.UI.createAlertDialog({
			buttonNames : ["Edit", "Delete", "Cancel"],
			cancel : 2
		});

		var table = Ti.UI.createTableView({
			data : data,
			top : "10%",
			height: "90%"
		});

		// click event for updating a row
		table.addEventListener("click", function(e) {
			// get the id of the Account from the row
			var id = e.row._id;
			alertDialog._id = id;
			alertDialog.show();
		});

		alertDialog.addEventListener("click", function(e) {
			// get the id from the alert box set in the table click event
			var id = e.source._id;
			if(e.index === 0) {
				self.action("Create", id);
			} else if(e.index === 1) {
				self.action("Delete", id);
				table.deleteRow(e.index);
			}
		});

		view.add(table);
		return view;
	};
}(Mvc.Views));