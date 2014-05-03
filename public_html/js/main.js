//Prototypes

var resource = function(name) {
    this.name = name;
    this.amount = 0;
    this.increasePerSecond = 0;
    this.increasePerClick = 0;
    this.iconClassName = getResourceGlyphicon(this.name);

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
        this.button.innerHTML = '<span class="glyphicon glyphicon-' + this.iconClassName + '"></span> ' + this.name + "<br/>" + formatNumber(this.amount, 3);
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
        this.button.innerHTML = '<span class="glyphicon glyphicon-' + this.iconClassName + '"></span> ' + this.name + "<br/>" + formatNumber(this.amount, 3);
    };
};

var game = function() {
    this.resources = initializeResources(this);
    this.buildings = initializeBuildings(this);
    this.jobs = initializeJobs(this);
    this.upgrades = initializeUpgrades(this);
    

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
    this.baseIncreasePerClick = 0;
    this.increasePerSecond = 0;
    this.baseIncreasePerSecond = 0;
    this.increasePerClickMultiplier = 1;
    this.increasePerSecondMultiplier = 1;
    this.hasPurchased = false;
    this.imgPath = "";
    this.listener = null;
    this.fireUpdate = function() {
        this.listener.handleItemBuy(this);
    };

    this.updateProduction = function() {
        //recalcutate after multiplier
        this.increasePerClick = this.baseIncreasePerClick*this.increasePerClickMultiplier;
        this.increasePerSecond = this.baseIncreasePerSecond*this.increasePerSecondMultiplier;
        
        //update label
        
        this.productionLabelIcon = getResourceGlyphicon(this.resourceTarget.name);
        this.productionLabel.innerHTML =
                ((this.increasePerClick > 0) ? "+<span class='glyphicon glyphicon-" + this.productionLabelIcon + "'></span>" + formatNumber(this.increasePerClick, 2) + "/click<br/>" : "") +
                ((this.increasePerSecond > 0) ? "+<span class='glyphicon glyphicon-" + this.productionLabelIcon + "'></span>" + formatNumber(this.increasePerSecond, 2) + "/second" : "")
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
        this.updateProduction();
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
    this.upgradeCategory = "";
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
            this.handleLabelOnmouseout(event);
        }.bind(this), false);
        this.priceLabel = document.createElement("p");
        this.priceLabel.innerHTML =
                ((this.prices[0] > 0) ? "<span class='glyphicon glyphicon-usd'></span>" + formatNumber(this.prices[0], 2) + "<br/>" : "") +
                ((this.prices[1] > 0) ? "<span class='glyphicon glyphicon-globe'></span>" + formatNumber(this.prices[1], 2) + "<br/>" : "") +
                ((this.prices[2] > 0) ? "<span class='glyphicon glyphicon-user'></span>" + formatNumber(this.prices[2], 2) + "<br/>" : "") +
                ((this.prices[3] > 0) ? "<span class='glyphicon glyphicon-screenshot'></span>" + formatNumber(this.prices[3], 2) : "");
        this.productionLabel = document.createElement("p");
        this.productionLabelIcon = getResourceGlyphicon(this.upgradeEffect.getResourceTarget());
        this.productionLabel.innerHTML = this.upgradeEffect.getProductionLabelInnerHTML(this.productionLabelIcon);
        
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

        $("#"+this.upgradeCategory+" > .table-striped").append(this.tableRow);
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

var buildingUpgradeEffect = function(building) {
    this.buildingTarget = building;
    this.flatPerClickIncrement = 0;
    this.flatPerSecondIncrement = 0;
    this.percentPerClickIncrement = 0;
    this.percentPerSecondIncrement = 0;

    this.applyUpgrade = function() {
        this.buildingTarget.baseIncreasePerClick += this.flatPerClickIncrement;
        this.buildingTarget.baseIncreasePerSecond += this.flatPerSecondIncrement;
        this.buildingTarget.increasePerClickMultiplier += this.percentPerClickIncrement;
        this.buildingTarget.increasePerSecondMultiplier += this.percentPerSecondIncrement;

        this.buildingTarget.updateProduction();
    };
    
    this.getResourceTarget = function(){
        return building.resourceTarget.name;
    };
    
    this.getProductionLabelInnerHTML = function(icon){
        var innerHtml =
                ((this.flatPerClickIncrement > 0) ? "+<span class='glyphicon glyphicon-" + icon + "'></span>" + formatNumber(this.flatPerClickIncrement, 2) + "/click<br/>" : "") +
                ((this.flatPerSecondIncrement > 0) ? "+<span class='glyphicon glyphicon-" + icon + "'></span>" + formatNumber(this.flatPerSecondIncrement, 2) + "/second" : "") +
                ((this.percentPerClickIncrement > 0) ? "+<span class='glyphicon glyphicon-" + icon + "'></span>" + formatNumber((this.percentPerClickIncrement) * 100, 2) + "%/click<br/>" : "") +
                ((this.percentPerSecondIncrement > 0) ? "+<span class='glyphicon glyphicon-" + icon + "'></span>" + formatNumber((this.percentPerSecondIncrement) * 100, 2) + "%/second" : "");
        return innerHtml;
    };

};

var job = function(name, description) {
    this.name = name;
    this.description = description;
    this.xp = 0;
    this.level = 0;
    this.xpNextLevel = 10;
    this.xpReward = 3;
    this.xpNextLevelMultiplier = 1.3;
    this.currentTime = 0;
    this.resetTime = 0;
    this.baseResetTime = 0;
    this.resetTimeMultiplier = 1;
    this.resourceTarget = null;
    this.rewardAmount = 0;
    this.baseRewardAmount = 0;
    this.rewardAmountMultiplier = 1;
    this.rewardAmountLevelUpMultiplier = 1.5;
    this.imgPath = "";

    this.updateRewardAndResetTime = function(){
        this.resetTime = Math.round(this.baseResetTime*this.resetTimeMultiplier);
        this.rewardAmount = this.baseRewardAmount*this.rewardAmountMultiplier;
        
        this.productionLabel.innerHTML = "+<span class='glyphicon glyphicon-" + this.productionLabelIcon + "'></span>" + formatNumber(this.rewardAmount, 2);
    };

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
        this.levelLabel.innerHTML = "Level: " + this.level;

        this.progressDivWrapper = document.createElement("div");
        this.progressDivWrapper.setAttribute("class", "progress progress-striped active");
        this.progressDivWrapper.style.minWidth = "300px";
        this.progressDivWrapper.appendChild(this.levelLabel);
        this.progressBarDiv = document.createElement("div");
        this.progressBarDiv.setAttribute("class", "progress-bar");
        this.progressBarDiv.setAttribute("role", "progressbar");
        this.progressBarDiv.setAttribute("aria-valuenow", this.xp);
        this.progressBarDiv.setAttribute("aria-valuemin", 0);
        this.progressBarDiv.setAttribute("aria-valuemax", this.xpNextLevel);
        this.progressBarDiv.style.width = ((this.xp / this.xpNextLevel) * 100) + "%";
        this.progressBarDiv.innerHTML = formatNumber(this.xp, 0) + "/" + formatNumber(this.xpNextLevel, 0);
        this.progressDivWrapper.appendChild(this.progressBarDiv);

        this.productionLabel = document.createElement("p");
        this.productionLabelIcon = getResourceGlyphicon(this.resourceTarget.name);
        this.productionLabel.innerHTML = "+<span class='glyphicon glyphicon-" + this.productionLabelIcon + "'></span>" + formatNumber(this.baseRewardAmount, 2);


        this.button = document.createElement("button");
        this.button.innerHTML = "Do job";
        this.button.addEventListener("click", function(event) {
            this.handleButtonClick(event);
        }.bind(this), false);


        this.tableRow.appendChild(document.createElement("td")).appendChild(this.jobLabel);
        this.tableRow.appendChild(document.createElement("td")).appendChild(this.levelLabel);
        this.tableRow.lastChild.appendChild(this.progressDivWrapper);
        this.tableRow.appendChild(document.createElement("td")).appendChild(this.productionLabel);
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

    this.handleLabelOnmouseout = function() {
        $(".popup-div").remove();
    };

    this.handleButtonClick = function() {
        //TODO check if job available
        if (this.currentTime === 0) {
            //reset time
            this.resetTime = this.baseResetTime*this.resetTimeMultiplier;
            this.currentTime = this.resetTime;
            //set button label
            this.button.innerHTML = "<span class='glyphicon glyphicon-time'></span> "+formatTime(this.currentTime);
            //rewards
            this.resourceTarget.amount += this.rewardAmount;

            //xp stuff
            var xpSum = this.xp + this.xpReward;
            this.xp = xpSum % this.xpNextLevel;
            if (xpSum >= this.xpNextLevel) {
                this.level++;
                this.xpNextLevel *= this.xpNextLevelMultiplier;
                this.baseRewardAmount *= this.rewardAmountLevelUpMultiplier;
                this.rewardAmount = this.baseRewardAmount*this.rewardAmountMultiplier;

                //adjust rewards td
                this.productionLabel.innerHTML = "+<span class='glyphicon glyphicon-" + this.productionLabelIcon + "'></span>" + formatNumber(this.rewardAmount, 2);
            }
            this.updateProgressBar();

            //countdown
            this.counter = setInterval(this.countdownTimer, 1000);
        }
    };

    //bind to "this" because it gets called from with setInterval()
    this.countdownTimer = function() {
        if (this.currentTime > 0) {
            this.currentTime--;
            this.button.innerHTML = "<span class='glyphicon glyphicon-time'></span> "+formatTime(this.currentTime);
        }
        if (this.currentTime === 0) {
            clearInterval(this.counter);
            this.currentTime = 0;
            this.button.innerHTML = "Do job";
        }

    }.bind(this);

    this.updateProgressBar = function() {
        this.levelLabel.innerHTML = "Level: " + this.level;
        this.progressBarDiv.setAttribute("aria-valuenow", formatNumber(this.xp, 0));
        this.progressBarDiv.style.width = ((this.xp / this.xpNextLevel) * 100) + "%";
        this.progressBarDiv.innerHTML = formatNumber(this.xp, 0) + "/" + formatNumber(this.xpNextLevel, 0);
    };
};

var jobUpgradeEffect = function(job){
    this.jobTarget = job;
    this.flatResetTimeReduction = 0;
    this.flatResourceRewardIncrease = 0;
    this.percentResetTimeReduction = 0;
    this.percentResourceRewardIncrease = 0;
    
    this.applyUpgrade = function(){
        this.jobTarget.baseRewardAmount += this.flatResourceRewardIncrease;
        this.jobTarget.baseResetTime -= this.flatResetTimeReduction;
        this.jobTarget.rewardAmountMultiplier += this.percentResourceRewardIncrease;
        this.jobTarget.resetTimeMultiplier -= this.percentResetTimeReduction;
        
        this.jobTarget.updateRewardAndResetTime();
    };
    
    this.getResourceTarget = function(){
        return this.jobTarget.resourceTarget.name;
    };
    
    this.getProductionLabelInnerHTML = function(icon){
        var innerHTML =
                ((this.flatResetTimeReduction > 0) ? "-<span class='glyphicon glyphicon-time'></span>" + formatTime(this.flatResetTimeReduction) + "/click<br/>" : "") +
                ((this.flatResourceRewardIncrease > 0) ? "+<span class='glyphicon glyphicon-" + icon + "'></span>" + formatNumber(this.flatResourceRewardIncrease, 2) + "/job" : "") +
                ((this.percentResetTimeReduction > 0) ? "-<span class='glyphicon glyphicon-time'></span>" + formatNumber((this.percentResetTimeReduction) * 100, 2) + "%<br/>" : "") +
                ((this.percentResourceRewardIncrease > 0) ? "+<span class='glyphicon glyphicon-" + icon + "'></span>" + formatNumber((this.percentResourceRewardIncrease) * 100, 2) + "%/jobs" : "");
        return innerHTML;
    };
};

//Global variables

var myGame = new game();

//Game loop

$(document).ready(function() {
    myGame.tick();
});