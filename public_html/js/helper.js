var suffixes = ['', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
var MAX_CONSOLE_LINES = 100;
var VERSION = 0.01;

function formatNumber(value, precision)
{
    //only apply suffixes from +-million and onwards
    if (Math.abs(value) >= 1000000) {
        //get rid of decimals and the minus sign, and save the length of the string representation -> number of digits
        var value_Length = Math.round(Math.abs(value)).toString().length;
        //see how much 10^base is, if value_Length is a multitude of 3, leave 3 numbers, so we get 500 M and not 0.500 B
        var base = value_Length - ((value_Length % 3 === 0) ? 3 : value_Length % 3);
        //calculate mantissa
        var a = value / (Math.pow(10, base));
        //calculate suffix based on base 
        var suffixIndex = (base / 3) - 1;
        //construct output, infinity if the number is so large that the suffixes can't handle it
        value = (suffixIndex > suffixes.length) ? "Infinity" : a.toFixed(precision) + suffixes[suffixIndex];
    }
    //if value is of type string we alread constructed it, if not, the original value was smaller than 1mil, so fix the decimals
    return (typeof value === 'string') ? value : value.toFixed(precision);
}

//@param time in seconds!
function formatTime(time) {
    var milisRaw = Math.floor((time % 1) * 1000);
    var milisString = (milisRaw.toString().length > 1) ? (milisRaw.toString().length > 2) ? milisRaw : "0" + milisRaw : "00" + milisRaw;
    var secondsRaw = Math.floor(time % 60);
    var secondsString = (secondsRaw.toString().length > 1) ? secondsRaw : "0" + secondsRaw;
    var minutesRaw = (Math.floor(time / 60)) % 60;
    var minutesString = (minutesRaw.toString().length > 1) ? minutesRaw : "0" + minutesRaw;
    var hoursRaw = (Math.floor(time / (60 * 60))) % 24;
    var hoursString = (hoursRaw.toString().length > 1) ? hoursRaw : "0" + hoursRaw;
    var days = Math.floor(time / (60 * 60 * 24));
    return (days >= 1) ? days + "d - " + hoursString + ":" + minutesString + ":" + secondsString + ":" + milisString : hoursString + ":" + minutesString + ":" + secondsString + ":" + milisString;
}

function getResourceGlyphicon(name) {
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

//Loading & Saving
function saveGame() {
    if (typeof (Storage) !== "undefined") {
        localStorage.clear();
        localStorage.setItem("savedState", true);
        localStorage.setItem("save_interval", SAVE_INTERVAL);
        localStorage.setItem("show_building_effeciency", SHOW_BUILDING_EFFICIENCY);
        localStorage.setItem("version", VERSION);

        //Resources
        myGame.resources.map(function(resource) {
            localStorage.setItem(resource.name + "Amount", resource.amount);
            localStorage.setItem(resource.name + "totalSecondAmount", resource.totalSecondAmount);
            localStorage.setItem(resource.name + "totalClickAmount", resource.totalClickAmount);
            localStorage.setItem(resource.name + "totalJobAmount", resource.totalJobAmount);
            localStorage.setItem(resource.name + "totalStockBought", resource.totalStockBought);
            localStorage.setItem(resource.name + "totalStockSold", resource.totalStockSold);
        });

        //Buildings
        myGame.buildings.map(function(building) {
            localStorage.setItem(building.name + "AmountOwned", building.amountOwned);
        });

        //Upgrades
        myGame.upgrades.map(function(upgrade) {
            localStorage.setItem(upgrade.name + "HasPurchased", upgrade.hasPurchased);
        });

        //Jobs
        myGame.jobs.map(function(job) {
            localStorage.setItem(job.name + "XP", job.xp);
            localStorage.setItem(job.name + "Level", job.level);
            localStorage.setItem(job.name + "CurrentTime", job.currentTime);
        });

        //Boosts
        myGame.boosts.map(function(boost) {
            localStorage.setItem(boost.name + "CurrentBoostTime", boost.currentBoostTime);
            localStorage.setItem(boost.name + "IsEnabled", boost.isEnabled);
        });

        //Stockmarket
        myGame.stockEntities.map(function(stock) {
            localStorage.setItem(stock.name + "Prices", JSON.stringify(stock.prices));
            localStorage.setItem(stock.name + "AmountOwned", stock.amountOwned);
        });

        //Console
        var consoleText = $("#consoleText").html();
        localStorage.setItem("Console", consoleText);

        log("Saved game");
    } else {
        log("Error: browser does not support LocalStorage");
    }
}
;

function loadGame() {
    if (typeof (Storage) !== "undefined") {
        myGame = new game();
        if (localStorage.getItem("savedState") !== null) {
            SAVE_INTERVAL = localStorage.getItem("save_interval");
            SHOW_BUILDING_EFFICIENCY = JSON.parse(localStorage.getItem("show_building_effeciency"));
            //Resources
            myGame.resources.map(function(resource) {
                resource.amount = parseFloat(localStorage.getItem(resource.name + "Amount"));
                resource.totalSecondAmount = parseFloat(localStorage.getItem(resource.name + "totalSecondAmount"));
                resource.totalClickAmount = parseFloat(localStorage.getItem(resource.name + "totalClickAmount"));
                resource.totalJobAmount = parseFloat(localStorage.getItem(resource.name + "totalJobAmount"));
                resource.totalStockBought = parseFloat(localStorage.getItem(resource.name + "totalStockBought"));
                resource.totalStockSold = parseFloat(localStorage.getItem(resource.name + "totalStockSold"));
                resource.updateLabel();
            });

            //Buildings
            myGame.buildings.map(function(building) {
                building.amountOwned = parseFloat(localStorage.getItem(building.name + "AmountOwned"));
                building.updatePrices();
                building.updateUI();
            });

            //Upgrades
            myGame.upgrades.map(function(upgrade) {
                //JSON parse for getting boolean value out of string
                upgrade.hasPurchased = JSON.parse(localStorage.getItem(upgrade.name + "HasPurchased"));
                if (upgrade.hasPurchased) {
                    upgrade.upgradeEffect.applyUpgrade();
                }
                upgrade.updateUI();
            });

            //Jobs
            myGame.jobs.map(function(job) {
                job.xp = parseFloat(localStorage.getItem(job.name + "XP"));
                job.level = parseFloat(localStorage.getItem(job.name + "Level"));
                job.currentTime = parseFloat(localStorage.getItem(job.name + "CurrentTime"));
                job.updateUI();
                job.startCountDown();
            });

            //Boosts
            myGame.boosts.map(function(boost) {
                boost.currentBoostTime = parseFloat(localStorage.getItem(boost.name + "CurrentBoostTime"));
                boost.isEnabled = JSON.parse(localStorage.getItem(boost.name + "IsEnabled"));
                boost.updateBoostTimeBar();
                if (boost.isEnabled) {
                    boost.startCountDownTimer();
                    boost.disableButton();
                }
            });

            //StockEntities
            myGame.stockEntities.map(function(stock) {
                stock.prices = JSON.parse(localStorage.getItem(stock.name + "Prices"));
                stock.amountOwned = localStorage.getItem(stock.name + "AmountOwned");
                stock.updateOwned();
            });

            //Console
            var consoleText = localStorage.getItem("Console");
            $("#consoleText").html(consoleText);

            myGame.updateResourceIncrements();

            log("Loaded game");
        }

    } else {
        // Sorry! No Web Storage support..
    }
}
;

//Console

function log(text) {
    getCurrentTime();
    var currentText = $("#consoleText").html();
    var lines = currentText.split(/\<br\>/).length;
    //Breaks if MAX_CONSOLE_LINES = 1
    while (lines >= MAX_CONSOLE_LINES) {
        currentText = currentText.replace(/\<br\>[^\<]*$/g, "");
        lines = currentText.split(/\<br\>/).length;
    }
    var newText = getCurrentTime() + " > " + text + "</br>" + currentText;
    $("#consoleText").html(newText);
}
;

function getCurrentTime() {
    var dateObj = new Date();
    var year = dateObj.getFullYear();
    var month = dateObj.getMonth();
    var day = dateObj.getDate();
    var hour = dateObj.getHours();
    var minutes = dateObj.getMinutes();
    var seconds = dateObj.getSeconds();

    return year + "/"
            + ((month + 1) > 9 ? (month + 1) : "0" + (month + 1)) + "/"
            + (day > 9 ? day : "0" + day)
            + " - " + (hour > 9 ? hour : "0" + hour) + ":"
            + (minutes > 9 ? minutes : "0" + minutes) + ":"
            + (seconds > 9 ? seconds : "0" + seconds);
}

//Statistics

function updateStatistics() {
    $(".statistics >.table").empty();
    myGame.resources.map(function(resource) {
        var headerRow = document.createElement("tr");
        var resourceNameLabel = document.createElement("p");
        resourceNameLabel.innerHTML = "<span class='glyphicon glyphicon-" + getResourceGlyphicon(resource.name) + "'></span> " + resource.name;
        headerRow.appendChild(document.createElement("th")).appendChild(resourceNameLabel);
        headerRow.appendChild(document.createElement("th"));
        $(".statistics > .table").append(headerRow);

        var totalAmountStat = document.createElement("tr");
        var totalAmountLabel = document.createElement("p");
        totalAmountLabel.innerHTML = "Total amount gained";
        var totalAmountValue = document.createElement("p");
        if (resource.name === "Money") {
            totalAmountValue.innerHTML = formatNumber(resource.totalSecondAmount + resource.totalClickAmount + resource.totalJobAmount, 2);
        }
        else {
            totalAmountValue.innerHTML = formatNumber(resource.totalSecondAmount + resource.totalClickAmount + resource.totalJobAmount + (resource.totalStockSold - resource.totalStockBought), 2);
        }
        totalAmountStat.appendChild(document.createElement("td")).appendChild(totalAmountLabel);
        totalAmountStat.appendChild(document.createElement("td")).appendChild(totalAmountValue);
        $(".statistics > .table").append(totalAmountStat);

        var totalSecondAmountStat = document.createElement("tr");
        var totalSecondAmountLabel = document.createElement("p");
        totalSecondAmountLabel.innerHTML = "Gained by idling";
        var totalSecondAmountValue = document.createElement("p");
        totalSecondAmountValue.innerHTML = formatNumber(resource.totalSecondAmount, 2);
        totalSecondAmountStat.appendChild(document.createElement("td")).appendChild(totalSecondAmountLabel);
        totalSecondAmountStat.appendChild(document.createElement("td")).appendChild(totalSecondAmountValue);
        $(".statistics > .table").append(totalSecondAmountStat);

        var totalClickAmountStat = document.createElement("tr");
        var totalClickAmountLabel = document.createElement("p");
        totalClickAmountLabel.innerHTML = "Gained by clicking";
        var totalClickAmountValue = document.createElement("p");
        totalClickAmountValue.innerHTML = formatNumber(resource.totalClickAmount, 2);
        totalClickAmountStat.appendChild(document.createElement("td")).appendChild(totalClickAmountLabel);
        totalClickAmountStat.appendChild(document.createElement("td")).appendChild(totalClickAmountValue);
        $(".statistics > .table").append(totalClickAmountStat);

        var totalJobAmountStat = document.createElement("tr");
        var totalJobAmountLabel = document.createElement("p");
        totalJobAmountLabel.innerHTML = "Gained doing jobs";
        var totalJobAmountValue = document.createElement("p");
        totalJobAmountValue.innerHTML = formatNumber(resource.totalJobAmount, 2);
        totalJobAmountStat.appendChild(document.createElement("td")).appendChild(totalJobAmountLabel);
        totalJobAmountStat.appendChild(document.createElement("td")).appendChild(totalJobAmountValue);
        $(".statistics > .table").append(totalJobAmountStat);

        if (resource.name === "Money") {
            var totalStockProfit = document.createElement("tr");
            var totalStockBoughtLabel = document.createElement("p");
            totalStockBoughtLabel.innerHTML = "Total money gained from stock profit";
            var totalStockBoughtValue = document.createElement("p");
            totalStockBoughtValue.innerHTML = formatNumber(resource.totalStockSold - resource.totalStockBought, 2);
            totalStockProfit.appendChild(document.createElement("td")).appendChild(totalStockBoughtLabel);
            totalStockProfit.appendChild(document.createElement("td")).appendChild(totalStockBoughtValue);
            $(".statistics > .table").append(totalStockProfit);
        }
    });
}
;

function adjustSaveInterval() {
    var newInterval = parseInt($("input[name='save_interval']").val());
    if (newInterval >= 1) {
        SAVE_INTERVAL = newInterval;
        log("Save interval adjusted to: "+newInterval);
    }
}
;

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

function showConsole(show) {
    if (show) {
        $(".console").show();
        log("Console enabled");
    }
    else {
        $(".console").hide();
        log("Console hidden");
    }
}
;

function showSettings(show) {
    if (show) {
        $(".settings").show();
        log("Settings enabled");
    }
    else {
        $(".settings").hide();
        log("Settings hidden");
    }
}
;

function showStatistics(show) {
    if (show) {
        $(".statistics").show();
        log("Statistics enabled");
    }
    else {
        $(".statistics").hide();
        log("Statistics hidden");
    }
}
;

function showBuildingEffeciencyTooltip(show) {
    if (show) {
        SHOW_BUILDING_EFFICIENCY = true;
        log("Building efficiency enabled");
    }
    else {
        SHOW_BUILDING_EFFICIENCY = false;
        log("Building efficiency hidden");
    }

}
;

function resetGame(){
    localStorage.clear();location.reload();
}