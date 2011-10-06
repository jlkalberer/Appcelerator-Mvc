var Mvc = (function ($) {

	if($.mvc) {
		return $.mvc; // do not reinitialize
	}

	var getRouteCollection;

	function extend() {
		var destination = arguments[0], source;
		for(var i = 1; i < arguments.length; i += 1) {
			source = arguments[i];
			for (var property in source) {
				if (typeof source[property] === "object" &&
				source[property] !== null ) {
					destination[property] = destination[property] || {};
					arguments.callee(destination[property], source[property]);
				} else if(destination && source[property]) {
					destination[property] = source[property];
				}
			}
		}
		return destination;
	}

	function isEmptyObject(obj) {
		for(var prop in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, prop)) {
				return false;
			}
		}
		return true;
	}

	// via jsRouter with some modifications -- http://jsrouter.codeplex.com/
	function buildRegExp(route) {
		// converts the route format into a regular expression that would match matching paths
		var pathSegments = route.path.replace(/[\/\.]+$/, '').split(/\/|\./),
		defaults = route.defaults;

		var regexp = ['^'];
		for (var i = 0, segment, match; (segment = pathSegments[i]) !== undefined; i++) {
			if ((match = /{(\w+)}/.exec(segment)) != null) {
				var argName = match[1];

				// add a backslash, except for the first segment
				regexp.push((i > 0 ? '(\/' : '') + '([^\/]+)' + (i > 0 ? ')' : ''));

				if (defaults && defaults[argName] !== undefined) {
					// make the group optional if the parameter has a default value
					regexp.push('?');
				}
			}
			else {
				regexp.push((i > 0 ? '/' : '') + segment);
			}
		}
		regexp.push('$');

		return new RegExp(regexp.join(''), 'i');
	}

	function parsePath(path, route) {
		// parses the values in the hash into an object with the keys the values specified in the given route
		var values = extend({}, route.defaults),
		pathSegments = path.split(/\/|\./);

		for (var i = 0, segment, match; i < pathSegments.length && (segment = route.segments[i]); i++) {
			if ((match = /{(\w+)}/.exec(segment)) != null) {
				if (pathSegments[i] == '' && values[match[1]]) {
					continue; // skip empty values when the value is already set to a default value
				}
				values[match[1]] = pathSegments[i];
			}
		}
		return values;
	}

	// The base controller -- all controllers under Mvc.Controllers will get these properties
	function Controller(name) {
		return {
			name : name,
			view : function(action, model, winSettings) {
				return {
					action : action, // either foo/bar/1, foo.bar.1 or {controller : 'foo', action : 'bar', id : '1'}
					model : model,
					winSettings : winSettings
				};
			}
		};
	}

	$.mvc = {
		Controllers: {}, // object to hold all controllers -- used in initialization
		Views : {}, // object to hold all views
		loadControllers : function() {
			var dfo = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory + 'app/controllers/');
			var files = dfo.getDirectoryListing();
			var re = new RegExp(/[A-Z](.*)Controller.js/);
			for(var i = 0, ii = files.length; i < ii; i++) {
				if(re.test(files[i])) {
					Ti.include('/app/controllers/' + files[i]);
				}
			}
		},
		init : function(options) {
			this.loadControllers();
			var ctrlrs = this.Controllers, controller, views = this.Views;

			// set up controllers
			for(var key in ctrlrs) {
				if(!ctrlrs.hasOwnProperty(key)) {
					continue;
				}

				// make sure this is actually a Controller
				if(key.indexOf("Controller") === -1) {
					ctrlrs[key] = null;
					continue;
				}

				// extend the controller to include the properties from baseController
				ctrlrs[key] = extend(ctrlrs[key], Controller(key));
			}

			var self = this;
			self.process = function(route) {
				var r = self.find(route), createdObject = false;
				if(!r) {
					throw "Could not find any routes. Register routes via Mvc.mapRoute";
				}

				// set the routeData in sharedData
				rc.context.routeData = extend({}, r.routeData);

				var rd = r.routeData;

				var cname = rd.controller + "Controller", controller = self.Controllers[cname];
				if(!controller) {
					throw "Controller " + cname + " has not been defined";
				}
				if(!controller[rd.action]) {
					throw "Action " + rd.action + " in controller " + cname + " does not exist";
				}

				// populate the values to send to the function
				var func = controller[rd.action],
				reg = /\(([\s\S]*?)\)/,
				params = reg.exec(func),
				param_names,
				data = [];
				if (params) {
					param_names = params[1].replace(/ /g,"").split(',');

					for(var i = 0; i < param_names.length; i += 1) {
						// use arguments passed to this function first
						if(arguments[i + 1]) {
							data[i] = arguments[i + 1];
						} else if(rd[param_names[i]] && rd.hasOwnProperty(param_names[i])) {
							data[i] = rd[param_names[i]]; // use default value from defined route
						}
					}
				}

				var view = func.apply(controller, data);
				if(!view) {
					// we didn't need to show anything
					return;
				}
				return self._render(view.action, view.model, null, view.winSettings);
			};

			self._render = function(route, data, partial, winSettings) {
				var r = self.find(route);
				if(!r) {
					throw "Could not find any routes. Register routes via Mvc.mapRoute";
				}
				var cname = r.routeData.controller, vname = r.routeData.action;
				Ti.include('/app/views/' + cname + '/' + vname + '.js');
				
				var path = '/public/stylesheets/iPhone/views/' + cname +  '/' + vname + '.rjss';
				if(Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory + path).exists()) {
					includeRJSS(path);
				}
				
				if(!self.Views[cname]) {
					throw "View Controller " + cname + " does not exist in Views collection";
				}

				if(!self.Views[cname][vname]) {
					throw "View " + vname + " does not exist in View Controller " + cname;
				}
				var renderOutput = self.Views[cname][vname](data);
				if(!partial && self.render) {
					if(!winSettings) {
						winSettings = {};
					}
					renderOutput = self.render(renderOutput, r.routeData, winSettings);
				}
				return renderOutput;
			};
			self._partial = function(route, data) {
				// tell the render function that this is a partial render and we should not call 
				// the user defined render function
				return self._render(route, data, true);
			}

			// setup the views so they have an 'action' method
			for(var key in views) {
				if(!views.hasOwnProperty(key)) {
					continue;
				}
				views[key].action = self.process;
				views[key].partial = self._partial;
			}

			var rc = this.sharedData = {
				routes : [],
				context : {
					routeData : {
						controller : null,
						action : null
					}
				}
			};
		},
		mapRoute : function (name, path, defaults) {
			var scrubbedPath = path.substr(path.indexOf('{'));

			// get rid of slashes
			if(scrubbedPath[0] === '/') {
				scrubbedPath = scrubbedPath.substring(1, scrubbedPath.length - 1);
			}
			if(scrubbedPath[scrubbedPath.length - 1] === '/') {
				scrubbedPath = scrubbedPath.substr(scrubbedPath.length - 2);
			}

			this.sharedData.routes.push({
				name : name,
				path : path,
				defaults: defaults
			}) 
		},
		find: function (path) {
			var routes = this.sharedData.routes,
			ctrlrs = this.Controllers,
			context = this.sharedData.context;

			if(!path) {
				path = "";
			}

			// check for match
			for (var i = 0, route; i < routes.length; i++) {
				route = routes[i];
				if (!route.regexp) { // generate regexps on the fly and cache them for the future
					route.regexp = buildRegExp(route);
					route.segments = route.path.split(/\/|\./);
				}
				var isMatch = route.regexp.test(path);
				if (isMatch) {
					// route found, parse the route values and return an extended object

					// populate last controller if it doesn't exist with default
					if(!context.routeData.controller) {
						context.routeData.controller = route.defaults.controller;
					}

					// check current controller for match -- takes care of simply passing an action
					var ctrlr = context.routeData.controller + "Controller";
					var useLastController = ctrlrs[ctrlr] &&
					ctrlrs[ctrlr][path]; 

					var routeData = extend({}, context.routeData);
					if(useLastController) {
						var pathSegments = path.split(/\/|\./), iter = 1;
						routeData.action = pathSegments[0];
						for(var key in routeData) {
							if(!routeData.hasOwnProperty(key)) {
								continue;
							}
							if(key === "controller" || key === "action") {
								continue;
							}

							if(iter >= pathSegments.length) {
								break;
							}

							routeData[key] = pathSegments[iter];
							iter += 1;
						}
					} else {
						routeData = parsePath(path, route);
					}

					return extend({}, route, { routeData : routeData });
				}
			}
			return null;
		},
		start : function (route) { // parameters in case we want to start the app with something other than the default page
			this.process.apply(this, arguments);
		}
	};
	return $.mvc;
}(Titanium.App));

