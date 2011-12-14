/*
 * Basic Action showing how to use a model
 */
exports.Default = function(text, other) {
	var params = {};
	params.text = 'I am a label!';
	params.value = 'Home';

	// This returns a view and tells the framework to render the
	// 'Default' view using the model we created.
	return this.view('Default', params, {tabBarHidden: true, title: 'Home'});
};

/*
 * Action which shows how we manipulate a model which is passed in as a value
 */
exports.DoStuff = function (value) {
	// manipulate the value parameter and return the appropriate view
	return this.view('DoStuff', value + "!!!", {title: 'Details'});
};