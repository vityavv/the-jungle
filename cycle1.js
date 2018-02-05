function chooseCycleOne(element) {
	let chosen = Math.floor(Math.random()*6);
	console.log(chosen);
	let member;
	let jobMembers = members.filter(person => person.job !== 0);
	let string;
	switch (chosen) {
		case 0:
			member = Math.floor(Math.random()*members.length);
			let otherMember = false;
			if (dwelling === "homeless") {
				string = `"${members[member].name}" got sick, and because your family is homeless their condition escalated and they died`;
				updateStatus(string);
				element.innerHTML = `<h3>${string}</h3><br><br><button onClick="nextCycleChoose(this)">Next</button>`;
				members.splice(member, 1);
				updateFamily();
				return
			} else if (dwelling === "rent") {
				string = "";
				if (members.length > 1) {
					otherMember = Math.floor(Math.random()*(members.length-1));
					if (member === otherMember) otherMember = members.length-1;
					string = `"${members[member].name}" got sick, and because you rent a very small room their condition spread to "${members[otherMember].name}"`;
				} else {
					string = `"${members[member].name}" got sick`;
				}
			} else {
				string = `"${members[member].name}" got sick`;
			}
			updateStatus(string);
			let array = otherMember ? [member, otherMember] : [member];
			element.innerHTML = `<h3>${string}</h3><br><br>Press a button to see if they live:<br><button onClick="payForDoctor(${JSON.stringify(array)}, this)">Pay for a doctor - $10</button><br><button onClick="dontPayForDoctor(${JSON.stringify(array)}, this)">Take your Chances</button>`;
			break;
		case 1:
			if (!jobMembers.length) {
				let string = "The companies were downsizing today, but since nobody has a job in your family, you were untouched"
				updateStatus(string);
				element.innerHTML = `<h3>${string}</h3><br><br><button onClick='nextCycleChoose(this)'>Next</button>`;
				return;
			}
			member = jobMembers[Math.floor(Math.random()*jobMembers.length)];
			member.job = 0;
			string = `"${member.name}" lost their job.`;
			updateStatus(string);
			element.innerHTML = `<h3>${string}</h3><br><br><button onClick='nextCycleChoose(this)'>Next</button>`;
			break;
		case 2:
			if (!jobMembers.length) {
				let string = `"${members[Math.floor(Math.random()*members.length)].name}" overslept today, but since they don't have a job it doesn't matter`;
				updateStatus(string);
				element.innerHTML = `<h3>${string}</h3><br><br><button onClick='nextCycleChoose(this)'>Next</button>`;
				return;
			}
			member = jobMembers[Math.floor(Math.random()*jobMembers.length)];
			string = `"${member.name}" overslept and is at risk of losing their job`;
			updateStatus(string);
			element.innerHTML = `<h3>${string}</h3><br><br><span><button onClick='bribeToKeepJob(this)'>Bribe the boss to keep the job - $10</button><br><br><button onClick='oversleptChances(this, ${members.indexOf(member)})'>Try returning to your job</button></span>`;
			break;
		case 3:
			string = `A month passed and nothing happened! Yay!`;
			updateStatus(string);
			element.innerHTML = `<h3>${string}</h3><br><br><button onClick='nextCycleChoose(this)'>Next</button>`;
			break;
		case 4:
			let drys = members.filter(person => !person.alcoholic);
			if (drys.length) {
				let member = drys[Math.floor(Math.random()*drys.length)];
				member.alcoholic = true;
				let string = `"${member.name}" fell victim to alcohol and is now an alcoholic, so they must pay $1 every month`;
				updateStatus(string);
				element.innerHTML = `<h3>${string}</h3><br><br><button onClick='nextCycleChoose(this)'>Next</button>`;
			} else {
				let string = `"${members[Math.floor(Math.random()*members.length)].name}" went on a drinking spree and spent a dollar on drinks.`;
				money -= 1;
				updateStatus(string);
				element.innerHTML = `<h3>${string}</h3><br><br><button onClick='nextCycleChoose(this)'>Next</button>`;
			}
			break;
		case 5:
			if (jobMembers.length) {
				let member = jobMembers[Math.floor(Math.random()*jobMembers.length)];
				let string = `"${member.name}" went out into the cold and their hands froze off. Their pay got cut in half as a punishment.`;
				member.job /= 2;
				updateStatus(string);
				element.innerHTML = `<h3>${string}</h3><br><br><button onClick='nextCycleChoose(this)'>Next</button>`;
			} else {
				let string = `"${members[Math.floor(Math.random()*members.length)].name}" went out into the cold and their hands froze off. However, since they don't have a job, they just came back inside and thawed their hands.`;
				updateStatus(string);
				element.innerHTML = `<h3>${string}</h3><br><button onClick='nextCycleChoose(this)'>Next</button>`;
			}
			break;
	}
}
function seeIfTheyGetBetter(betterArray, sicks) {
	let newInner = "<h3>";
	sicks.forEach(sick => {
		let die = betterArray[Math.floor(Math.random()*betterArray.length)];
		if (die) {
			let string = `"${sick.name}" died from their sickness`;
			updateStatus(string);
			members.splice(members.indexOf(sick), 1);
			updateFamily();
			newInner += `${string}<br>`;
		} else {
			let string = `"${sick.name}" got better and is no longer sick!`;
			updateStatus(string);
			newInner += `${string}<br>`;
		}
	});
	newInner += "</h3><br><br><button onClick='nextCycleChoose(this)'>Next</button>";
	return newInner;
}
function payForDoctor(sicks, element) {
	sicks = sicks.map(sick => members[sick]);
	if (money < 10) {
		alert("You don't have enough money!");
		return;
	}
	money -= 10;
	let newInner = seeIfTheyGetBetter([true, false], sicks);
	element.parentNode.innerHTML = newInner;
}
function dontPayForDoctor(sicks, element) {
	sicks = sicks.map(sick => members[sick]);
	let newInner = seeIfTheyGetBetter([true, true, false], sicks);
	element.parentNode.innerHTML = newInner;
}
function bribeToKeepJob(element) {
	if (money < 10) {
		alert("You don't have enough money!");
		return;
	}
	money -= 10;
	let string = "You bribed the boss and got to keep the job!";
	let parent = element.parentNode;
	parent.innerHTML = string;
	parent.parentNode.innerHTML += "<br><br><button onClick='nextCycleChoose(this)'>Next</button>"
}
function oversleptChances(element, memberIndex) {
	let member = members[memberIndex];
	if (Math.random() > (1/3)) {
		member.job = 0;
		let string = `"${member.name}" lost their job because they overslept.`;
		updateStatus(string);
		let parent = element.parentNode;
		parent.innerHTML = string;
		parent.parentNode.innerHTML += "<br><br><button onClick='nextCycleChoose(this)'>Next</button>";
	} else {
		let string = `"${member.name}" came back to their job after oversleeping and their boss decided to be generous and let them stay!`;
		updateStatus(string);
		let parent = element.parentNode;
		parent.innerHTML = string;
		parent.parentNode.innerHTML += "<br><br><button onClick='nextCycleChoose(this)'>Next</button>";
	}
}
