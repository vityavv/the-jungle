//GOOGLE COUNT: 1
//DISCORD COUNT: 1
//SO COUNT: 0

class Person {
	constructor(name) {
		this.jobStore = 0;
		this.name = name || "";
		this.alcoholicStore = false;
	}
	get job() {
		return this.jobStore;
	}
	set job(value) {
		this.jobStore = value;
		updateFamily();
	}
	get alcoholic() {
		return this.alcoholicStore;
	}
	set alcoholic(value) {
		this.alcoholicStore = value;
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
		document.getElementById("money").innerHTML = value;
		moneyStore = value;
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
}
//Choosing a house
function chooseDwelling(chosenDwelling) {
	if (chosenDwelling === "house") {
		if (money >= 300) {//make sure you have enough money
			dwelling = "house";
			house = 10;//this is a counting-down number---when it reaches 0 you stop paying
			money -= 300;
			updateStatus(`You pay $300 down for a new house! You have $${money} left`);
		} else {
			alert("You don't have enough money for that!");//if you don't...
			return;
		}
	} else if (chosenDwelling === "rent") {
		dwelling = "rent";
		house = 0;//reset the counting-down if someone loses their house
	} else {
		dwelling = "homeless";
		house = 0;//^^^
	}
	document.getElementById("job").style.display = "block";
	document.getElementById("dwelling").style.display = "none";//go to the next screen
	document.getElementById("jobChooser").innerText = members[jobChooser].name;
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
		if (money < 12) {
			//TODO: You lose
		}
		money -= 12;
		updateStatus(`You spent $12 to pay off your house. You have $${money} left.`);
	}
	if (dwelling === "rent") {
		if (money < 9) {
			//TODO: You lose
		}
		money -= 9;
		updateStatus(`You spent $9 on rent. You have $${money} left.`);
	}
	members.filter(member => member.alcoholic).forEach(member => {
		if (money < 1) {
			//TODO: You lose
		}
		money--;
		updateStatus(`You spent $1 on alcohol for "${member.name}". You have $${money} left.`);
	});
	cycle++;
	house--;
}
function chooseCycle(element) {
	Array.from(document.getElementsByClassName("cycle")).forEach(el => {el.style.visibility = "hidden"});
	element.style.visibility = "visible";
	element.style.background = "white";
	element.removeAttribute("onClick");

	if (cycleType === 0) {
		chooseCycleOne(element);
	}
}
function nextCycleChoose(element) {
	startCycle();
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
		string += "<br>"
	});
	document.getElementById("familyDisplay").innerHTML = string;
}
function updateMoney() {
	document.getElementById("money").innerHTML = money;
}
