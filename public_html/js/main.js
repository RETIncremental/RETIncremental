//Prototypes

var resource = function(name) {
    this.name = name;
    this.amount = 0;
    this.increasePerSecond = 0;
    this.increasePerClick = 0;
    this.iconClassName = "";

    this.handleTick = function() {
        this.amount += this.increasePerSecond;
    };
    this.handleClick = function() {
        this.amount += this.increasePerClick;
    };

    //UI

    this.initializeUI = function() {
        this.button = document.createElement("button");
        this.button.setAttribute("class", "btn btn-success");
        //fuck you, javascript
        this.button.addEventListener("click", function() {
            this.handleButtonOnclick();
        }.bind(this), false);
        this.button.addEventListener("mousemove", function(event) {
            this.handleButtonOnmouseover(event);
        }.bind(this), false);
        this.button.addEventListener("mouseout", function(event) {
            this.handleButtonOnmouseout(event);
        }.bind(this), false);

        $("#resources").append(this.button);
    }.bind(this);

    this.handleButtonOnclick = function() {
        this.handleClick();
        this.updateLabel();
    };


    this.handleButtonOnmouseover = function(event) {
        $(".popup-div").remove();
        var mouseoverDiv = document.createElement("div");
        mouseoverDiv.setAttribute("class", "popup-div");
        var mouseoverLabel = document.createElement("p");
        mouseoverLabel.innerHTML = "Amount of " + this.name + " per second: " + formatNumber(this.increasePerSecond, 3) + "<br/>" + "Amount of " + this.name + " per click: " + formatNumber(this.increasePerClick, 3);
        mouseoverDiv.appendChild(mouseoverLabel);
        mouseoverDiv.style.top = (event.pageY + 5) + "px";
        mouseoverDiv.style.left = (event.pageX + 5) + "px";
        $("body").append(mouseoverDiv);
    };

    this.handleButtonOnmouseout = function(event) {
        $(".popup-div").remove();
    };

    this.updateLabel = function() {
        this.button.innerHTML = '<span class="' + this.iconClassName + '"></span> ' + this.name + "<br/>" + formatNumber(this.amount, 3);
    };
};

var game = function() {
    this.resources = initializeResources(this);
    this.buildings = initializeBuildings(this);
    this.upgrades = initializeUpgrades(this);
    this.jobs = initializeJobs(this);
    
    this.handleTick = function() {
        this.resources.map(function(resource) {
            resource.handleTick();
            resource.updateLabel();
        });
    }.bind(this);

    this.tick = function() {
        var t = setInterval(this.handleTick, 1000);
    };

    this.handleItemBuy = function(item) {
        var canAfford = 0;
        for (var i = 0; i < 4; i++) {
            canAfford += item.prices[i] <= this.resources[i].amount;
        }
        if (canAfford === 4) {
            for (var i = 0; i < 4; i++) {
                this.resources[i].amount -= item.prices[i];
            }
            if (item instanceof building) {
                item.increaseAmountOwned();
            }
            if (item instanceof upgrade) {
                item.upgradeEffect.applyUpgrade();
                item.disablePurchase();
            }

            this.updateResourceIncrements();
        }
    };


    this.updateResourceIncrements = function() {
        this.resources.map(function(resource) {
            resource.increasePerClick = 1;
            resource.increasePerSecond = 1;
        });
        this.buildings.map(function(building) {
            building.resourceTarget.increasePerClick += building.increasePerClick * building.amountOwned;
            building.resourceTarget.increasePerSecond += building.increasePerSecond * building.amountOwned;
        });
    }.bind(this);
};

var building = function(name, description) {
    this.name = name;
    this.description = description;
    this.amountOwned = 0;
    this.prices = [20, 0, 10, 10];
    this.priceMultiplier = 1.45;
    this.resourceTarget = null;
    this.increasePerClick = 0;
    this.increasePerSecond = 0;
    this.hasPurchased = false;
    this.imgPath = "";
    this.listener = null;
    this.fireUpdate = function() {
        this.listener.handleItemBuy(this);
    };
    
    this.updateProductionLabel = function(){
        var productionLabelIcon;
        switch (this.resourceTarget.name) {
            case "Money":
                productionLabelIcon = "usd";
                break;
            case "Political power":
                productionLabelIcon = "globe";
                break;
            case "Social influence":
                productionLabelIcon = "user";
                break;
            case "Criminal power":
                productionLabelIcon = "screenshot";
                break;
        }
        ;
        this.productionLabel.innerHTML =
                ((this.increasePerClick > 0) ? "+<span class='glyphicon glyphicon-"+productionLabelIcon+"'></span>" + formatNumber(this.increasePerClick, 2) + "/click<br/>" : "") +
                ((this.increasePerSecond > 0) ? "+<span class='glyphicon glyphicon-"+productionLabelIcon+"'></span>" + formatNumber(this.increasePerSecond, 2) + "/second" : "")
                ;       
    };
    
    this.increaseAmountOwned = function() {
        this.amountOwned++;
        this.prices = this.prices.map(function(x) {
            return x * this.priceMultiplier;
        }.bind(this));
        this.label.innerHTML = this.name + " <span class='badge'>" + this.amountOwned + "</span>";
        this.priceLabel.innerHTML =
                ((this.prices[0] > 0) ? "<span class='glyphicon glyphicon-usd'></span>" + formatNumber(this.prices[0], 2) + "<br/>" : "") +
                ((this.prices[1] > 0) ? "<span class='glyphicon glyphicon-globe'></span>" + formatNumber(this.prices[1, 2]) + "<br/>" : "") +
                ((this.prices[2] > 0) ? "<span class='glyphicon glyphicon-user'></span>" + formatNumber(this.prices[2], 2) + "<br/>" : "") +
                ((this.prices[3] > 0) ? "<span class='glyphicon glyphicon-screenshot'></span>" + formatNumber(this.prices[3], 2) : "");
    }.bind(this);

    this.initializeUI = function() {
        //UI
        this.tableRow = document.createElement("tr");
        this.img = document.createElement("img");
        this.img.setAttribute("src", this.imgPath);
        this.img.setAttribute("class", "buildingImg");
        this.label = document.createElement("p");
        this.label.innerHTML = this.name + " <span class='badge'>" + this.amountOwned + "</span>";
        this.label.addEventListener("mousemove", function(event) {
            this.handleButtonOnmouseover(event);
        }.bind(this), false);
        this.label.addEventListener("mouseout", function(event) {
            this.handleButtonOnmouseout(event);
        }.bind(this), false);
        this.priceLabel = document.createElement("p");
        this.priceLabel.innerHTML =
                ((this.prices[0] > 0) ? "<span class='glyphicon glyphicon-usd'></span> " + formatNumber(this.prices[0], 2) + "<br/>" : "") +
                ((this.prices[1] > 0) ? "<span class='glyphicon glyphicon-globe'></span> " + formatNumber(this.prices[1], 2) + "<br/>" : "") +
                ((this.prices[2] > 0) ? "<span class='glyphicon glyphicon-user'></span> " + formatNumber(this.prices[2], 2) + "<br/>" : "") +
                ((this.prices[3] > 0) ? "<span class='glyphicon glyphicon-screenshot'></span> " + formatNumber(this.prices[3], 2) : "");
        this.productionLabel = document.createElement("p");
        this.updateProductionLabel();
        this.button = document.createElement("button");
        this.button.setAttribute("class", "btn btn-default");
        this.button.innerHTML = "Buy";
        this.button.addEventListener("click", function() {
            this.fireUpdate();
        }.bind(this), false);

        this.tableRow.appendChild(document.createElement("td")).appendChild(this.img);
        this.tableRow.appendChild(document.createElement("td")).appendChild(this.label);
        this.tableRow.appendChild(document.createElement("td")).appendChild(this.priceLabel);
        this.tableRow.appendChild(document.createElement("td")).appendChild(this.productionLabel);
        this.tableRow.appendChild(document.createElement("td")).appendChild(this.button);

        $("#buildings > .table-striped").append(this.tableRow);
    };

    this.handleButtonOnmouseover = function(event) {
        $(".popup-div").remove();
        var mouseoverDiv = document.createElement("div");
        mouseoverDiv.setAttribute("class", "popup-div");
        var mouseoverLabel = document.createElement("p");
        mouseoverLabel.innerHTML = this.description;
        mouseoverDiv.appendChild(mouseoverLabel);
        mouseoverDiv.style.top = (event.pageY + 5) + "px";
        mouseoverDiv.style.left = (event.pageX + 5) + "px";
        $("body").append(mouseoverDiv);
    };

    this.handleButtonOnmouseout = function(event) {
        $(".popup-div").remove();
    };
};

var upgrade = function(name, description) {
    this.name = name;
    this.description = description;
    this.prices = [20, 0, 10, 10];
    this.upgradeEffect = null;
    this.hasPurchased = false;
    this.imgPath = "";
    this.listener = null;
    this.fireUpdate = function() {
        this.listener.handleItemBuy(this);
    };

    this.disablePurchase = function() {
        this.hasPurchased = true;
        this.button.disabled = true;
    };

    this.initializeUI = function() {
        //UI
        this.tableRow = document.createElement("tr");
        this.img = document.createElement("img");
        this.img.setAttribute("src", this.imgPath);
        this.img.setAttribute("class", "buildingImg");
        this.label = document.createElement("p");
        this.label.innerHTML = this.name;
        this.label.addEventListener("mousemove", function(event) {
            this.handleLabelOnmouseover(event);
        }.bind(this), false);
        this.label.addEventListener("mouseout", function(event) {
            this.handleButtonOnmouseout(event);
        }.bind(this), false);
        this.priceLabel = document.createElement("p");
        this.priceLabel.innerHTML =
                ((this.prices[0] > 0) ? "<span class='glyphicon glyphicon-usd'></span>" + formatNumber(this.prices[0], 2) + "<br/>" : "") +
                ((this.prices[1] > 0) ? "<span class='glyphicon glyphicon-globe'></span>" + formatNumber(this.prices[1], 2) + "<br/>" : "") +
                ((this.prices[2] > 0) ? "<span class='glyphicon glyphicon-user'></span>" + formatNumber(this.prices[2], 2) + "<br/>" : "") +
                ((this.prices[3] > 0) ? "<span class='glyphicon glyphicon-screenshot'></span>" + formatNumber(this.prices[3], 2) : "");
        this.productionLabel = document.createElement("p");
        var productionLabelIcon;
        switch (this.upgradeEffect.buildingTarget.resourceTarget.name) {
            case "Money":
                productionLabelIcon = "usd";
                break;
            case "Political power":
                productionLabelIcon = "globe";
                break;
            case "Social influence":
                productionLabelIcon = "user";
                break;
            case "Criminal power":
                productionLabelIcon = "screenshot";
                break;
        }
        ;
        this.productionLabel.innerHTML =
                ((this.upgradeEffect.flatPerClickIncrement > 0) ? "+<span class='glyphicon glyphicon-" + productionLabelIcon + "'></span>" + formatNumber(this.upgradeEffect.flatPerClickIncrement, 2) + "/click<br/>" : "") +
                ((this.upgradeEffect.flatPerSecondIncrement > 0) ? "+<span class='glyphicon glyphicon-" + productionLabelIcon + "'></span>" + formatNumber(this.upgradeEffect.flatPerSecondIncrement, 2) + "/second" : "") +
                ((this.upgradeEffect.percentPerClickIncrement > 1) ? "+<span class='glyphicon glyphicon-" + productionLabelIcon + "'></span>" + formatNumber((this.upgradeEffect.percentPerClickIncrement-1)*100, 2) + "%/click<br/>" : "") +
                ((this.upgradeEffect.percentPerSecondIncrement > 1) ? "+<span class='glyphicon glyphicon-" + productionLabelIcon + "'></span>" + formatNumber((this.upgradeEffect.percentPerSecondIncrement-1)*100, 2) + "%/second" : "");
        this.button = document.createElement("button");
        this.button.setAttribute("class", "btn btn-default");
        this.button.innerHTML = "Buy";
        this.button.addEventListener("click", function() {
            this.fireUpdate();
        }.bind(this), false);

        this.tableRow.appendChild(document.createElement("td")).appendChild(this.img);
        this.tableRow.appendChild(document.createElement("td")).appendChild(this.label);
        this.tableRow.appendChild(document.createElement("td")).appendChild(this.priceLabel);
        this.tableRow.appendChild(document.createElement("td")).appendChild(this.productionLabel);
        this.tableRow.appendChild(document.createElement("td")).appendChild(this.button);

        $("#buildingsUpgrades > .table-striped").append(this.tableRow);
    };

    this.handleLabelOnmouseover = function(event) {
        $(".popup-div").remove();
        var mouseoverDiv = document.createElement("div");
        mouseoverDiv.setAttribute("class", "popup-div");
        var mouseoverLabel = document.createElement("p");
        mouseoverLabel.innerHTML = this.description;
        mouseoverDiv.appendChild(mouseoverLabel);
        mouseoverDiv.style.top = (event.pageY + 5) + "px";
        mouseoverDiv.style.left = (event.pageX + 5) + "px";
        $("body").append(mouseoverDiv);
    };

    this.handleOLabelOnmouseout = function(event) {
        $(".popup-div").remove();
    };
};

var buildingUpgradeEffect = function(building) {
    this.buildingTarget = building;
    this.flatPerClickIncrement = 0;
    this.flatPerSecondIncrement = 0;
    this.percentPerClickIncrement = 1;
    this.percentPerSecondIncrement = 1;

    this.applyUpgrade = function() {
        building.increasePerClick += this.flatPerClickIncrement;
        building.increasePerSecond += this.flatPerSecondIncrement;
        building.increasePerClick *= this.percentPerClickIncrement;
        building.increasePerSecond *= this.percentPerSecondIncrement;
        
        building.updateProductionLabel();
    };

};

var job = function(name, description){
    this.name = name;
    this.description = description;
    this.xp = 0;
    this.level = 0;
    this.xpNextLevel = 10;
    this.xpReward = 5;
    this.xpRequiredMultiplier = 1.1;
    this.resetTime = 0;
    this.resourceTarget = null;
    this.imgPath = "";   
    
    this.initializeUI = function() {
        this.tableRow = document.createElement("tr");
        
        this.jobLabel = document.createElement("p");
        this.jobLabel.innerHTML = this.name;
        this.jobLabel.addEventListener("mousemove", function(event) {
            this.handleLabelOnmouseover(event);
        }.bind(this), false);
        this.jobLabel.addEventListener("mouseout", function(event) {
            this.handleLabelOnmouseout(event);
        }.bind(this), false);
        
        this.levelLabel = document.createElement("p");
        this.levelLabel.innerHTML = "Level: "+this.level;
        
        this.progressDivWrapper = document.createElement("div");
        this.progressDivWrapper.setAttribute("class","progress progress-striped active");
        this.progressDivWrapper.style.minWidth ="300px";
        this.progressDivWrapper.appendChild(this.levelLabel);
        this.progressBarDiv = document.createElement("div");
        this.progressBarDiv.setAttribute("class","progress-bar");
        this.progressBarDiv.setAttribute("role","progressbar");
        this.progressBarDiv.setAttribute("aria-valuenow",this.xp);
        this.progressBarDiv.setAttribute("aria-valuemin",0);
        this.progressBarDiv.setAttribute("aria-valuemax",this.xpNextLevel);
        console.log((this.xp/this.xpNextLevel)+"%");
        this.progressBarDiv.style.width = ((this.xp/this.xpNextLevel)*100)+"%";
        this.progressBarDiv.innerHTML = this.xp+"/"+this.xpNextLevel;
        this.progressDivWrapper.appendChild(this.progressBarDiv);
        
        this.button = document.createElement("button");
        this.button.innerHTML = "Do job";
        
        
        this.tableRow.appendChild(document.createElement("td")).appendChild(this.jobLabel);
        this.tableRow.appendChild(document.createElement("td")).appendChild(this.levelLabel);
        this.tableRow.lastChild.appendChild(this.progressDivWrapper);
        this.tableRow.appendChild(document.createElement("td")).appendChild(this.button);
        

        $("#jobs > .table-striped").append(this.tableRow);
    };
    
    this.handleLabelOnmouseover = function(event) {
        $(".popup-div").remove();
        var mouseoverDiv = document.createElement("div");
        mouseoverDiv.setAttribute("class", "popup-div");
        var mouseoverLabel = document.createElement("p");
        mouseoverLabel.innerHTML = this.description;
        mouseoverDiv.appendChild(mouseoverLabel);
        mouseoverDiv.style.top = (event.pageY + 5) + "px";
        mouseoverDiv.style.left = (event.pageX + 5) + "px";
        $("body").append(mouseoverDiv);
    };

    this.handleLabelOnmouseout = function(event) {
        $(".popup-div").remove();
    };
};
//Global variables

var myGame = new game();

//Game loop

$(document).ready(function() {
    myGame.tick();
});

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