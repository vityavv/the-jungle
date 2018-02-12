//THANK @la_grib (from http://discord.gg/code) for helping me
//find a great solution to the updating problem! :heart:
class Person {
	constructor(name) {
		this.jobStore = 0;
		this.name = name || "";
		this.alcoholicStore = false;
		this.canGetJobStore = true;
		this.jailStore = false;
		this.daysTillOutStore = 0;
		this.strikerStore = false;
		this.strikebreakerStore = false;
	}
	get job() {return this.jobStore;}
	set job(value) {
		this.jobStore = value;
		updateFamily();
	}
	get alcoholic() {return this.alcoholicStore;}
	set alcoholic(value) {
		this.alcoholicStore = value;
		updateFamily();
	}
	get canGetJob() {return this.canGetJobStore;}
	set canGetJob(value) {
		this.canGetJobStore = value;
		if (!value) this.job = 0;
		updateFamily();
	}
	get jail() {return this.jailStore;}
	set jail(value) {
		this.jailStore = value;
		updateFamily();
	}
	get daysTillOut() {return this.daysTillOutStore;}
	set daysTillOut(value) {
		this.daysTillOutStore = value;
		if (this.daysTillOutStore <= 0) {this.jail = false}
		updateFamily();
	}
	get striker() {return this.strikerStore;}
	set striker(value) {
		this.strikerStore = value;
		updateFamily();
	}
	get strikebreaker() {return this.strikebreakerStore}
	set strikebreaker(value) {
		this.strikebreakerStore = value;
		updateFamily();
	}
}

//VARS
let membersStore = [];
let members = new Proxy(membersStore, {
	apply: (target, thisArg, argumentList) => {
		return thisArg[target].apply(this, argumentList);
	},
	deleteProperty: (target, property) => {
		return true;
	},
	set: (target, property, value, receiver) => {
		target[property] = value;
		return true;
	}
});
let moneyStore = 700;
Object.defineProperty(window, "money", {
	get: () => moneyStore,
	set: value => {
		moneyStore = value;
		updateMoney();
	}
});
let babyStore = 0;
Object.defineProperty(window, "babies", {
	get: () => babyStore,
	set: value => {
		babyStore = value;
		updateFamily();
	}
});
window.onload = () => {updateStatus("You come into America with your family and $700");};
let cycle = 0;
let dwelling = "homeless";
let house = 0;
let jobChooser = 0;
let cycleType = 0;//0 for first, 1 for second
//Concerning the family
function removeMember(button) {//Remove a member of the family
	button.parentNode.remove();
}
function addMember() {//add a member of the family
	let element = document.createElement("div");
	element.setAttribute("class", "member");//create a new element, make it a member, and put the normal stuff inside it
	element.innerHTML = "Name: <input/> <button onClick='removeMember(this)'>Remove</button>";
	document.getElementById("family").appendChild(element);//add it to the DOM
}
function startGame() {//Start the game
	let memberElements = Array.from(document.querySelectorAll(".member > input"));//get all of the member input elements
	if (memberElements.length <= 0) {//alert if there aren't any
		alert("You can't have a family with no members!");
		return;//exit function
	}
	memberElements.forEach(memberElement => {
		members.push(new Person(memberElement.value));//for each element, make a new person with their name
	});
	document.getElementById("dwelling").style.display = "block";
	document.getElementById("family").style.display = "none";//hide the family menu and show the house one
	updateFamily();
}
//Choosing a house
function chooseDwelling(chosenDwelling) {
	let youHave = "";
	if (chosenDwelling === "house") {
		if (money >= 300) {//make sure you have enough money
			dwelling = "house";
			house = 20;//this is a counting-down number---when it reaches 0 you stop paying
			money -= 300;
			updateStatus(`You pay $300 down for a new house! You have $${money} left`);
			youHave = "You already live in a house. Choose an option below to change your dwelling or press skip to continue ";
		} else {
			alert("You don't have enough money for that!");//if you don't...
			return;
		}
	} else if (chosenDwelling === "rent") {
		dwelling = "rent";
		house = 0;//reset the counting-down if someone loses their house
		youHave = "You currently pay rent each cycle. Choose an option below to change your dwelling or press skip to continue ";
	} else {
		dwelling = "homeless";
		house = 0;//^^^
		youHave = "You're homeless. Press skip to stay homeless, or choose one of the options below ";
	}
	youHave += "<button onClick='skipDwelling()'>Skip</button>";
	document.getElementById("youHave").innerHTML = youHave;
	if (cycle === 0) {
		document.getElementById("job").style.display = "block";
		document.getElementById("dwelling").style.display = "none";//go to the next screen
		while(!members[jobChooser].canGetJob) jobChooser++;
		document.getElementById("jobChooser").innerText = members[jobChooser].name;
	} else {
		document.getElementById("dwelling").style.display = "none";
		document.getElementById("game").style.display = "block";
	}
}
function skipDwelling() {
	if (cycle === 0) {
		document.getElementById("job").style.display = "block";
		document.getElementById("dwelling").style.display = "none";//go to the next screen
		while(!members[jobChooser].canGetJob) jobChooser++;
		document.getElementById("jobChooser").innerText = members[jobChooser].name;
	} else {
		document.getElementById("dwelling").style.display = "none";
		document.getElementById("game").style.display = "block";
	}
}
function chooseJob(element, skip) {
	if (skip) {
		jobChooser++;//next jobChooser
		if (!members[jobChooser]) {
			document.getElementById("job").style.display = "none";
			document.getElementById("game").style.display = "block";
			startCycle();
			return;
		}
		while(!members[jobChooser].canGetJob) {
			jobChooser++;
			if (!members[jobChooser]) {
				document.getElementById("job").style.display = "none";
				document.getElementById("game").style.display = "block";
				startCycle();
				return;
			}
		}
		document.getElementById("jobChooser").innerText = members[jobChooser].name;//show their name
		return;
	};//if you're not getting a job or already have one, skip!

	Array.from(document.getElementsByClassName("job")).forEach(el => {el.style.visibility = "hidden"});
	element.style.visibility = "visible";//make sure you can only see the one you picked
	element.style.background = "white";

	let job = [0, 3, 5][Math.floor(Math.random()*3)];//see what job you get---completely random
	if (job === 0) {
		element.innerHTML = "<h1>You didn't get a job :(</h1><br>";//Here and below; show what job you got and your options
		updateStatus(`"${members[jobChooser].name}" tried to get a job and failed`);
	} else {
		element.innerHTML = `<h1>You got a job that pays $${job}!</h1><br><span id="bribe"><button onClick="bribe()">Bribe the boss for double pay - $20</button></span><br><br>`;
		updateStatus(`"${members[jobChooser].name}" got a job that pays $${job}!`);
	}
	element.innerHTML += "<button onClick='nextJobChoose(this)'>Next</button>";
	element.removeAttribute("onClick");//make sure that it doesn't change when you click on it by taking that away

	document.getElementById("skipButton").style.display = "none";//make the skip button invisible

	members[jobChooser].job = job;//sets the job for real now
}
function bribe() {
	if (money < 20) {
		alert("You don't have enough money!");//yelling!
		return;
	}
	money -= 20;//take away money
	members[jobChooser].job *= 2;//double pay
	document.getElementById("bribe").innerHTML = `Your job now earns you $${members[jobChooser].job}!`;//tell 'em
	updateStatus(`"${members[jobChooser].name}" bribed the boss $20 to get double pay and earn $${members[jobChooser].job}! You have $${money} left`);
}
function nextJobChoose(element) {
	jobChooser++;//next jobChooser
	if (!members[jobChooser]) {
		document.getElementById("job").style.display = "none";
		document.getElementById("game").style.display = "block";
		startCycle();
		return;
	}
	while(!members[jobChooser].canGetJob) {
		jobChooser++;
		if (!members[jobChooser]) {
			document.getElementById("job").style.display = "none";
			document.getElementById("game").style.display = "block";
			cycleType = 0;
			startCycle();
			return;
		}
	}
	document.getElementById("jobChooser").innerText = members[jobChooser].name;//show their name
	Array.from(document.getElementsByClassName("job")).forEach(el => {el.style.visibility = "visible"});//make sure you can see all of the options
	let parent = element.parentNode;
	parent.style.background = "lightcyan";//make them light-cyan again
	setTimeout(()=>{parent.setAttribute("onClick", "chooseJob(this)")}, 100);//some things I don't like, and this is one of them
	parent.innerHTML = "";//take away the text
	document.getElementById("skipButton").style.display = "";//Show the skip button again
}
//Game functions:

function startCycle() {
	members.filter(member => member.job).forEach(member => {
		money += member.job;
		updateStatus(`You earned $${member.job} from ${member.name}'s job. You now have $${money}.`);
	});
	if (house > 0) {
		money -= 12;
		updateStatus(`You spent $12 to pay off your house. You have $${money} left.`);
	}
	if (dwelling === "rent") {
		money -= 9;
		updateStatus(`You spent $9 on rent. You have $${money} left.`);
	}
	members.filter(member => member.alcoholic).forEach(member => {
		money--;
		updateStatus(`You spent $1 on alcohol for "${member.name}". You have $${money} left.`);
	});
	cycle++;
	house--;
	members.forEach(person => {
		if (person.daysTillOut) person.daysTillOut--;
	});
}
function chooseCycle(element) {
	Array.from(document.getElementsByClassName("cycle")).forEach(el => {el.style.visibility = "hidden"});
	element.style.visibility = "visible";
	element.style.background = "white";
	element.removeAttribute("onClick");

	if (cycleType === 0) {
		cycleType = 1;
		chooseCycleOne(element);
	} else if (cycleType === 1) {
		cycleType = 2;
		chooseCycleTwo(element);
	} else if (cycleType === 2) {
		cycleType = 3;
		chooseCycleThree(element);
	}
}
function nextCycleChoose(element) {
	startCycle();
	if (cycleType === 3) {
		let string = `You pay $${members.length * 2} for groceries for the ${members.length} ${members.length === 1 ? "member" : "members"} in your family.<br>`;
		if (babies > 0) string += `You pay $${babies * 4} for formula and food for your ${babies} ${babies === 1 ? "baby" : "babies"}.`;
		updateStatus(string);
		money -= ((members.length * 2) + (babies * 4));
		document.getElementById("dwelling").style.display = "block";
		document.getElementById("game").style.display = "none";
		cycleType = 0;
	}
	Array.from(document.getElementsByClassName("cycle")).forEach(el => {el.style.visibility = "visible"});
	let parent = element.parentNode;
	parent.style.background = "lightcyan";
	setTimeout(()=>{parent.setAttribute("onClick", "chooseCycle(this)")}, 100);
	parent.innerHTML = "";
}

//DOM manipulation functions
function updateStatus(string) {
	let status = document.getElementById("status");
	status.innerHTML = `<p class="status">${string}</p><hr/>${status.innerHTML}`;
}
function updateFamily() {
	let string = "";
	members.forEach(person => {
		string += `"${person.name}" - Job: $${person.job}`;
		if (person.alcoholic) string += " - Alcoholic";
		if (!person.canGetJob) string += " - Permanently injured and can't get a job";
		if (person.jail) string += ` - In jail, ${person.daysTillOut} ${person.daysTillOut === 1 ? "day" : "days"} until they're out.`;
		if (person.striker) string += ` - On strike`;
		if (person.strikebreaker) string += ` - Breaking the strike`;
		string += "<br>"
	});
	if (babies) string += babies + (babies === 1 ? " baby" : " babies");
	if (members.length === 0) {
		Array.from(document.getElementsByClassName("hide")).forEach(el => {el.style.display = "none"});
		document.getElementById("loseDie").style.display = "block";
	}
	document.getElementById("familyDisplay").innerHTML = string;
	document.getElementById("familyTitle").style.display = "block";
}
function updateMoney() {
	if (money <= 0) {
		Array.from(document.getElementsByClassName("hide")).forEach(el => {el.style.display = "none"});
		document.getElementById("loseMoney").style.display = "block";
	}
	document.getElementById("money").innerHTML = money;
}
