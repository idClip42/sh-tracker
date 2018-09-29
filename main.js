"use strict"

const screens = {
    nameEntry : undefined,
    menu : undefined,
    // playerList : undefined,
    admin : undefined,
    check : undefined,
    flip : undefined,
    know : undefined,
    all : undefined,
    policyList : undefined,
};

const buttons = {
    autofill : undefined,
    nameSubmit : undefined,
    goPlayerList : undefined,
    goAdmin : undefined,
    goCheck : undefined,
    goFlip : undefined,
    goKnow : undefined,
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
    investigator : undefined,
    investigatee : undefined,
    checkResult : undefined,
    flipResult : undefined,
    knowPlayer : undefined,
    knowResult : undefined,
    implications : undefined,
    probabilityTracker : undefined,
};

const images = {
    liberal : undefined,
    fascist : undefined,
    either : undefined,
};

const players = [];
const policies = [];
// const flips = [];
let cardCount = 17;
// let presidentsThisDeck = [];
let policiesThisDeck = [];
let deckIsSuspicious = false;

const GAME = {
    MIN_PLAYERS : 5,
    MAX_PLAYER : 10,
    LIB_POLS : 6,
    FAC_POLS : 11
};

const COLOR = {
    LIBERAL: "lightskyblue",
    FASCIST: "tomato",
    CONTENTION: "khaki",
    SUSPICION: "peru",
};


const Player = function(name){
    this.name = name;
    this.button = document.createElement("button");
    this.implicatedPlayers = [];
    this.checkedPlayers = [];
    this.confirmedLiberal = false;
    this.confirmedFascist = false;
    this.inContention = false;
    this.inContentionWith = [];
    this.suspicious = false;
    this.policies = [];
    this.notHitler = false;

    this.ConfirmLiberal = function(){
        // console.log(this);
        this.confirmedLiberal = true;
        // this.button.style.backgroundColor = COLOR.LIBERAL;
        // this.listElement.style.backgroundColor = COLOR.LIBERAL;
        // SetBackgroundColor(this.button, this.confirmedLiberal, this.confirmedFascist, this.inContention, this.suspicious);
        // SetBackgroundColor(this.listElement, this.confirmedLiberal, this.confirmedFascist, this.inContention, this.suspicious);
        this.Color();

        this.inContention = false;
        this.ConfirmContentionFascists();

        for(let c in this.checkedPlayers){
            let check = this.checkedPlayers[c];
            if(check.liberal === true)
                check.player.ConfirmLiberal();
            else
                check.player.ConfirmFascist();
        }

        this.implicatedPlayers = [];
        UpdateImplications();
    };
    this.ConfirmFascist = function(){
        this.confirmedFascist = true;
        // this.button.style.backgroundColor = COLOR.FASCIST;
        // this.listElement.style.backgroundColor = COLOR.FASCIST;
        // SetBackgroundColor(this.button, this.confirmedLiberal, this.confirmedFascist, this.inContention, this.suspicious);
        // SetBackgroundColor(this.listElement, this.confirmedLiberal, this.confirmedFascist, this.inContention, this.suspicious);
        this.Color();

        this.RemoveContentionFromOthers();

        for(let i in this.implicatedPlayers)
            this.implicatedPlayers[i].ConfirmFascist();

        this.implicatedPlayers = [];
        UpdateImplications();
    };
    this.Contention = function(other, inCon = true){

        if(inCon === false){
            this.inContentionWith = [];
            this.inContention = false;
            this.Color();
            return;
        }

        this.inContentionWith.push(other);
        if(this.confirmedFascist === false && this.confirmedLiberal === false){
            this.inContention = true;
            // this.button.style.backgroundColor = COLOR.CONTENTION;
            // this.listElement.style.backgroundColor = COLOR.CONTENTION;
            // SetBackgroundColor(this.button, this.confirmedLiberal, this.confirmedFascist, this.inContention, this.suspicious);
            // SetBackgroundColor(this.listElement, this.confirmedLiberal, this.confirmedFascist, this.inContention, this.suspicious);
        } else if(this.confirmedLiberal === true){
            this.ConfirmContentionFascists();
        }
        this.Color();
    };
    this.ConfirmContentionFascists = function(){
        for(let c in this.inContentionWith)
            this.inContentionWith[c].ConfirmFascist();
    };
    this.RemoveContentionFromOthers = function(){
        // console.log("RemoveContentionFromOthers");
        for(let c in this.inContentionWith){
            // console.log(this.inContentionWith[c].name);
            this.inContentionWith[c].RemoveContention(this);
            // let other = this.inContentionWith[c];
            // for(let o in other.inContentionWith){
            //     let check = other.inContentionWith[o];
            //     if(check === this){
            //         other.inContentionWith.splice(o, 1);
            //         break;
            //     }
            // }
        }
        this.Contention(false);
    };
    this.RemoveContention = function(other){
        // console.log("\t" + other.name);
        // console.log(this.inContentionWith[0]);
        for(let c in this.inContentionWith){
            if(this.inContentionWith[c] === other){
                // console.log("Match!");
                this.inContentionWith.splice(c, 1);
                break;
            }
        }
        // console.log(this.name, this.inContentionWith.length);
        if(this.inContentionWith.length === 0)
            this.inContention = false;
        this.Color();
    };
    this.NotHitler = function(){
        this.notHitler = true;
        this.button.innerHTML = "*" + this.button.innerHTML;
        this.listElement.innerHTML = "*" + this.listElement.innerHTML;
    };
    this.Check = function(player, liberal){
        this.checkedPlayers.push({
            player: player,
            liberal: liberal
        });
        if(this.confirmedLiberal === true)
            if(liberal === true)
                player.ConfirmLiberal();
            else
                player.ConfirmFascist();
        if(player.confirmedFascist === true && liberal === true)
            this.ConfirmFascist();
    };
    this.SetSuspicious = function(underSus = true){
        if(underSus === false)
            this.suspicious = underSus;
        else if(this.confirmedLiberal === false && this.confirmedFascist === false){
            this.suspicious = true;
            // this.button.style.backgroundColor = COLOR.SUSPICION;
            // this.listElement.style.backgroundColor = COLOR.SUSPICION;
            // SetBackgroundColor(this.button, this.confirmedLiberal, this.confirmedFascist, this.inContention, this.suspicious);
            // SetBackgroundColor(this.listElement, this.confirmedLiberal, this.confirmedFascist, this.inContention, this.suspicious);
        }
        this.Color();
    }
    this.Color = function(){
        SetBackgroundColor(this.button, this.confirmedLiberal, this.confirmedFascist, this.inContention, this.suspicious);
        // console.log("This is the beginning");
        SetBackgroundColor(this.listElement, this.confirmedLiberal, this.confirmedFascist, this.inContention, this.suspicious);
        // console.log("This is the end");
    }

    this.button.innerHTML = this.name;
    let li = document.createElement("li");
    li.appendChild(this.button);
    elements.playerButtons.appendChild(li);

    this.listElement = document.createElement("li");
    this.listElement.innerHTML = this.name + " ";
    let ol = elements.playerList;
    ol.appendChild(this.listElement);

    // // let confirmFascistButton = document.createElement("button");
    // let confirmFascistButton = GetPolicyImg(false);
    // // let redImg = GetPolicyImg(false);
    // // redImg.className = "smallest";
    // // confirmFascistButton.appendChild(redImg);
    // confirmFascistButton.style.cssFloat = "right";
    // // confirmFascistButton.innerHTML = "Confirm";
    // confirmFascistButton.className = "smaller";
    // // confirmFascistButton.style.backgroundColor = COLOR.FASCIST;
    // confirmFascistButton.ontouchend = this.ConfirmFascist.bind(this);
    // this.listElement.appendChild(confirmFascistButton);

    // // let confirmLiberalButton = document.createElement("button");
    // // confirmLiberalButton.innerHTML = "Confirm";
    // // confirmLiberalButton.style.backgroundColor = COLOR.LIBERAL;
    // // confirmLiberalButton.ontouchend = this.ConfirmLiberal.bind(this);
    // // this.listElement.appendChild(confirmLiberalButton);
    // let confirmLiberalButton = GetPolicyImg(true);
    // confirmLiberalButton.style.cssFloat = "right";
    // confirmLiberalButton.className = "smaller";
    // confirmLiberalButton.ontouchend = this.ConfirmLiberal.bind(this);
    // this.listElement.appendChild(confirmLiberalButton);


    // this.listElement.innerHTML += this.name;

};
const Policy = function(adminArray){

    this.random = adminArray.length === 1;

    if(this.random === false){
        this.president = getPlayerByName(adminArray[0]);
        this.chancellor = getPlayerByName(adminArray[1]);
        this.threePolicies = [adminArray[2], adminArray[3], adminArray[4]];
        this.twoPolicies = [adminArray[5], adminArray[6]];
        this.playedLiberal = adminArray[7];

        this.president.policies.push(this);
        this.chancellor.policies.push(this);
    } else {
        this.president = "Random";
        this.chancellor = "Random";
        this.threePolicies = [];
        this.twoPolicies = [];
        this.playedLiberal = adminArray[0];
    }
    
    this.contention = false;
    this.hadLib = false;
    this.hadFac = false;
    this.element = undefined;
    this.suspicious = false;

    this.SetSuspicious = function(underSus = true){
        this.suspicious = underSus;
        // if(this.contention === false)
        //     this.element.style.backgroundColor = COLOR.SUSPICION;
        this.Color();
    };
    this.SetContention = function(inCon = true){
        this.contention = inCon;
        // console.log("a");
        this.Color();
        // console.log("b");
    };
    this.Color = function(){
        SetBackgroundColor(this.element, false, false, this.contention, this.suspicious);
    };


    if(this.threePolicies.includes(true) !== this.twoPolicies.includes(true)){
        this.contention = true;
        this.president.Contention(this.chancellor);
        this.chancellor.Contention(this.president);

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

    if(this.threePolicies.includes(true) || this.twoPolicies.includes(true) || this.playedLiberal === true)
        this.hadLib = true;
    if(this.threePolicies.includes(false) || this.twoPolicies.includes(false) || this.playedLiberal === false)
        this.hadFac = true;
}



window.onload = function(){
    // document.addEventListener("touchstart", function(e){
    //     e.preventDefault();
    // });
    document.addEventListener("touchend", function(e){
        e.preventDefault();
    });
    let inputs = document.getElementsByTagName("input");
    for(let i in inputs){
        if(isNaN(parseInt(i))) continue;
        inputs[i].ontouchend = function(e){
            inputs[i].focus();
        }
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
        const names = ["Alex", "Mike", "Tarana", "Joe", "Katie", "Larry", "Chris", "Jeff", "Jon", "Connor"];
        let elements = screens.nameEntry.getElementsByTagName("input");
        for(let e in elements){
            if(isNaN(parseInt(e))) continue;
            elements[e].value = names[e];
        }
    }
};

const getDOMElements = function(){
    screens.nameEntry = document.getElementById("name-entry");
    screens.menu = document.getElementById("menu");
    // screens.playerList = document.getElementById("player-list");
    screens.admin = document.getElementById("administration");
    screens.check = document.getElementById("check");
    screens.flip = document.getElementById("flip");
    screens.know = document.getElementById("know");
    screens.all = document.getElementById("input-menu");

    buttons.autofill = document.getElementById("autofill");
    buttons.nameSubmit = document.getElementById("name-submit");
    buttons.goPlayerList = document.getElementById("go-to-player-list");
    buttons.goAdmin = document.getElementById("go-to-administration");
    buttons.goCheck = document.getElementById("go-to-check");
    buttons.goFlip = document.getElementById("go-to-flip");
    buttons.goKnow = document.getElementById("go-to-know");
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
    // elements.policyList = document.getElementById("policy-list");
    screens.policyList = document.getElementById("the-board");
    elements.investigator = document.getElementById("investigator");
    elements.investigatee = document.getElementById("investigatee");
    elements.checkResult = document.getElementById("check-result");
    elements.flipResult = document.getElementById("flip-result");
    elements.knowPlayer = document.getElementById("know-player");
    elements.knowResult = document.getElementById("know-result");
    elements.implications = document.getElementById("implications");

    images.liberal = document.getElementById("libImg");
    images.fascist = document.getElementById("facImg");
    images.either = document.getElementById("mixImg");
};

const goToScreen = function(screen){
    for(let key in screens)
        screens[key].hidden = true;
    screen.hidden = false;
    screens.all.hidden = false;
    // screens.all.style.display = "inline-block";

    screens.policyList.style.display = "block";

    if(screen === screens.menu){
        // elements.playerButtons.style.display = "none";
        // elements.teamButtons.style.display = "none";
        // buttons.undo.style.display = "none";
        // buttons.back.style.display = "none";
        screens.all.style.display = "none";
    } else {
        buttons.back.style.display = "inherit";
        screens.all.style.display = "block";
    }

    UpdateProbabilities(policiesThisDeck.length === 0);
    CheckContention();
};

const setUpMenus = function(){
    goToScreen(screens.nameEntry);
    // screens.all.hidden = true;
    screens.policyList.style.display = "none";
    screens.all.style.display = "none";

    buttons.nameSubmit.ontouchend = function(){ submitNames(goToScreen); };
    buttons.back.ontouchend = function(){ goToScreen(screens.menu); };
    // buttons.goPlayerList.ontouchend = function(){ goToScreen(screens.playerList); };
    buttons.goAdmin.ontouchend = function(){ goToScreen(screens.admin); AdministrationTracker(); };
    buttons.goCheck.ontouchend = function(){ goToScreen(screens.check); CheckTracker(); };
    buttons.goFlip.ontouchend = function(){ goToScreen(screens.flip); FlipTracker(); };
    buttons.goKnow.ontouchend = function(){ goToScreen(screens.know); KnowTracker(); };
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
                elements.threePolicies.appendChild(GetPolicyImg(admin[n]));
            else if (n < 7)
                elements.twoPolicies.appendChild(GetPolicyImg(admin[n]));
            else if(n === 7)
                elements.onePolicy.appendChild(GetPolicyImg(admin[n]));
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

    let isLiberal = policy.playedLiberal;
    let div = document.createElement("div");
    div.className = "policy-on-board";

    if(policy.random === true){
        div.innerHTML = "<b>Random</b><br>";
    } else {
        let prez = policy.president.notHitler ? "*" + policy.president.name : policy.president.name;
        let chan = policy.chancellor.notHitler ? "*" + policy.chancellor.name : policy.chancellor.name;
        let otherCards = GetOtherCardImgs(policy);
        let oc1 = otherCards[0];
        oc1.className = "smallest";
        let oc2 = otherCards[1];
        oc2.className = "smallest";
        div.innerHTML = "<b>" + prez + "</b><br>" + chan + "<br>";
        div.appendChild(oc1);
        div.appendChild(oc2);
        div.innerHTML += "<br>";
    }

    // if(policy.contention)
    //     div.style.backgroundColor = COLOR.CONTENTION;
    SetBackgroundColor(div, false, false, policy.contention, policy.suspicious);

        
    div.appendChild(GetPolicyImg(isLiberal));
    screens.policyList.appendChild(div);
    policy.element = div;

    AddToPoliciesThisDeck(policy);

    cardCount -= 3;
    CheckCardCount();

    screens.policyList.scrollTo(0,screens.policyList.scrollHeight);
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
                elements.checkResult.appendChild(GetPolicyImg(check[n]));
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
                investigator.Contention(investigatee);
                investigatee.Contention(investigator);
            }
            investigator.Check(investigatee, isLiberal);
            
            goToScreen(screens.menu);
        }

    }
    update();
};

const FlipTracker = function(){
    let flip = undefined;

    let update = function(){

        elements.flipResult.innerHTML = ""
        if(flip !== undefined){
            elements.flipResult.appendChild(GetPolicyImg(flip));
        }

        clearTopButtonFunctions();
        buttons.undo.ontouchend = function(){ flip = undefined; update();};
        buttons.liberal.ontouchend = function(){ flip = true; update(); };
        buttons.fascist.ontouchend = function(){ flip = false; update(); };
        elements.playerButtons.style.display = "none";
        elements.teamButtons.style.display = "inherit";
        buttons.undo.style.display = "inherit";

        buttons.confirm.ontouchend = function(){
            if(flip === undefined) return;

            clearTopButtonFunctions();
            
            // flips.push(flip);
            let inputArray = [flip];
            policies.push(new Policy(inputArray));

            let div = document.createElement("div");
            div.className = "policy-on-board";
            div.innerHTML = "<b>Random</b><br>";
            div.appendChild(GetPolicyImg(flip));
            screens.policyList.appendChild(div);

            cardCount -= 1;
            CheckCardCount();

            screens.policyList.scrollTo(0,screens.policyList.scrollHeight);
            
            goToScreen(screens.menu);
        }

    }
    update();
};

const KnowTracker = function(){
    let check = [];

    let update = function(){

        check.length = Math.min(check.length, 2);

        elements.knowPlayer.innerHTML = "";
        elements.knowResult.innerHTML = ""

        for(let n = 0; n < check.length; ++n){
            if(n === 0)
                elements.knowPlayer.innerHTML = check[n];
            else if(n === 1)
                elements.knowResult.appendChild(GetPolicyImg(check[n]));
        }

        clearTopButtonFunctions();
        buttons.undo.ontouchend = function(){ if(check.length > 0) check.pop(); update();};
        if(check.length < 1){
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
            if(check.length !== 2)
                return;

            clearTopButtonFunctions();

            let player = getPlayerByName(check[0]);
            let isLiberal = check[1];

            if(isLiberal === true){
                player.ConfirmLiberal();
            } else {
                player.ConfirmFascist();
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

const GetPolicyImg = function(isLiberal){
    if(isLiberal === true){
        return images.liberal.cloneNode(true);
    }else if(isLiberal === false){
        return images.fascist.cloneNode(true);
    }else{
        return images.either.cloneNode(true);
    }
}

const GetOtherCardImgs = function(policy){

    let pLibs = 0;
    let pFacs = 0;
    let result = [];

    if(policy.random ===  true)
        return result;

    let three = policy.threePolicies;
    let two = policy.twoPolicies;
    let one = policy.playedLiberal;
    let contention = policy.contention;

    for(let t in three)
        if(three[t] === true)
            ++pLibs;
        else
            ++pFacs;

    if(pLibs > pFacs)
        result.push(GetPolicyImg(true));
    else
        result.push(GetPolicyImg(false));

    if(contention)
        result.push(GetPolicyImg("mix"));
    else{
        let other = two[0];
        if(two[0] === one) other = two[1];
        result.push(GetPolicyImg(other));
    }

    return result; 
};

const AddProbabilityTracker = function(){
    elements.probabilityTracker = document.createElement("div");
    elements.probabilityTracker.className = "policy-on-board policy-wide";
    screens.policyList.appendChild(elements.probabilityTracker);
}

const UpdateProbabilities = function(newShuffle = false){
    if(elements.probabilityTracker === undefined)
        AddProbabilityTracker();

    let officialLibCount = 0;
    let officialFacCount = 0;
    let optimisticLibCount = 0;
    let optimisticFacCount = 0;
    let pessimisticLibCount = 0;
    let pessimisticFacCount = 0;

    const addLib = function(){
        ++optimisticLibCount;
        ++pessimisticLibCount;
    }
    const addFac = function(){
        ++optimisticFacCount;
        ++pessimisticFacCount;
    }
    const resetOpPes = function(){
        optimisticLibCount = officialLibCount;
        optimisticFacCount = officialFacCount;
        pessimisticLibCount = officialLibCount;
        pessimisticFacCount = officialFacCount;
    }

    let totalCount = 17;
    let deckCount = 17;
    for(let p in policies){

        if(deckCount < 3){
            deckCount = totalCount;
            resetOpPes();
        }

        let policy = policies[p];

        if(policy.playedLiberal === true) {
            ++officialLibCount;
            addLib();
        }
        else {
            ++officialFacCount;
            addFac();
        }

        if(policy.random === true){
            totalCount -= 1;
            deckCount -= 1;
            continue;
        }
        
        let cardImgs = GetOtherCardImgs(policy);
        if(policy.contention === false){
            // for(let t in policy.threePolicies){
            //     if(policy.threePolicies[t] === true){
            //         addLib();
            //     } else {
            //         addFac();
            //     }
            // }
            for(let c in cardImgs){
                let card = cardImgs[c].src === images.liberal.src ? true : false;
                if(card === true) addLib();
                else addFac();
            }
        } else {
            let firstCard = cardImgs[0].src === images.liberal.src ? true : false;
            if(firstCard === true) addLib();
            else addFac();
            ++optimisticLibCount;
            ++pessimisticFacCount;
        }

        totalCount -= 1;
        deckCount -= 3;
    }
    // for(let f in flips){
    //     if(flips[f] === true){
    //         ++officialLibCount;
    //         addLib();
    //     } else {
    //         ++officialFacCount;
    //         addFac();
    //     }
    //     totalCount -= 1;
    //     deckCount -= 1;
    // }
    if(newShuffle === true) resetOpPes();

    let officialLibPercentage = (GAME.LIB_POLS - officialLibCount) / (GAME.LIB_POLS + GAME.FAC_POLS - officialLibCount - officialFacCount);
    let optimisticLibPercentage = (GAME.LIB_POLS - optimisticLibCount) / cardCount;
    let pessimisticLibPercentage = (GAME.LIB_POLS - pessimisticLibCount) / cardCount;

    // let realLib = "<b>General L Probability:</b> " + parseInt(officialLibPercentage * 100) + "%<br>";
    let fakeLib = "<b><u>L Cards</u></b><br>" + (GAME.LIB_POLS - optimisticLibCount) + " -> " + (GAME.LIB_POLS - pessimisticLibCount) + "<br>" + parseInt(optimisticLibPercentage*100) + "%->" + parseInt(pessimisticLibPercentage*100) + "%<br>";
    let fakeFac = "<b><u>F Cards</u></b><br>" + (GAME.FAC_POLS - pessimisticFacCount) + " -> " + (GAME.FAC_POLS - optimisticFacCount) + "<br>" + parseInt((1-optimisticLibPercentage)*100) + "%->" + parseInt((1-pessimisticLibPercentage)*100) + "%<br>";

    elements.probabilityTracker.innerHTML = fakeLib + fakeFac;

    // console.log(pessimisticFacCount, optimisticFacCount);

    // if()



    // if(cardCount < 3){
        // let officialRemainingLibs = GAME.LIB_POLS - officialLibCount;
        // let officialRemainingFacs = GAME.FAC_POLS - officialFacCount; 

    // let libLie = optimisticLibCount > GAME.LIB_POLS;
    let libLie = pessimisticLibCount > GAME.LIB_POLS;
    // let facLie = pessimisticFacCount > GAME.FAC_POLS;
    let facLie = optimisticFacCount > GAME.FAC_POLS;

    // console.log(pessimisticLibCount, optimisticFacCount);
    // console.log(libLie, facLie);

    if(deckIsSuspicious === false && (libLie || facLie)){
        for(let p in policiesThisDeck){
            let policy = policiesThisDeck[p];
            if((policy.hadFac === true && facLie === true) || (policy.hadLib === true && libLie === true)){
                policy.president.SetSuspicious();
                policy.SetSuspicious();
            }
        }
        deckIsSuspicious = true;
    }

        // if(pessimisticLibCount )

        // if(GAME.LIB_POLS - officialRemainingLibs < pessimisticLibCount || officialRemainingLibs > optimisticLibCount)
    // }

}

const CheckCardCount = function(){
    if(cardCount < 3){
        UpdateProbabilities();
        screens.policyList.innerHTML += "<br>";
        cardCount = 17 - policies.length;
        policiesThisDeck = [];
        deckIsSuspicious = false;
        AddProbabilityTracker();
    }
}

const AddToPoliciesThisDeck = function(policy){
    policiesThisDeck.push(policy);
}

const SetBackgroundColor = function(element, l, f, c ,s){
    // console.log(l, f, c ,s);
    if(l === true){
        element.style.backgroundColor = COLOR.LIBERAL;
        element.style.backgroundImage = "";
    } else if(f === true) {
        element.style.backgroundColor = COLOR.FASCIST;
        element.style.backgroundImage = "";
    } else if(c === true && s === true) {
        element.style.backgroundColor = "darkgray";
        element.style.backgroundImage = "linear-gradient(" + COLOR.CONTENTION + ", " + COLOR.SUSPICION + ")";
    } else if (c === true) {
        element.style.backgroundColor = COLOR.CONTENTION;
        element.style.backgroundImage = "";
    } else if (s === true) {
        element.style.backgroundColor = COLOR.SUSPICION;
        element.style.backgroundImage = "";
    } else {
        element.style.backgroundColor = "darkgray";
        element.style.backgroundImage = "";
    }
}