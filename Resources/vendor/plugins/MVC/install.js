var Mvc = requires('/vendor/plugins/MVC/mvc.js');
Mvc.render = requires('/vendor/plugins/MVC/render.js');
Mvc.init();
requires('/config/routes.js'); // this simply calls the configuration code

// This will go off and attempt to render the default route
Mvc.start();