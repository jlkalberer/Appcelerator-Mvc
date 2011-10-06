Ti.include('mvc.js'); 
 
Ti.include("/dal.js");
 
Ti.include('/controllers/HomeController.js');
Ti.include('/controllers/AccountsController.js');
 
Mvc.init();

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
    });
    
// manage the windows -- window stack
var openWindows = [];
 
Mvc.render = function(ui, routeData) {
    var win, index, routeName = routeData.controller + "." + routeData.action;
 
    // find the index in the stack of windows
    for(var i = openWindows.length - 1; i >= 0; i -= 1) {
        if(openWindows[i]._title === routeName) {
            win = openWindows[i];
            index = i + 1;
            break;
        }
    }
    function cleanup(index) {
        for(var i = index; i < openWindows.length; i += 1) {
            openWindows[i].close();
            openWindows[i] = null;
        }
        openWindows = openWindows.splice(0, index);
    }
    // if the window already exists in the stack
    if(win) {
        // clean up array -- remove all windows
        cleanup(index);
 
        // remove children from current view
        var children = win.children;
        for(var i = 0; i < children.length; i += 1) {
            win.remove(children[i])
        }
    } else {
        // create a new window
        win = Ti.UI.createWindow({
            _title : routeName,
            fullscreen : true
        });
 
        win.addEventListener('close', function() {
            // find the index of this window so we can remove it when the back button is pressed
            for(var i = openWindows.length - 1; i >= 0; i -= 1) {
                if(openWindows[i]._title === routeName) {
                    index = i;
                    break;
                }
            }
            cleanup(index);
        });
 
        // This handles the creation of the first window so that
        // Appcelerator will exit your app when this window is closed.
        if(openWindows.length === 0) {
            win.exitOnClose = true;
        }
 
        openWindows.push(win);
        win.open();
    }
 
    // This adds the controls you created in your view
    win.add(ui);
 
    // return the window incase you need it for something in your view
    return win;
};

// This will go off and attempt to render the default route and will
// fail since we have not created the 'Home' controller yet
Mvc.start("Accounts");