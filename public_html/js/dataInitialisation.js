/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function initializeResources() {
    var output = [];

    var moneyResource = new resource("Money");
    moneyResource.increasePerClick = 14567891230;
    moneyResource.increasePerSecond = 1;
    moneyResource.iconClassName = "glyphicon glyphicon-usd";
    output.push(moneyResource);

    var politicalResource = new resource("Political power");
    politicalResource.increasePerClick = 10;
    politicalResource.increasePerSecond = 1;
    politicalResource.iconClassName = "glyphicon glyphicon-globe";
    output.push(politicalResource);

    var socialResource = new resource("Social influence");
    socialResource.increasePerClick = 10;
    socialResource.increasePerSecond = 1;
    socialResource.iconClassName = "glyphicon glyphicon-user";
    output.push(socialResource);

    var criminalResource = new resource("Criminal power");
    criminalResource.increasePerClick = 10;
    criminalResource.increasePerSecond = 1;
    criminalResource.iconClassName = "glyphicon glyphicon-screenshot";
    output.push(criminalResource);

    output.map(function(item) {
        item.initializeUI();
    });

    return output;
}

function initializeBuildings(game) {
    var output = [];

    var hotdogstandBuilding = new building("Hotdog stand", "Who doesn't like a greasy hotdog?");
    hotdogstandBuilding.imgPath = "img/placeholder.png";
    hotdogstandBuilding.listener = game;
    hotdogstandBuilding.resourceTarget = game.resources[0];
    hotdogstandBuilding.prices = [30, 2, 3, 0];
    hotdogstandBuilding.baseIncreasePerSecond = 10;
    hotdogstandBuilding.baseIncreasePerClick = 10;
    output.push(hotdogstandBuilding);

    var icecreamBuilding = new building("Icecream stand", "Mmm, icecream!");
    icecreamBuilding.imgPath = "img/placeholder.png";
    icecreamBuilding.listener = game;
    icecreamBuilding.resourceTarget = game.resources[1];
    icecreamBuilding.prices = [5, 20, 3, 2];
    icecreamBuilding.baseIncreasePerSecond = 10;
    icecreamBuilding.baseIncreasePerClick = 0;
    output.push(icecreamBuilding);

    var waynetowersBuilding = new building("Wayne Towers", "Somebody has to pay for the batmobile!");
    waynetowersBuilding.imgPath = "img/placeholder.png";
    waynetowersBuilding.listener = game;
    waynetowersBuilding.resourceTarget = game.resources[3];
    waynetowersBuilding.prices = [500, 200, 330, 222];
    waynetowersBuilding.baseIncreasePerSecond = 0;
    waynetowersBuilding.baseIncreasePerClick = 100;
    output.push(waynetowersBuilding);

    var mallBuilding = new building("Mall", "Let's go to the mall, today!");
    mallBuilding.imgPath = "img/placeholder.png";
    mallBuilding.listener = game;
    mallBuilding.resourceTarget = game.resources[2];
    mallBuilding.prices = [100, 200, 300, 400];
    mallBuilding.baseIncreasePerSecond = 5000;
    mallBuilding.baseIncreasePerClick = 5000;
    output.push(mallBuilding);

    var piramidBuilding = new building("Great Pyramid of Giza", "Mausoleum, RETI style!");
    piramidBuilding.imgPath = "img/placeholder.png";
    piramidBuilding.listener = game;
    piramidBuilding.resourceTarget = game.resources[3];
    piramidBuilding.prices = [1000, 2000, 3000, 4000];
    piramidBuilding.baseIncreasePerSecond = 1234567;
    piramidBuilding.baseIncreasePerClick = 1234567;
    output.push(piramidBuilding);

    output.map(function(item) {
        item.initializeUI();
    });

    return output;
}

var initializeUpgrades = function(game) {
    var output = [];

    //Ice cream stand upgrades

    //Click upgrads

    var icecreamStandFlatClickUpgrade1 = new upgrade("Icecream stand refrigerator upgrade", "More ice, more coolness!");
    icecreamStandFlatClickUpgrade1.imgPath = "img/placeholder.png";
    icecreamStandFlatClickUpgrade1.listener = game;
    icecreamStandFlatClickUpgrade1.prices = [1, 2, 3, 4];
    icecreamStandFlatClickUpgrade1.upgradeCategory = "buildingsUpgrades";
    icecreamStandFlatClickUpgrade1.upgradeEffect = new buildingUpgradeEffect(game.buildings[1]);
    icecreamStandFlatClickUpgrade1.upgradeEffect.flatPerClickIncrement = 10;
    icecreamStandFlatClickUpgrade1.upgradeEffect.flatPerSecondIncrement = 10;
    output.push(icecreamStandFlatClickUpgrade1);

    var icecreamStandFlatClickUpgrade2 = new upgrade("Icecream stand refrigerator upgrade 2", "Ice, anybody?");
    icecreamStandFlatClickUpgrade2.imgPath = "img/placeholder.png";
    icecreamStandFlatClickUpgrade2.listener = game;
    icecreamStandFlatClickUpgrade2.prices = [1, 2, 3, 4];
    icecreamStandFlatClickUpgrade2.upgradeCategory = "buildingsUpgrades";
    icecreamStandFlatClickUpgrade2.upgradeEffect = new buildingUpgradeEffect(game.buildings[1]);
    icecreamStandFlatClickUpgrade2.upgradeEffect.flatPerClickIncrement = 100;
    output.push(icecreamStandFlatClickUpgrade2);

    var icecreamStandPercentageClickUpgrade1 = new upgrade("Icecream stand marketing revamp", "Mo' clients, mo' moneyz");
    icecreamStandPercentageClickUpgrade1.imgPath = "img/placeholder.png";
    icecreamStandPercentageClickUpgrade1.listener = game;
    icecreamStandPercentageClickUpgrade1.prices = [1, 2, 3, 4];
    icecreamStandPercentageClickUpgrade1.upgradeCategory = "buildingsUpgrades";
    icecreamStandPercentageClickUpgrade1.upgradeEffect = new buildingUpgradeEffect(game.buildings[1]);
    icecreamStandPercentageClickUpgrade1.upgradeEffect.percentPerClickIncrement = 0.05;
    output.push(icecreamStandPercentageClickUpgrade1);

    var icecreamStandPercentageClickUpgrade2 = new upgrade("Icecream stand marketing revamp 2", "Mo' clients, mo' moneyz");
    icecreamStandPercentageClickUpgrade2.imgPath = "img/placeholder.png";
    icecreamStandPercentageClickUpgrade2.listener = game;
    icecreamStandPercentageClickUpgrade2.prices = [1, 2, 3, 4];
    icecreamStandPercentageClickUpgrade2.upgradeCategory = "buildingsUpgrades";
    icecreamStandPercentageClickUpgrade2.upgradeEffect = new buildingUpgradeEffect(game.buildings[1]);
    icecreamStandPercentageClickUpgrade2.upgradeEffect.percentPerClickIncrement = 0.05;
    output.push(icecreamStandPercentageClickUpgrade2);

    //Percentage upgrades

    var icecreamStandFlatSecondUpgrade1 = new upgrade("Icecream stand refrigerator upgrade", "More ice, more coolness!");
    icecreamStandFlatSecondUpgrade1.imgPath = "img/placeholder.png";
    icecreamStandFlatSecondUpgrade1.listener = game;
    icecreamStandFlatSecondUpgrade1.prices = [1, 2, 3, 4];
    icecreamStandFlatSecondUpgrade1.upgradeCategory = "buildingsUpgrades";
    icecreamStandFlatSecondUpgrade1.upgradeEffect = new buildingUpgradeEffect(game.buildings[1]);
    icecreamStandFlatSecondUpgrade1.upgradeEffect.flatPerSecondIncrement = 10;
    output.push(icecreamStandFlatSecondUpgrade1);

    var icecreamStandFlatSecondUpgrade2 = new upgrade("Icecream stand refrigerator upgrade 2", "Ice, anybody?");
    icecreamStandFlatSecondUpgrade2.imgPath = "img/placeholder.png";
    icecreamStandFlatSecondUpgrade2.listener = game;
    icecreamStandFlatSecondUpgrade2.prices = [1, 2, 3, 4];
    icecreamStandFlatSecondUpgrade2.upgradeCategory = "buildingsUpgrades";
    icecreamStandFlatSecondUpgrade2.upgradeEffect = new buildingUpgradeEffect(game.buildings[1]);
    icecreamStandFlatSecondUpgrade2.upgradeEffect.flatPerSecondIncrement = 100;
    output.push(icecreamStandFlatSecondUpgrade2);

    var icecreamStandPercentageSecondUpgrade1 = new upgrade("Icecream stand marketing revamp", "Mo' clients, mo' moneyz");
    icecreamStandPercentageSecondUpgrade1.imgPath = "img/placeholder.png";
    icecreamStandPercentageSecondUpgrade1.listener = game;
    icecreamStandPercentageSecondUpgrade1.prices = [1, 2, 3, 4];
    icecreamStandPercentageSecondUpgrade1.upgradeCategory = "buildingsUpgrades";
    icecreamStandPercentageSecondUpgrade1.upgradeEffect = new buildingUpgradeEffect(game.buildings[1]);
    icecreamStandPercentageSecondUpgrade1.upgradeEffect.percentPerSecondIncrement = 0.05;
    output.push(icecreamStandPercentageSecondUpgrade1);

    var icecreamStandPercentageSecondUpgrade2 = new upgrade("Icecream stand marketing revamp 2", "Mo' clients, mo' moneyz");
    icecreamStandPercentageSecondUpgrade2.imgPath = "img/placeholder.png";
    icecreamStandPercentageSecondUpgrade2.listener = game;
    icecreamStandPercentageSecondUpgrade2.prices = [1, 2, 3, 4];
    icecreamStandPercentageSecondUpgrade2.upgradeCategory = "buildingsUpgrades";
    icecreamStandPercentageSecondUpgrade2.upgradeEffect = new buildingUpgradeEffect(game.buildings[1]);
    icecreamStandPercentageSecondUpgrade2.upgradeEffect.percentPerSecondIncrement = 0.05;
    output.push(icecreamStandPercentageSecondUpgrade2);
    
    //Job upgrades
    
    //flipburgers upgrades
    
    var flipburgersFlatTimeReductionUpgrade = new upgrade("Burger oil upgrade","Better oil, faster baking times");
    flipburgersFlatTimeReductionUpgrade.imgPath = "img/placeholder.png";
    flipburgersFlatTimeReductionUpgrade.listener = game;
    flipburgersFlatTimeReductionUpgrade.prices = [1, 2, 3, 4];
    flipburgersFlatTimeReductionUpgrade.upgradeCategory = "jobsUpgrades";
    flipburgersFlatTimeReductionUpgrade.upgradeEffect = new jobUpgradeEffect(game.jobs[0]);
    flipburgersFlatTimeReductionUpgrade.upgradeEffect.flatResetTimeReduction = 5;
    output.push(flipburgersFlatTimeReductionUpgrade);
    
    var flipburgersFlatResourceRewardIncreaseUpgrade = new upgrade("Spatula upgrade","Reduce flipping air drag");
    flipburgersFlatResourceRewardIncreaseUpgrade.imgPath = "img/placeholder.png";
    flipburgersFlatResourceRewardIncreaseUpgrade.listener = game;
    flipburgersFlatResourceRewardIncreaseUpgrade.prices = [1, 2, 3, 4];
    flipburgersFlatResourceRewardIncreaseUpgrade.upgradeCategory = "jobsUpgrades";
    flipburgersFlatResourceRewardIncreaseUpgrade.upgradeEffect = new jobUpgradeEffect(game.jobs[0]);
    flipburgersFlatResourceRewardIncreaseUpgrade.upgradeEffect.flatResourceRewardIncrease = 5;
    output.push(flipburgersFlatResourceRewardIncreaseUpgrade);
    
    var flipburgersPercentResetTimeReductionUpgrade = new upgrade("Fire upgrade","More heat, faster burgers");
    flipburgersPercentResetTimeReductionUpgrade.imgPath = "img/placeholder.png";
    flipburgersPercentResetTimeReductionUpgrade.listener = game;
    flipburgersPercentResetTimeReductionUpgrade.prices = [1, 2, 3, 4];
    flipburgersPercentResetTimeReductionUpgrade.upgradeCategory = "jobsUpgrades";
    flipburgersPercentResetTimeReductionUpgrade.upgradeEffect = new jobUpgradeEffect(game.jobs[0]);
    flipburgersPercentResetTimeReductionUpgrade.upgradeEffect.percentResetTimeReduction = 0.2;
    output.push(flipburgersPercentResetTimeReductionUpgrade);
    
    var flipburgersPercentResourceRewardIncreaseUpgrade = new upgrade("Nuclear onions","Extra bite");
    flipburgersPercentResourceRewardIncreaseUpgrade.imgPath = "img/placeholder.png";
    flipburgersPercentResourceRewardIncreaseUpgrade.listener = game;
    flipburgersPercentResourceRewardIncreaseUpgrade.prices = [1, 2, 3, 4];
    flipburgersPercentResourceRewardIncreaseUpgrade.upgradeCategory = "jobsUpgrades";
    flipburgersPercentResourceRewardIncreaseUpgrade.upgradeEffect = new jobUpgradeEffect(game.jobs[0]);
    flipburgersPercentResourceRewardIncreaseUpgrade.upgradeEffect.percentResourceRewardIncrease = 0.2;
    output.push(flipburgersPercentResourceRewardIncreaseUpgrade);
    
    var aflipburgers = new upgrade("Nuclear onions","Extra bite");
    aflipburgers.imgPath = "img/placeholder.png";
    aflipburgers.listener = game;
    aflipburgers.prices = [1, 2, 3, 4];
    aflipburgers.upgradeCategory = "jobsUpgrades";
    aflipburgers.upgradeEffect = new jobUpgradeEffect(game.jobs[0]);
    aflipburgers.upgradeEffect.percentResourceRewardIncrease = 0.2;
    aflipburgers.upgradeEffect.percentResetTimeReduction = 0.2;
    output.push(aflipburgers);
    
    //Boost upgrades
    var taxdodgePercentBoostDurationUpgrade = new upgrade("Paper shredder Deluxe","Avoid the authorities a bit longer by cleaning up your paperwork");
    taxdodgePercentBoostDurationUpgrade.imgPath = "img/placeholder.png";
    taxdodgePercentBoostDurationUpgrade.listener = game;
    taxdodgePercentBoostDurationUpgrade.prices = [1, 2, 3, 4];
    taxdodgePercentBoostDurationUpgrade.upgradeCategory = "boostsUpgrades";
    taxdodgePercentBoostDurationUpgrade.upgradeEffect = new boostUpgradeEffect(game.boosts[0]);
    taxdodgePercentBoostDurationUpgrade.upgradeEffect.percentBoostTimeIncrease = 0.2;
    output.push(taxdodgePercentBoostDurationUpgrade);
    
    var taxdodgePercentResourcePerClickIncreaseUpgrade = new upgrade("Tax heaven citizinship","Why pay taxes when you can move?");
    taxdodgePercentResourcePerClickIncreaseUpgrade.imgPath = "img/placeholder.png";
    taxdodgePercentResourcePerClickIncreaseUpgrade.listener = game;
    taxdodgePercentResourcePerClickIncreaseUpgrade.prices = [1, 2, 3, 4];
    taxdodgePercentResourcePerClickIncreaseUpgrade.upgradeCategory = "boostsUpgrades";
    taxdodgePercentResourcePerClickIncreaseUpgrade.upgradeEffect = new boostUpgradeEffect(game.boosts[0]);
    taxdodgePercentResourcePerClickIncreaseUpgrade.upgradeEffect.percentResourcePerClickIncrease = 0.2;
    output.push(taxdodgePercentResourcePerClickIncreaseUpgrade);
    
    var marketingcampaignPercentResourcePerSecondIncreaseUpgrade = new upgrade("Agressive flyer distribution","Force ads and flyers into people's hands");
    marketingcampaignPercentResourcePerSecondIncreaseUpgrade.imgPath = "img/placeholder.png";
    marketingcampaignPercentResourcePerSecondIncreaseUpgrade.listener = game;
    marketingcampaignPercentResourcePerSecondIncreaseUpgrade.prices = [1, 2, 3, 4];
    marketingcampaignPercentResourcePerSecondIncreaseUpgrade.upgradeCategory = "boostsUpgrades";
    marketingcampaignPercentResourcePerSecondIncreaseUpgrade.upgradeEffect = new boostUpgradeEffect(game.boosts[1]);
    marketingcampaignPercentResourcePerSecondIncreaseUpgrade.upgradeEffect.percentResourcePerSecondIncrease = 0.2;
    output.push(marketingcampaignPercentResourcePerSecondIncreaseUpgrade);
    
    
    output.map(function(item) {
        item.initializeUI();
    });

    return output;
};

function initializeJobs(game) {
    var output = [];

    var flipBurgers = new job("Flip burgers in a local burgershop","Who lives in a pineapple under the sea?");
    flipBurgers.resourceTarget = game.resources[0];
    flipBurgers.baseRewardAmount = 10;
    flipBurgers.baseResetTime = 10;
    output.push(flipBurgers);
    
    var sellIcecream = new job("Sell icecream on the street","Icecream man, ring your bell!");
    sellIcecream.resourceTarget = game.resources[1];
    sellIcecream.baseRewardAmount = 33;
    sellIcecream.baseResetTime = 10;
    output.push(sellIcecream);
    
    var beatupRivals = new job("Beat up some small fish real estate agents","Gotta show 'em who's boss!");
    beatupRivals.resourceTarget = game.resources[2];
    beatupRivals.baseRewardAmount = 60;
    beatupRivals.baseResetTime = 10;
    output.push(beatupRivals);

    output.map(function(item) {
        item.initializeUI();
    });

    return output;
}

function initializeBoosts(game){
    var output = [];
    
    var taxdodgeBoost = new boost("Set up tax dodge scheme","Dodge taxes, get money! Only for a limited time tough, authorities will catch up");
    taxdodgeBoost.resourceTarget = game.resources[0];
    taxdodgeBoost.imgPath = "img/placeholder.png";
    taxdodgeBoost.listener = game;
    taxdodgeBoost.prices = [1, 2, 3, 4];
    taxdodgeBoost.baseBoostDuration = 5;
    taxdodgeBoost.baseBoostPercentPerClick = 0.2;
    output.push(taxdodgeBoost);
    
    var marketingcampaignBoost = new boost("Run a widespread marketing campaign","Your face on every streetcorner!");
    marketingcampaignBoost.resourceTarget = game.resources[0];
    marketingcampaignBoost.imgPath = "img/placeholder.png";
    marketingcampaignBoost.listener = game;
    marketingcampaignBoost.prices = [1, 2, 3, 4];
    marketingcampaignBoost.baseBoostDuration = 3;
    marketingcampaignBoost.baseBoostPercentPerSecond = 0.2;
    output.push(marketingcampaignBoost);
    
    
    output.map(function(item) {
        item.initializeUI();
    });

    return output;
}