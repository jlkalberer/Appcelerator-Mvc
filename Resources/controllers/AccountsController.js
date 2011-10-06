(function(c) {
	// include the views
	Ti.include("/views/Accounts/Default.js");
	Ti.include("/views/Accounts/Create.js");

	c.AccountsController = {
		/*
		 * Default action which simply shows a list of Accounts
		 */
		Default : function() {
			// use the dal as a repository to grab all accounts
			var accounts = dal.accounts.all();
	
			var model = AccountsViewModel();
	
			// automapper knows to map the two collections
			automapper.map("Account", AccountViewModel, accounts, model.accounts);
	
			// return the model and render the view
			return this.view("Default", model);
		},
		/*
		 * Basic create/update operation for a new Account
		 */
		Create : function(id) {
			var model = CreateAccountViewModel();
	
			if(id) {
				automapper.map("Account", "CreateAccountViewModel", dal.accounts.findOneById(id), model)
			}
	
			return this.view("Create", model);
		},
		/*
		 * Finishes up the creation/update process by inserting the object into the database
		 */
		CreateFinish : function(model) {
			var account;
			if(!model.id) {
				account = dal.accounts.newRecord();
			} else {
				account = dal.accounts.findOneById(model.id);
			}
			automapper.map("CreateAccountViewModel", "Account", model, account);
			account.save();
		},
		/*
		 * Delete an Account based on an id
		 */
		Delete : function(id) {
			dal.accounts.deleteRecords(id);
		}
	};
}(Mvc.Controllers));