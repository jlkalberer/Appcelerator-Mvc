/*
 * A viewmodel which contains a collection of
 * AccountViewModels
 *
 * In this case we could return a collection of
 * AccountViewModels from the Accounts.Default action
 * and I usually end up needing to pass additional data
 */
exports = function () {
	return {
		accounts : []
	};
};