(function(){
	/*
	* Very basic databinding with an Appcelerator control.
	*/
	exports.bind = function(control, value, fieldName) {
		var self=control;
		if(!fieldName) {
			fieldName = "value";
		}
		function setValue(val) {
			if(typeof val === "undefined") {
				val = "";
			}
			self[fieldName] = val;
		}
		setValue(value);
		return function(input) {
			if(!input) {
				return self[fieldName];
			}
			setValue(value);
		};
	};
}());