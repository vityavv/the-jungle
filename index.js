function removeMember(thing) {
	thing.parentNode.remove();
}
function addMember() {
	let element = document.createElement("div");
	element.setAttribute("class", "member");
	element.innerHTML = "Name: <input/> <button onClick='removeMember(this)'>Remove</button>";
	document.getElementById("family").appendChild(element);
}
