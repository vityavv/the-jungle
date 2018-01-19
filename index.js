//VARS
let members = [];
let money = 700;
let cycle = 0;
let dwelling = "homeless";
let house = 0;
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
		if (money >= 300) {
			dwelling = "house";
			house = 10;
			money -= 300;
		} else {
			alert("You don't have enough money for that!");
			return;
		}
	} else if (chosenDwelling === "rent") {
		dwelling = "rent";
		house = 0;
	} else {
		dwelling = "homeless";
		house = 0;
	}
}
