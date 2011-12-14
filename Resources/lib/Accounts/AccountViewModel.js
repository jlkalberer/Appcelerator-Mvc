/*
 * Simple Account model used for displaying Accounts in a list
 */
exports = function () {
	return {
		id : null,
		firstName : null,
		lastName : null,
		fullName : function() {
			return this.firstName + " " + this.lastName;
		}
	};
};