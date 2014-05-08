var suffixes = ['', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];

function formatNumber(value, precision)
{  
    //only apply suffixes from +-million and onwards
    if(Math.abs(value) >= 1000000){
        //get rid of decimals and the minus sign, and save the length of the string representation -> number of digits
        var value_Length = Math.round(Math.abs(value)).toString().length;
        //see how much 10^base is, if value_Length is a multitude of 3, leave 3 numbers, so we get 500 M and not 0.500 B
        var base = value_Length-((value_Length%3===0)?3:value_Length%3);
        //calculate mantissa
        var a = value/(Math.pow(10,base));
        //calculate suffix based on base 
        var suffixIndex = (base/3)-1;
        //construct output, infinity if the number is so large that the suffixes can't handle it
        value = (suffixIndex > suffixes.length) ? "Infinity" : a.toFixed(precision) + suffixes[suffixIndex];
    }
    //if value is of type string we alread constructed it, if not, the original value was smaller than 1mil, so fix the decimals
    return ( typeof value === 'string') ? value : value.toFixed(precision);    
}

//@param time in seconds!
function formatTime(time){
    var secondsRaw = time%60;
    var secondsString = (secondsRaw.toString().length > 1)? secondsRaw : "0"+secondsRaw;
    var minutesRaw = (Math.floor(time/60))%60;
    var minutesString = (minutesRaw.toString().length > 1) ? minutesRaw : "0"+minutesRaw;
    var hoursRaw  = (Math.floor(time/(60*60)))%24;
    var hoursString = (hoursRaw.toString().length > 1 ) ? hoursRaw : "0"+hoursRaw;
    var days = Math.floor(time/(60*60*24));
    return (days >= 1) ? days+"d - "+hoursString+":"+minutesString+":"+secondsString : hoursString+":"+minutesString+":"+secondsString;
}

function getResourceGlyphicon(name){
    switch (name) {
            case "Money":
                return "usd";
                break;
            case "Political power":
                return "globe";
                break;
            case "Social influence":
                return "user";
                break;
            case "Criminal power":
                return "screenshot";
                break;
        }
        ;
}

//UI stuff

$(".nav.nav-pills.mainMenu").click(function(event) {
    $(".panel.panel-default.features").children().hide();
    $(".nav.nav-pills.mainMenu").children().filter("li").removeClass("active");
    $("#" + event.target.id).parent().addClass("active");
    $("#" + event.target.id.toString().split("TabLink")[0]).show();
});

$(".nav.nav-pills.upgradesSubMenu").click(function(event) {
    $(".panel.panel-default.upgradeTypes").children().hide();
    $(".nav.nav-pills.upgradesSubMenu").children().filter("li").removeClass("active");
    $("#" + event.target.id).parent().addClass("active");
    $("#" + event.target.id.toString().split("TabLink")[0]).show();
});