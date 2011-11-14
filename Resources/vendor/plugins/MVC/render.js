// manage the windows -- window stack
Mvc.openWindows = [];
Mvc.applicationOpening = true;
Mvc.tabGroup = Titanium.UI.createTabGroup({tabBarHidden: true});
Mvc.tab1 = Titanium.UI.createTab({
	id:'tab1'
});

Mvc.render = function(ui, routeData, winSettings) {
    var win, index, routeName = routeData.controller + "." + routeData.action;
 
    // find the index in the stack of windows
    for(var i = Mvc.openWindows.length - 1; i >= 0; i -= 1) {
        if(Mvc.openWindows[i]._title === routeName) {
            win = Mvc.openWindows[i];
            index = i + 1;
            break;
        }
    }
    function cleanup(index) {
        for(var i = index; i < Mvc.openWindows.length; i += 1) {
            Mvc.openWindows[i].close();
            Mvc.openWindows[i] = null;
        }
        Mvc.openWindows = Mvc.openWindows.splice(0, index);
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
				winSettings = _.extend({_title: routeName}, winSettings);
        win = Ti.UI.createWindow(winSettings);
 
        // win.addEventListener('close', function() {
        //     // find the index of this window so we can remove it when the back button is pressed
        //     for(var i = Mvc.openWindows.length - 1; i >= 0; i -= 1) {
        //         if(Mvc.openWindows[i]._title === routeName) {
        //             index = i;
        //             break;
        //         }
        //     }
        //     cleanup(index);
        // });
 
        // This handles the creation of the first window so that
        // Appcelerator will exit your app when this window is closed.
        if(Mvc.openWindows.length === 0) {
            win.exitOnClose = true;
        }
 
        Mvc.openWindows.push(win);
        // win.open();
				if(Mvc.applicationOpening) {
					Mvc.applicationOpening = false;
					Mvc.tab1.window = win;
					Mvc.tabGroup.addTab(Mvc.tab1);
					Mvc.tabGroup.open();
				}
				else {
					Mvc.tab1.open(win,{animated:true});
				}
    }
 
    // This adds the controls you created in your view
    win.add(ui);
 
    // return the window incase you need it for something in your view
    return win;
};
