
// TODO: Make function that gives policy image

const screens = {
    nameEntry : undefined,
    menu : undefined,
    // playerList : undefined,
    admin : undefined,
    check : undefined,
    all : undefined,
};

const buttons = {
    autofill : undefined,
    nameSubmit : undefined,
    goPlayerList : undefined,
    goAdmin : undefined,
    goCheck : undefined,
    back : undefined,
    liberal : undefined,
    fascist : undefined,
    undo : undefined,
    confirm : undefined,
};

const elements = {
    playerList : undefined,
    teamButtons : undefined,
    playerButtons : undefined,
    newPresident : undefined,
    newChancellor : undefined,
    threePolicies : undefined,
    twoPolicies : undefined,
    onePolicy : undefined,
    policyList : undefined,
    investigator : undefined,
    investigatee : undefined,
    checkResult : undefined,
    implications : undefined,
};

const images = {
    liberal : undefined,
    fascist : undefined,
};

const players = [];
const policies = [];

const GAME = {
    MIN_PLAYERS : 5,
    MAX_PLAYER : 10,
};

const COLOR = {
    LIBERAL: "lightskyblue",
    FASCIST: "tomato",
    CONTENTION: "khaki",
};


const Player = function(name){
    this.name = name;
    this.button = document.createElement("button");
    this.implicatedPlayers = [];
    this.confirmedLiberal = false;
    this.confirmedFascist = false;
    this.inContention = false;
    this.policies = [];
    this.notHitler = false;

    this.ConfirmLiberal = function(){
        console.log(this);
        this.confirmedLiberal = true;
        this.button.style.backgroundColor = COLOR.LIBERAL;
        this.listElement.style.backgroundColor = COLOR.LIBERAL;

        this.implicatedPlayers = [];
        UpdateImplications();
    };
    this.ConfirmFascist = function(){
        this.confirmedFascist = true;
        this.button.style.backgroundColor = COLOR.FASCIST;
        this.listElement.style.backgroundColor = COLOR.FASCIST;

        for(let i in this.implicatedPlayers)
            this.implicatedPlayers[i].ConfirmFascist();

        this.implicatedPlayers = [];
        UpdateImplications();
    };
    this.Contention = function(){
        if(this.confirmedFascist === false && this.confirmedLiberal === false){
            this.inContention = true;
            this.button.style.backgroundColor = COLOR.CONTENTION;
            this.listElement.style.backgroundColor = COLOR.CONTENTION;
        }
    }
    this.NotHitler = function(){
        this.notHitler = true;
        this.button.innerHTML = "*" + this.button.innerHTML;
        this.listElement.innerHTML = "*" + this.listElement.innerHTML;
    };

    this.button.innerHTML = this.name;
    let li = document.createElement("li");
    li.appendChild(this.button);
    elements.playerButtons.appendChild(li);

    this.listElement = document.createElement("li");
    this.listElement.innerHTML = this.name;
    let ol = elements.playerList;
    ol.appendChild(this.listElement);

    let confirmFascistButton = document.createElement("button");
    confirmFascistButton.innerHTML = "Confirm";
    confirmFascistButton.style.backgroundColor = COLOR.FASCIST;
    confirmFascistButton.ontouchend = this.ConfirmFascist.bind(this);
    this.listElement.appendChild(confirmFascistButton);

    let confirmLiberalButton = document.createElement("button");
    confirmLiberalButton.innerHTML = "Confirm";
    confirmLiberalButton.style.backgroundColor = COLOR.LIBERAL;
    confirmLiberalButton.ontouchend = this.ConfirmLiberal.bind(this);
    this.listElement.appendChild(confirmLiberalButton);

};
const Policy = function(adminArray){
    this.president = getPlayerByName(adminArray[0]);
    this.chancellor = getPlayerByName(adminArray[1]);
    this.threePolicies = [adminArray[2], adminArray[3], adminArray[4]];
    this.twoPolicies = [adminArray[5], adminArray[6]];
    this.playedLiberal = adminArray[7];
    this.contention = false;

    this.president.policies.push(this);
    this.chancellor.policies.push(this);

    if(this.threePolicies.includes(true) !== this.twoPolicies.includes(true)){
        this.contention = true;
        this.president.Contention();
        this.chancellor.Contention();

        if(this.president.confirmedLiberal === true){
            this.chancellor.ConfirmFascist();
            this.contention = false;
        }
        if(this.chancellor.confirmedLiberal === true){
            this.president.ConfirmFascist();
            this.contention = false;
        }

        CheckContention();
    }

    if(this.threePolicies.includes(true) && this.twoPolicies.includes(true) && this.playedLiberal === false)
        this.chancellor.ConfirmFascist();
}



window.onload = function(){
    // document.addEventListener("touchstart", function(e){
    //     e.preventDefault();
    // });
    document.addEventListener("touchend", function(e){
        e.preventDefault();
    });
    let inputs = document.getElementsByTagName("input");
    for(let i in inputs)
    inputs[i].ontouchend = function(e){
        inputs[i].focus();
    }
    // document.addEventListener("touchmove", function(e){
    //     e.preventDefault();
    // });
    // document.onscroll = function(e){
    //     e.preventDefault();
    // };
    getDOMElements();
    setUpMenus();

    buttons.autofill.ontouchend = function(){
        const names = ["Alex", "Bob", "Carol", "Dave", "Edith", "Fred", "Gwen", "Harry", "Ingrid", "Jimmy"];
        let elements = screens.nameEntry.getElementsByTagName("input");
        for(let e in elements)
            elements[e].value = names[e];
    }
};

const getDOMElements = function(){
    screens.nameEntry = document.getElementById("name-entry");
    screens.menu = document.getElementById("menu");
    // screens.playerList = document.getElementById("player-list");
    screens.admin = document.getElementById("administration");
    screens.check = document.getElementById("check");
    screens.all = document.getElementById("all-menu");

    buttons.autofill = document.getElementById("autofill");
    buttons.nameSubmit = document.getElementById("name-submit");
    buttons.goPlayerList = document.getElementById("go-to-player-list");
    buttons.goAdmin = document.getElementById("go-to-administration");
    buttons.goCheck = document.getElementById("go-to-check");
    buttons.back = document.getElementById("back");
    buttons.liberal = document.getElementById("libButton");
    buttons.fascist = document.getElementById("facButton");
    buttons.undo = document.getElementById("undoButton");
    buttons.confirm = document.getElementById("confirmButton");

    elements.playerList = document.getElementById("player-list");
    elements.teamButtons = document.getElementById("team-buttons");
    elements.playerButtons = document.getElementById("player-buttons");
    elements.newPresident = document.getElementById("newPresident");
    elements.newChancellor = document.getElementById("newChancellor");
    elements.threePolicies = document.getElementById("three-policies");
    elements.twoPolicies = document.getElementById("two-policies");
    elements.onePolicy = document.getElementById("one-policy");
    elements.policyList = document.getElementById("policy-list");
    elements.investigator = document.getElementById("investigator");
    elements.investigatee = document.getElementById("investigatee");
    elements.checkResult = document.getElementById("check-result");
    elements.implications = document.getElementById("implications");

    images.liberal = document.getElementById("libImg");
    images.fascist = document.getElementById("facImg");
};

const goToScreen = function(screen){
    for(let key in screens)
        screens[key].hidden = true;
    screen.hidden = false;
    screens.all.hidden = false;
    // screens.all.style.display = "inline-block";

    if(screen === screens.menu){
        elements.playerButtons.style.display = "none";
        elements.teamButtons.style.display = "none";
        buttons.undo.style.display = "none";
        buttons.back.style.display = "none";
    } else {
        buttons.back.style.display = "inherit";
    }
};

const setUpMenus = function(){
    goToScreen(screens.nameEntry);
    screens.all.hidden = true;

    buttons.nameSubmit.ontouchend = function(){ submitNames(goToScreen); };
    buttons.back.ontouchend = function(){ goToScreen(screens.menu); };
    // buttons.goPlayerList.ontouchend = function(){ goToScreen(screens.playerList); };
    buttons.goAdmin.ontouchend = function(){ goToScreen(screens.admin); AdministrationTracker(); };
    buttons.goCheck.ontouchend = function(){ goToScreen(screens.check); CheckTracker(); };
};

const submitNames = function(leaveScreen){
    let playerNames = [];
    let elements = screens.nameEntry.getElementsByTagName("input");
    for(let e in elements){
        if(elements[e].type === "text" &&
            elements[e].value !== "")
            playerNames.push(elements[e].value);
    }
    if(playerNames.length >= GAME.MIN_PLAYERS){
        initPlayers(playerNames);
        leaveScreen(screens.menu);
    }
};

const initPlayers = function(names){
    for(let n in names){
        players.push(new Player(names[n]));
    }
};

const getPlayerByName = function(name){
    for(let p in players)
        if(players[p].name === name)
            return players[p];
    return undefined;
}

const setNameButtonsFunction = function(func){
    for(let p in players){
        players[p].button.ontouchend = func.bind(players[p]);
    }
};

const clearTopButtonFunctions = function(){
    setNameButtonsFunction(function(){});
    buttons.liberal.ontouchend = function(){};
    buttons.fascist.ontouchend = function(){};
    buttons.undo.ontouchend = function(){};
    buttons.confirm.ontouchend = function(){};
}

const AdministrationTracker = function(){
    let admin = [];

    let update = function(){

        admin.length = Math.min(admin.length, 8);

        elements.newPresident.innerHTML = "";
        elements.newChancellor.innerHTML = "";
        elements.threePolicies.innerHTML = "";
        elements.twoPolicies.innerHTML = "";
        elements.onePolicy.innerHTML = "";

        for(let n = 0; n < admin.length; ++n){
            if(n === 0)
                elements.newPresident.innerHTML = admin[n];
            else if(n === 1)
                elements.newChancellor.innerHTML = admin[n];
            else if (n < 5)
                elements.threePolicies.appendChild(admin[n] === true ? images.liberal.cloneNode(true) : images.fascist.cloneNode(true));
            else if (n < 7)
                elements.twoPolicies.appendChild(admin[n] === true ? images.liberal.cloneNode(true) : images.fascist.cloneNode(true));
            else if(n === 7)
                elements.onePolicy.appendChild(admin[n] === true ? images.liberal.cloneNode(true) : images.fascist.cloneNode(true));
        }

        clearTopButtonFunctions();
        buttons.undo.ontouchend = function(){ if(admin.length > 0) admin.pop(); update();};
        if(admin.length < 2){
            setNameButtonsFunction(function(){ admin.push(this.name); update(); });
            elements.playerButtons.style.display = "inherit";
            elements.teamButtons.style.display = "none";
            buttons.undo.style.display = "inherit";
        } else {
            buttons.liberal.ontouchend = function(){ admin.push(true); update(); };
            buttons.fascist.ontouchend = function(){ admin.push(false); update(); };
            elements.playerButtons.style.display = "none";
            elements.teamButtons.style.display = "inherit";
            buttons.undo.style.display = "inherit";
        }

        buttons.confirm.ontouchend = function(){
            if(admin.length !== 8)
                return;

            clearTopButtonFunctions();

            if(InHitlerTerritory() === true)
                getPlayerByName(admin[1]).NotHitler();

            let policy = new Policy(admin);
            policies.push(policy);
            getPlayerByName(admin[0]).policies.push(policy);
            getPlayerByName(admin[1]).policies.push(policy);
            AddPolicyToBoard(policy);
            
            goToScreen(screens.menu);
        }

    }
    update();
};

const CheckContention = function(){
    let playersInContention = [];
    let playersFine = [];
    let confirmedFascists = [];
    let contentionNeeded = 10;

    for(let p in players){
        if(players[p].confirmedFascist === true)
            confirmedFascists.push(players[p]);
        else if(players[p].inContention === true)
            playersInContention.push(players[p]);
        else
            playersFine.push(players[p]);
    }

    if(players.length <= 6){
        contentionNeeded = 4;
    } else if (players.length <= 8){
        contentionNeeded = 6;
    } else {
        contentionNeeded = 8;
    }
    if(playersInContention.length + confirmedFascists.length * 2 >= contentionNeeded)
        for(let p in playersFine)
            playersFine[p].ConfirmLiberal();
};

const AddPolicyToBoard = function(policy){
    let prez = policy.president.notHitler ? "*" + policy.president.name : policy.president.name;
    let chan = policy.chancellor.notHitler ? "*" + policy.chancellor.name : policy.chancellor.name;
    let isLiberal = policy.playedLiberal;

    let div = document.createElement("div");
    div.className = "policy-on-board";
    div.innerHTML = "<b>" + prez + "</b><br>" + chan + "<br>";
    if(policy.contention)
        div.style.backgroundColor = COLOR.CONTENTION;
    div.appendChild(isLiberal === true ? images.liberal.cloneNode(true) : images.fascist.cloneNode(true));
    elements.policyList.appendChild(div);
}


const CheckTracker = function(){
    let check = [];

    let update = function(){

        check.length = Math.min(check.length, 3);

        elements.investigator.innerHTML = "";
        elements.investigatee.innerHTML = "";
        elements.checkResult.innerHTML = ""

        for(let n = 0; n < check.length; ++n){
            if(n === 0)
                elements.investigator.innerHTML = check[n];
            else if(n === 1)
                elements.investigatee.innerHTML = check[n];
            else if(n === 2)
                elements.checkResult.appendChild(check[n] === true ? images.liberal.cloneNode(true) : images.fascist.cloneNode(true));
        }

        clearTopButtonFunctions();
        buttons.undo.ontouchend = function(){ if(check.length > 0) check.pop(); update();};
        if(check.length < 2){
            setNameButtonsFunction(function(){ check.push(this.name); update(); });
            elements.playerButtons.style.display = "inherit";
            elements.teamButtons.style.display = "none";
            buttons.undo.style.display = "inherit";
        } else {
            buttons.liberal.ontouchend = function(){ check.push(true); update(); };
            buttons.fascist.ontouchend = function(){ check.push(false); update(); };
            elements.playerButtons.style.display = "none";
            elements.teamButtons.style.display = "inherit";
            buttons.undo.style.display = "inherit";
        }

        buttons.confirm.ontouchend = function(){
            if(check.length !== 3)
                return;

            clearTopButtonFunctions();

            let investigator = getPlayerByName(check[0]);
            let investigatee = getPlayerByName(check[1]);
            let isLiberal = check[2];

            if(isLiberal === true){
                // investigator.implicatedPlayers.push(investigatee);
                investigatee.implicatedPlayers.push(investigator);
                UpdateImplications();
            } else {
                investigator.Contention();
                investigatee.Contention();
            }
            
            goToScreen(screens.menu);
        }

    }
    update();
};

const UpdateImplications = function(){
    elements.implications.innerHTML = "";
    for(let p in players){
        let pl = players[p];
        let infoString = "";
        for(let i in pl.implicatedPlayers){
            let imp = pl.implicatedPlayers[i];
            infoString += imp.name + ", "
        }
        if(infoString !== ""){
            infoString = "If " + pl.name + " is Fascist, so is: " + infoString;
            let li = document.createElement("li");
            li.innerHTML = infoString;
            elements.implications.appendChild(li);
        }
    }
};

const InHitlerTerritory = function(){
    let fascistPolicies = 0;
    for(let p in policies){
        if(policies[p].playedLiberal === false)
            fascistPolicies++;
    }
    return fascistPolicies >= 3;
};