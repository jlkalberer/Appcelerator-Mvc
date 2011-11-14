// make a specific route
Mvc.mapRoute(
	"DoStuff_Route",
	"DS",
	{
		controller : "Home",
		action : "DoStuff"
	}
)

// map a default route
Mvc.mapRoute(
	"Default_Route",
	"{controller}.{action}.{text}", // could also be {controller}/{action}/{id}
	{
		controller : "Home",
		action : "Default",
		text : "Default Text"
	}
);
