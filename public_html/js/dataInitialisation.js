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
    hotdogstandBuilding.increasePerSecond = 10;
    hotdogstandBuilding.increasePerClick = 10;
    output.push(hotdogstandBuilding);

    var icecreamBuilding = new building("Icecream stand", "Mmm, icecream!");
    icecreamBuilding.imgPath = "img/placeholder.png";
    icecreamBuilding.listener = game;
    icecreamBuilding.resourceTarget = game.resources[1];
    icecreamBuilding.prices = [5, 20, 3, 2];
    icecreamBuilding.increasePerSecond = 10;
    icecreamBuilding.increasePerClick = 0;
    output.push(icecreamBuilding);

    var waynetowersBuilding = new building("Wayne Towers", "Somebody has to pay for the batmobile!");
    waynetowersBuilding.imgPath = "img/placeholder.png";
    waynetowersBuilding.listener = game;
    waynetowersBuilding.resourceTarget = game.resources[3];
    waynetowersBuilding.prices = [500, 200, 330, 222];
    waynetowersBuilding.increasePerSecond = 0;
    waynetowersBuilding.increasePerClick = 100;
    output.push(waynetowersBuilding);

    var mallBuilding = new building("Mall", "Let's go to the mall, today!");
    mallBuilding.imgPath = "img/placeholder.png";
    mallBuilding.listener = game;
    mallBuilding.resourceTarget = game.resources[2];
    mallBuilding.prices = [100, 200, 300, 400];
    mallBuilding.increasePerSecond = 5000;
    mallBuilding.increasePerClick = 5000;
    output.push(mallBuilding);

    var piramidBuilding = new building("Great Pyramid of Giza", "Mausoleum, RETI style!");
    piramidBuilding.imgPath = "img/placeholder.png";
    piramidBuilding.listener = game;
    piramidBuilding.resourceTarget = game.resources[3];
    piramidBuilding.prices = [1000, 2000, 3000, 4000];
    piramidBuilding.increasePerSecond = 1234567;
    piramidBuilding.increasePerClick = 1234567;
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
    icecreamStandFlatClickUpgrade1.upgradeEffect = new buildingUpgradeEffect(game.buildings[1]);
    icecreamStandFlatClickUpgrade1.upgradeEffect.flatPerClickIncrement = 10;
    icecreamStandFlatClickUpgrade1.upgradeEffect.flatPerSecondIncrement = 10;
    output.push(icecreamStandFlatClickUpgrade1);

    var icecreamStandFlatClickUpgrade2 = new upgrade("Icecream stand refrigerator upgrade 2", "Ice, anybody?");
    icecreamStandFlatClickUpgrade2.imgPath = "img/placeholder.png";
    icecreamStandFlatClickUpgrade2.listener = game;
    icecreamStandFlatClickUpgrade2.prices = [1, 2, 3, 4];
    icecreamStandFlatClickUpgrade2.upgradeEffect = new buildingUpgradeEffect(game.buildings[1]);
    icecreamStandFlatClickUpgrade2.upgradeEffect.flatPerClickIncrement = 100;
    output.push(icecreamStandFlatClickUpgrade2);

    var icecreamStandPercentageClickUpgrade1 = new upgrade("Icecream stand marketing revamp", "Mo' clients, mo' moneyz");
    icecreamStandPercentageClickUpgrade1.imgPath = "img/placeholder.png";
    icecreamStandPercentageClickUpgrade1.listener = game;
    icecreamStandPercentageClickUpgrade1.prices = [1, 2, 3, 4];
    icecreamStandPercentageClickUpgrade1.upgradeEffect = new buildingUpgradeEffect(game.buildings[1]);
    icecreamStandPercentageClickUpgrade1.upgradeEffect.percentPerClickIncrement = 1.05;
    output.push(icecreamStandPercentageClickUpgrade1);

    var icecreamStandPercentageClickUpgrade2 = new upgrade("Icecream stand marketing revamp 2", "Mo' clients, mo' moneyz");
    icecreamStandPercentageClickUpgrade2.imgPath = "img/placeholder.png";
    icecreamStandPercentageClickUpgrade2.listener = game;
    icecreamStandPercentageClickUpgrade2.prices = [1, 2, 3, 4];
    icecreamStandPercentageClickUpgrade2.upgradeEffect = new buildingUpgradeEffect(game.buildings[1]);
    icecreamStandPercentageClickUpgrade2.upgradeEffect.percentPerClickIncrement = 1.05;
    output.push(icecreamStandPercentageClickUpgrade2);

    //Percentage upgrades

    var icecreamStandFlatSecondUpgrade1 = new upgrade("Icecream stand refrigerator upgrade", "More ice, more coolness!");
    icecreamStandFlatSecondUpgrade1.imgPath = "img/placeholder.png";
    icecreamStandFlatSecondUpgrade1.listener = game;
    icecreamStandFlatSecondUpgrade1.prices = [1, 2, 3, 4];
    icecreamStandFlatSecondUpgrade1.upgradeEffect = new buildingUpgradeEffect(game.buildings[1]);
    icecreamStandFlatSecondUpgrade1.upgradeEffect.flatPerSecondIncrement = 10;
    output.push(icecreamStandFlatSecondUpgrade1);

    var icecreamStandFlatSecondUpgrade2 = new upgrade("Icecream stand refrigerator upgrade 2", "Ice, anybody?");
    icecreamStandFlatSecondUpgrade2.imgPath = "img/placeholder.png";
    icecreamStandFlatSecondUpgrade2.listener = game;
    icecreamStandFlatSecondUpgrade2.prices = [1, 2, 3, 4];
    icecreamStandFlatSecondUpgrade2.upgradeEffect = new buildingUpgradeEffect(game.buildings[1]);
    icecreamStandFlatSecondUpgrade2.upgradeEffect.flatPerSecondIncrement = 100;
    output.push(icecreamStandFlatSecondUpgrade2);

    var icecreamStandPercentageSecondUpgrade1 = new upgrade("Icecream stand marketing revamp", "Mo' clients, mo' moneyz");
    icecreamStandPercentageSecondUpgrade1.imgPath = "img/placeholder.png";
    icecreamStandPercentageSecondUpgrade1.listener = game;
    icecreamStandPercentageSecondUpgrade1.prices = [1, 2, 3, 4];
    icecreamStandPercentageSecondUpgrade1.upgradeEffect = new buildingUpgradeEffect(game.buildings[1]);
    icecreamStandPercentageSecondUpgrade1.upgradeEffect.percentPerSecondIncrement = 1.05;
    output.push(icecreamStandPercentageSecondUpgrade1);

    var icecreamStandPercentageSecondUpgrade2 = new upgrade("Icecream stand marketing revamp 2", "Mo' clients, mo' moneyz");
    icecreamStandPercentageSecondUpgrade2.imgPath = "img/placeholder.png";
    icecreamStandPercentageSecondUpgrade2.listener = game;
    icecreamStandPercentageSecondUpgrade2.prices = [1, 2, 3, 4];
    icecreamStandPercentageSecondUpgrade2.upgradeEffect = new buildingUpgradeEffect(game.buildings[1]);
    icecreamStandPercentageSecondUpgrade2.upgradeEffect.percentPerSecondIncrement = 1.05;
    output.push(icecreamStandPercentageSecondUpgrade2);

    output.map(function(item) {
        item.initializeUI();
    });

    return output;
};

function initializeJobs(game) {
    var output = [];

    var flipBurgers = new job("Flip burgers in a local burgershop","Who lives in a pineapple under the sea?");
    output.push(flipBurgers);

    output.map(function(item) {
        item.initializeUI();
    });

    return output;
}
