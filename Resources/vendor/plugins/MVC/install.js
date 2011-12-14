Ti.include('/vendor/plugins/MVC/mvc.js');
Ti.include('/config/initializers/mvc.js');
Ti.include('/vendor/plugins/MVC/render.js');
Mvc.init();
Ti.include('/config/routes.js');

// This will go off and attempt to render the default route
Mvc.start();