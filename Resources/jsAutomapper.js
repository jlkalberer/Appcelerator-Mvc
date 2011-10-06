var automapper = (function (app) {
	if(app.automapper) {
		return app.automapper;
	}
	
	var dictionary = {};
	
	app.automapper = {
		createMap : function (sourceKey, destinationKey) {
			var combinedKey = sourceKey + destinationKey, functions;
			dictionary[combinedKey] = {};
			
			functions = {
				forMember : function (key, e) {
					dictionary[combinedKey][key] = e;
					return functions;
				}, 
				forAllMembers : function(func) {
					dictionary[combinedKey].__forAllMembers = func;
					return functions;
				}
			};
			return functions;
		},
		map : function (sourceKey, destinationKey, sourceValue, destinationValue, lazy) {
			if(!sourceValue && sourceValue !== false) {
				return;
			}
						
			function getValue(item) {
				if(typeof item === "function" && !lazy) {
					return item();
				}
				return item;
			}
			var combinedKey = sourceKey + destinationKey;
			var mappings = dictionary[combinedKey], output, key,
				    extensions = {
						ignore : function () {
							// don't do anything
						},
						mapFrom : function (sourceMemberKey) {
							if (!this.__sourceValue.hasOwnProperty(sourceMemberKey)) {
								throw sourceKey + "." + sourceMemberKey + " has not been defined.";
							}
							var value = getValue(this.__sourceValue[sourceMemberKey]);
							if(mappings.__forAllMembers) {
								mappings.__forAllMembers(this.__destinationValue, this.__key, value);
							} else {
								this.__destinationValue[this.__key] = value;
							}
						}
					};
			
			if(!mappings) {
				throw "Could not find mapping with a source of " + sourceKey + " and a destination of " + destinationKey;
			}
			
			function mapItem(destinationValue, sourceValue) {
				for (key in destinationValue) {
					if (!destinationValue.hasOwnProperty(key)) {
						continue;
					}			
						
					if (mappings.hasOwnProperty(key) && mappings[key]) {	
						if (typeof mappings[key] === "function") {
							extensions.__key = key;
							extensions.__sourceValue = sourceValue;
							extensions.__destinationValue = destinationValue;
							
							output = mappings[key].call(extensions);
						} else {  // forMember second parameter was not a function
							output = mappings[key];
						}
						// object was returned from the 'forMember' call
						if (output) {
							var value = getValue(output);
							if(mappings.__forAllMembers) {
								mappings.__forAllMembers(destinationValue, key, value);
							} else {
								destinationValue[key] = value;
							}
						}
					}
					else if (!sourceValue.hasOwnProperty(key)) {
						throw sourceKey + "." + key + " has not been defined.";
					} else {
						var value = getValue(sourceValue[key]);
						if(mappings.__forAllMembers) {
							mappings.__forAllMembers(destinationValue, key, value);
						} else {
							destinationValue[key] = value;
						}
					}
				}
			}
			
			// actually do the mapping here
			if(sourceValue instanceof Array) {
				if(destinationValue instanceof Array) {
					// loop
					for(var i = 0; i < sourceValue.length; i += 1) {
						if(!destinationValue[i]) {
							if(typeof destinationKey !== "function") {
								throw "destinationKey of mapping must be a function in order to initialize the array";
							}
							destinationValue[i] = destinationKey();
						}
						mapItem(destinationValue[i], sourceValue[i]);
					}
				} else {
					throw "Cannot map array to object";
				}
			}
			else if(destinationValue instanceof Array) {
				throw "Cannot map object to array";
			} else {
				mapItem(destinationValue, sourceValue);
			}
		}
	};
	
	return app.automapper;
}(this));