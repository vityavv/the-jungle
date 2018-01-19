//GOOGLE COUNT: 1
//DISCORD COUNT: 0
//SO COUNT: 0

//VARS
let members = [];
let money = 700;
let cycle = 0;
let dwelling = "homeless";
let house = 0;
let jobChooser = 0;
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
function Person(name) {//Constructor for making a new person
	this.job = 0;
	this.alcoholic = false;
	this.name = name;
}
//Choosing a house
function chooseDwelling(chosenDwelling) {
	if (chosenDwelling === "house") {
		if (money >= 300) {//make sure you have enough money
			dwelling = "house";
			house = 10;//this is a counting-down number---when it reaches 0 you stop paying
			money -= 300;
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
	if (skip) return;//if you're not getting a job or already have one, skip!

	Array.from(document.getElementsByClassName("job")).forEach(el => {el.style.visibility = "hidden"});
	element.style.visibility = "visible";//make sure you can only see the one you picked
	element.style.background = "white";

	let job = [0, 3, 5][Math.floor(Math.random()*3)];//see what job you get---completely random
	if (job === 0) element.innerHTML = "<h1>You didn't get a job :(</h1><br>";//Here and below; show what job you got and your options
	else element.innerHTML = `<h1>You got a job that pays $${job}!</h1><br><span id="bribe"><button onClick="bribe()">Bribe the boss for double pay - $20</button></span><br><br>`;
	element.innerHTML += "<button onClick='nextChoose(this)'>Next</button>";
	element.removeAttribute("onClick");//make sure that it doesn't change when you click on it by taking that away

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
}
function nextChoose(element) {
	jobChooser++;//next jobChooser
	if (!members[jobChooser]) {
		//TODO: go to game
		return;
	}
	document.getElementById("jobChooser").innerText = members[jobChooser].name;//show their name
	Array.from(document.getElementsByClassName("job")).forEach(el => {el.style.visibility = "visible"});//make sure you can see all of the options
	let parent = element.parentNode;
	parent.style.background = "lightcyan";//make them light-cyan again
	setTimeout(()=>{parent.setAttribute("onClick", "chooseJob(this)")}, 100);//some things I don't like, and this is one of them
	parent.innerHTML = "";//take away the text
}
//Game functions:
