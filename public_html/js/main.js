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
    this.boosts = initializeBoosts(this);
    this.stockEntities = initializeStockEntities(this);
    this.upgrades = initializeUpgrades(this);
    this.time = 0;

    this.handleTick = function() {
        this.resources.map(function(resource) {
            resource.handleTick();
            resource.updateLabel();
        });
        if (this.time % STOCK_UPDATE_INTERVAL === 0) {
            this.stockEntities.map(function(stock) {
                stock.handleTick();
                stock.updatePrice();
            });
        }

        if (this.time % SAVE_INTERVAL === 0) {
            //saveGame();
        }

        this.time++;
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
            if (item instanceof boost) {
                item.setBoostStatus(true);
            }

            if (item instanceof stockEntity) {
                item.increaseAmountOwned();
            }

            this.updateResourceIncrements();
        }
    };

    this.handleItemSell = function(item) {
        if (item.amountOwned > 0) {
            for (var i = 0; i < 4; i++) {
                this.resources[i].amount += item.prices[i];
            }
            if (item instanceof stockEntity) {
                item.decreaseAmountOwned();
            }
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
        this.boosts.map(function(boost) {
            if (boost.isEnabled) {
                boost.resourceTarget.increasePerClick *= 1 + boost.boostPercentPerClick;
                boost.resourceTarget.increasePerSecond *= 1 + boost.boostPercentPerSecond;
            }
        });
    }.bind(this);


};

var building = function(name, description) {
    this.name = name;
    this.description = description;
    this.amountOwned = 0;
    this.basePrices = [0, 0, 0, 0];
    this.prices = this.basePrices;
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
        this.increasePerClick = this.baseIncreasePerClick * this.increasePerClickMultiplier;
        this.increasePerSecond = this.baseIncreasePerSecond * this.increasePerSecondMultiplier;

        //update label

        this.productionLabelIcon = getResourceGlyphicon(this.resourceTarget.name);
        this.productionLabel.innerHTML =
                ((this.increasePerClick > 0) ? "+<span class='glyphicon glyphicon-" + this.productionLabelIcon + "'></span>" + formatNumber(this.increasePerClick, 2) + "/click<br/>" : "") +
                ((this.increasePerSecond > 0) ? "+<span class='glyphicon glyphicon-" + this.productionLabelIcon + "'></span>" + formatNumber(this.increasePerSecond, 2) + "/second" : "")
                ;
    };

    this.updatePrices = function() {
        for (var i = 0; i < 4; i++) {
            this.prices[i] = this.basePrices[i] * Math.pow(this.priceMultiplier, this.amountOwned);
        }
        this.updateUI();
    };

    this.increaseAmountOwned = function() {
        this.amountOwned++;
        this.updatePrices();
    };

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
        this.updatePrices();
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

    this.updateUI = function() {
        this.label.innerHTML = this.name + " <span class='badge'>" + this.amountOwned + "</span>";
        this.priceLabel.innerHTML =
                ((this.prices[0] > 0) ? "<span class='glyphicon glyphicon-usd'></span>" + formatNumber(this.prices[0], 2) + "<br/>" : "") +
                ((this.prices[1] > 0) ? "<span class='glyphicon glyphicon-globe'></span>" + formatNumber(this.prices[1, 2]) + "<br/>" : "") +
                ((this.prices[2] > 0) ? "<span class='glyphicon glyphicon-user'></span>" + formatNumber(this.prices[2], 2) + "<br/>" : "") +
                ((this.prices[3] > 0) ? "<span class='glyphicon glyphicon-screenshot'></span>" + formatNumber(this.prices[3], 2) : "");
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

        $("#" + this.upgradeCategory + " > .table-striped").append(this.tableRow);
    };

    this.updateUI = function() {
        if (this.hasPurchased === true) {
            this.disablePurchase();
        }
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

    this.getResourceTarget = function() {
        return building.resourceTarget.name;
    };

    this.getProductionLabelInnerHTML = function(icon) {
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
    this.baseXpNextLevel = 0;
    this.xpNextLevel = this.baseXpNextLevel;
    this.xpReward = 3;
    this.xpNextLevelMultiplier = 1.3;
    this.currentTime = 0;
    this.resetTime = 0;
    this.baseResetTime = 0;
    this.resetTimeMultiplier = 1;
    this.resourceTarget = null;
    this.rewardAmount = this.baseRewardAmount;
    this.baseRewardAmount = 0;
    this.rewardAmountMultiplier = 1;
    this.rewardAmountLevelUpMultiplier = 1.5;
    this.imgPath = "";

    this.updateRewardAndResetTime = function() {
        this.resetTime = Math.round(this.baseResetTime * this.resetTimeMultiplier);
        this.rewardAmount = this.baseRewardAmount * Math.pow(this.rewardAmountLevelUpMultiplier, this.level);

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
            this.resetTime = this.baseResetTime * this.resetTimeMultiplier;
            this.currentTime = this.resetTime;
            //set button label
            this.button.innerHTML = "<span class='glyphicon glyphicon-time'></span> " + formatTime(this.currentTime);
            //rewards
            this.rewardAmount = this.baseRewardAmount * Math.pow(this.rewardAmountLevelUpMultiplier, this.level);
            this.resourceTarget.amount += this.rewardAmount;
            console.log(this.resourceTarget.amount);

            //xp stuff
            var xpSum = this.xp + this.xpReward;
            this.xpNextLevel = this.baseXpNextLevel * Math.pow(this.xpNextLevelMultiplier, this.level);
            this.xp = xpSum % this.xpNextLevel;
            if (xpSum >= this.xpNextLevel) {
                this.level++;
                this.xpNextLevel *= this.xpNextLevelMultiplier;
                this.rewardAmount = this.baseRewardAmount * Math.pow(this.rewardAmountLevelUpMultiplier, this.level);

                //adjust rewards td
                this.productionLabel.innerHTML = "+<span class='glyphicon glyphicon-" + this.productionLabelIcon + "'></span>" + formatNumber(this.rewardAmount, 2);
            }
            this.updateUI();

            //countdown
            this.startCountDown();
        }
    };

    this.startCountDown = function() {
        this.counter = setInterval(this.countdownTimer, 1000);
    };

    //bind to "this" because it gets called from with setInterval()
    this.countdownTimer = function() {
        if (this.currentTime > 0) {
            this.currentTime = (this.currentTime >= 1) ? this.currentTime - 1 : 0;
            this.button.innerHTML = "<span class='glyphicon glyphicon-time'></span> " + formatTime(this.currentTime);
        }
        if (this.currentTime === 0) {
            clearInterval(this.counter);
            this.currentTime = 0;
            this.button.innerHTML = "Do job";
        }

    }.bind(this);

    this.updateUI = function() {
        //adjust rewards td
        this.rewardAmount = this.baseRewardAmount * Math.pow(this.rewardAmountLevelUpMultiplier, this.level);
        this.productionLabel.innerHTML = "+<span class='glyphicon glyphicon-" + this.productionLabelIcon + "'></span>" + formatNumber(this.rewardAmount, 2);

        this.xpNextLevel = this.baseXpNextLevel * Math.pow(this.xpNextLevelMultiplier, this.level);
        this.levelLabel.innerHTML = "Level: " + this.level;
        this.progressBarDiv.setAttribute("aria-valuenow", formatNumber(this.xp, 0));
        this.progressBarDiv.style.width = ((this.xp / this.xpNextLevel) * 100) + "%";
        this.progressBarDiv.innerHTML = formatNumber(this.xp, 0) + "/" + formatNumber(this.xpNextLevel, 0);
    };
};

var jobUpgradeEffect = function(job) {
    this.jobTarget = job;
    this.flatResetTimeReduction = 0;
    this.flatResourceRewardIncrease = 0;
    this.percentResetTimeReduction = 0;
    this.percentResourceRewardIncrease = 0;

    this.applyUpgrade = function() {
        this.jobTarget.baseRewardAmount += this.flatResourceRewardIncrease;
        this.jobTarget.baseResetTime -= this.flatResetTimeReduction;
        this.jobTarget.rewardAmountMultiplier += this.percentResourceRewardIncrease;
        this.jobTarget.resetTimeMultiplier -= this.percentResetTimeReduction;

        this.jobTarget.updateRewardAndResetTime();
    };

    this.getResourceTarget = function() {
        return this.jobTarget.resourceTarget.name;
    };

    this.getProductionLabelInnerHTML = function(icon) {
        var innerHTML =
                ((this.flatResetTimeReduction > 0) ? "-<span class='glyphicon glyphicon-time'></span>" + formatTime(this.flatResetTimeReduction) + " cooldown<br/>" : "") +
                ((this.flatResourceRewardIncrease > 0) ? "+<span class='glyphicon glyphicon-" + icon + "'></span>" + formatNumber(this.flatResourceRewardIncrease, 2) + "/job" : "") +
                ((this.percentResetTimeReduction > 0) ? "-<span class='glyphicon glyphicon-time'></span>" + formatNumber((this.percentResetTimeReduction) * 100, 2) + "% cooldown<br/>" : "") +
                ((this.percentResourceRewardIncrease > 0) ? "+<span class='glyphicon glyphicon-" + icon + "'></span>" + formatNumber((this.percentResourceRewardIncrease) * 100, 2) + "%/jobs" : "");
        return innerHTML;
    };
};

var boost = function(name, description) {
    this.name = name;
    this.description = description;
    this.baseBoostDuration = 0;
    this.boostDuration = 0;
    this.boostDurationMultiplier = 1;
    this.currentBoostTime = 0;
    this.baseBoostPercentPerClick = 0;
    this.boostPercentPerClick = 0;
    this.boostPercentPerClickMultiplier = 1;
    this.baseBoostPercentPerSecond = 0;
    this.boostPercentPerSecond = 0;
    this.boostPercentPerSecondMultiplier = 1;
    this.isEnabled = false;
    this.prices = [20, 0, 10, 10];
    this.resourceTarget = null;
    this.imgPath = "";
    this.counter = null;
    this.listener = null;
    this.fireUpdate = function() {
        this.listener.handleItemBuy(this);
    };

    this.updateRewardAndBoostDuration = function() {
        this.boostDuration = Math.round(this.baseBoostDuration * this.boostDurationMultiplier);
        this.boostPercentPerClick = this.baseBoostPercentPerClick * this.boostPercentPerClickMultiplier;
        this.boostPercentPerSecond = this.baseBoostPercentPerSecond * this.boostPercentPerSecondMultiplier;

        this.productionLabel.innerHTML =
                "Duration: " + formatTime(this.boostDuration) + "<br/><br/>" +
                ((this.boostPercentPerClick > 0) ? "+<span class='glyphicon glyphicon-" + this.productionLabelIcon + "'></span>" + formatNumber(this.boostPercentPerClick * 100, 2) + "%/click" : "") +
                ((this.boostPercentPerSecond > 0) ? "+<span class='glyphicon glyphicon-" + this.productionLabelIcon + "'></span>" + formatNumber(this.boostPercentPerSecond * 100, 2) + "%/second" : "")
                ;
    };

    this.setBoostStatus = function(isActive) {
        this.isEnabled = isActive;
        this.button.disabled = isActive;

        if (isActive) {
            this.currentBoostTime = this.boostDuration;
            this.startCountDownTimer();
        }
        if (!isActive) {
            this.listener.updateResourceIncrements();
        }

        this.updateBoostTimeBar();
    };
    
    this.disableButton = function(){
        this.button.disabled = true;
    };

    this.startCountDownTimer = function() {
        this.counter = setInterval(this.countdownTimer, 1000);
    };

    this.countdownTimer = function() {
        if (this.currentBoostTime > 0) {
            this.currentBoostTime--;
        }
        if (this.currentBoostTime === 0) {
            clearInterval(this.counter);
            this.setBoostStatus(false);
        }
        this.updateBoostTimeBar();

    }.bind(this);

    this.initializeUI = function() {

        this.tableRow = document.createElement("tr");

        this.boostLabel = document.createElement("p");
        this.boostLabel.innerHTML = this.name;
        this.boostLabel.addEventListener("mousemove", function(event) {
            this.handleLabelOnmouseover(event);
        }.bind(this), false);
        this.boostLabel.addEventListener("mouseout", function(event) {
            this.handleLabelOnmouseout(event);
        }.bind(this), false);

        this.priceLabel = document.createElement("p");
        this.priceLabel.innerHTML =
                ((this.prices[0] > 0) ? "<span class='glyphicon glyphicon-usd'></span>" + formatNumber(this.prices[0], 2) + "<br/>" : "") +
                ((this.prices[1] > 0) ? "<span class='glyphicon glyphicon-globe'></span>" + formatNumber(this.prices[1], 2) + "<br/>" : "") +
                ((this.prices[2] > 0) ? "<span class='glyphicon glyphicon-user'></span>" + formatNumber(this.prices[2], 2) + "<br/>" : "") +
                ((this.prices[3] > 0) ? "<span class='glyphicon glyphicon-screenshot'></span>" + formatNumber(this.prices[3], 2) : "");

        this.boostTimeDivWrapper = document.createElement("div");
        this.boostTimeDivWrapper.setAttribute("class", "progress progress-striped active");
        this.boostTimeDivWrapper.style.minWidth = "300px";
        this.boostTimeBarDiv = document.createElement("div");
        this.boostTimeBarDiv.setAttribute("class", "progress-bar");
        this.boostTimeBarDiv.setAttribute("role", "progressbar");
        this.boostTimeBarDiv.setAttribute("aria-valuenow", this.currentBoostTime);
        this.boostTimeBarDiv.setAttribute("aria-valuemin", 0);
        this.boostTimeBarDiv.setAttribute("aria-valuemax", this.boostDuration);
        this.boostTimeBarDiv.style.width = ((this.currentBoostTime / this.boostDuration) * 100) + "%";
        this.boostTimeBarDiv.innerHTML = formatTime(this.currentBoostTime);
        this.boostTimeDivWrapper.appendChild(this.boostTimeBarDiv);

        this.productionLabel = document.createElement("p");
        this.productionLabelIcon = getResourceGlyphicon(this.resourceTarget.name);
        this.updateRewardAndBoostDuration();

        this.button = document.createElement("button");
        this.button.setAttribute("class", "btn btn-default");
        this.button.innerHTML = "Buy boost";
        this.button.addEventListener("click", function(event) {
            this.handleButtonClick(event);
        }.bind(this), false);


        this.tableRow.appendChild(document.createElement("td")).appendChild(this.boostLabel);
        this.tableRow.appendChild(document.createElement("td")).appendChild(this.boostTimeDivWrapper);
        this.tableRow.appendChild(document.createElement("td")).appendChild(this.productionLabel);
        this.tableRow.appendChild(document.createElement("td")).appendChild(this.priceLabel);
        this.tableRow.appendChild(document.createElement("td")).appendChild(this.button);

        $("#boosts > .table-striped").append(this.tableRow);
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
        this.fireUpdate();
    };

    this.updateBoostTimeBar = function() {
        this.boostTimeBarDiv.setAttribute("aria-valuenow", this.currentBoostTime);
        this.boostTimeBarDiv.style.width = ((this.currentBoostTime / this.boostDuration) * 100) + "%";
        this.boostTimeBarDiv.innerHTML = formatTime(this.currentBoostTime);
    };

};

var boostUpgradeEffect = function(upgrade) {
    this.boostTarget = upgrade;
    this.percentBoostTimeIncrease = 0;
    this.percentResourcePerClickIncrease = 0;
    this.percentResourcePerSecondIncrease = 0;

    this.applyUpgrade = function() {
        this.boostTarget.boostDurationMultiplier += this.percentBoostTimeIncrease;
        this.boostTarget.boostPercentPerClickMultiplier += this.percentResourcePerClickIncrease;
        this.boostTarget.boostPercentPerSecondMultiplier += this.percentResourcePerSecondIncrease;

        this.boostTarget.updateRewardAndBoostDuration();
    };

    this.getResourceTarget = function() {
        return this.boostTarget.resourceTarget.name;
    };

    this.getProductionLabelInnerHTML = function(icon) {
        var innerHTML =
                ((this.percentBoostTimeIncrease > 0) ? "+<span class='glyphicon glyphicon-time'></span>" + formatNumber((this.percentBoostTimeIncrease * 100), 2) + "% boost duration<br/>" : "") +
                ((this.percentResourcePerClickIncrease > 0) ? "+<span class='glyphicon glyphicon-" + icon + "'></span>" + formatNumber((this.percentResourcePerClickIncrease) * 100, 2) + "%<br/>" : "") +
                ((this.percentResourcePerSecondIncrease > 0) ? "+<span class='glyphicon glyphicon-" + icon + "'></span>" + formatNumber((this.percentResourcePerSecondIncrease) * 100, 2) + "%" : "")
                ;
        return innerHTML;
    };

};

var stockEntity = function() {
    this.name = "";
    this.description = "";
    this.prices = [0, 0, 0, 0];
    this.amountOwned = 0;
    this.floorCap = 0;
    this.ceilingCap = 0;
    this.randIncrement = 0.00;
    this.listener = null;
    this.fireBuyUpdate = function() {
        this.listener.handleItemBuy(this);
    };

    this.fireSellUpdate = function() {
        this.listener.handleItemSell(this);
    };

    this.handleTick = function() {
        var newPrice = this.prices[0] * (1 + (Math.random() > 0.50 ? -1 : 1) * this.randIncrement);
        this.prices[0] = (newPrice <= this.ceilingCap && newPrice >= this.floorCap) ? newPrice : this.prices[0];
    };

    this.initializeUI = function() {

        this.tableRow = document.createElement("tr");

        this.stockLabel = document.createElement("p");
        this.stockLabel.innerHTML = this.name;
        this.stockLabel.addEventListener("mousemove", function(event) {
            this.handleLabelOnmouseover(event);
        }.bind(this), false);
        this.stockLabel.addEventListener("mouseout", function(event) {
            this.handleLabelOnmouseout(event);
        }.bind(this), false);

        this.priceLabel = document.createElement("p");
        this.priceLabel.innerHTML = "<span class='glyphicon glyphicon-usd'></span>" + formatNumber(this.prices[0], 2) + "<br/>";

        this.ownedLabel = document.createElement("p");
        this.ownedLabel.innerHTML = this.amountOwned;

        this.buyButton = document.createElement("button");
        this.buyButton.setAttribute("class", "btn btn-default");
        this.buyButton.innerHTML = "Buy stock";
        this.buyButton.addEventListener("click", function(event) {
            this.fireBuyUpdate(event);
        }.bind(this), false);

        this.sellButton = document.createElement("button");
        this.sellButton.setAttribute("class", "btn btn-default");
        this.sellButton.innerHTML = "Sell stock";
        this.sellButton.addEventListener("click", function(event) {
            this.fireSellUpdate(event);
        }.bind(this), false);


        this.tableRow.appendChild(document.createElement("td")).appendChild(this.stockLabel);
        this.tableRow.appendChild(document.createElement("td")).appendChild(this.priceLabel);
        this.tableRow.appendChild(document.createElement("td")).appendChild(this.ownedLabel);
        this.tableRow.appendChild(document.createElement("td")).appendChild(this.buyButton);
        this.tableRow.appendChild(document.createElement("td")).appendChild(this.sellButton);

        $("#stockmarket > .table-striped").append(this.tableRow);
    };

    this.updatePrice = function() {
        this.priceLabel.innerHTML = "<span class='glyphicon glyphicon-usd'></span>" + formatNumber(this.prices[0], 2) + "<br/>";
    };

    this.updateOwned = function() {
        this.ownedLabel.innerHTML = this.amountOwned;
    };

    this.increaseAmountOwned = function() {
        this.amountOwned++;
        this.updateOwned();
    };

    this.decreaseAmountOwned = function() {
        this.amountOwned--;
        this.updateOwned();
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
};

//Global variables

var myGame = null;
var STOCK_UPDATE_INTERVAL = 3;
var SAVE_INTERVAL = 5;

//Loading and saving

function saveGame() {
    if (typeof (Storage) !== "undefined") {
        localStorage.clear();
        localStorage.setItem("savedState", true);

        //Resources
        myGame.resources.map(function(resource) {
            localStorage.setItem(resource.name + "Amount", resource.amount);
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
//        localStorage.setItem("buildings",JSON.stringify(myGame.buildings));
//        localStorage.setItem("jobs",JSON.stringify(myGame.jobs));
//        localStorage.setItem("boosts",JSON.stringify(myGame.boosts));
//        localStorage.setItem("upgrades",JSON.stringify(myGame.upgrades));
//        localStorage.setItem("stockEntities",JSON.stringify(myGame.stockEntities));
//        localStorage.setItem("time",JSON.stringify(myGame.time));
    } else {
        // Sorry! No Web Storage support..
    }
}
;

function loadGame() {
    if (typeof (Storage) !== "undefined") {
        myGame = new game();
        if (localStorage.getItem("savedState") !== null) {
            //Resources
            myGame.resources.map(function(resource) {
                resource.amount = parseFloat(localStorage.getItem(resource.name + "Amount"));
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

            myGame.updateResourceIncrements();
        }

    } else {
        // Sorry! No Web Storage support..
    }
}
;

//Game loop

$(document).ready(function() {
    loadGame();
    myGame.tick();
});