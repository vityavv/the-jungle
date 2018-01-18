let members = [];
let money = 700;

function removeMember(button) {
	button.parentNode.remove();
}
function addMember() {
	let element = document.createElement("div");
	element.setAttribute("class", "member");
	element.innerHTML = "Name: <input/> <button onClick='removeMember(this)'>Remove</button>";
	document.getElementById("family").appendChild(element);
}
function startGame() {
	let memberElements = Array.from(document.querySelectorAll(".member > input"));
	if (memberElements.length <= 0) {
		alert("You can't have a family with no members!");
		return;
	}
	memberElements.forEach(memberElement => {
		members.push(new Person(memberElement.value));
	});
	console.log(members);
}

function Person(name) {
	this.job = 0;
	this.alcoholic = false;
	this.name = name;
}
