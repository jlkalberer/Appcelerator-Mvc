/*
 * Render the DoStuff page
 */
v.Home.DoStuff = function(model) {
    var view = Ti.UI.createView({
        backgroundColor : "#fff"
    });
    var label = Ti.UI.createLabel({
        text : model,
        color : "#000"
        });
 
    view.add(label);
 
    return view;
};