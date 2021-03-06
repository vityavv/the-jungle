function chooseCycleTwo(element) {
	let chosen = Math.floor(Math.random()*6);
	let member, string;
	let jobMembers = members.filter(person => person.job !== 0);
	switch (chosen) {
		case 0:
			if (!jobMembers.length) {
				let jailMembers = members.filter(person => person.jail);
				if (jailMembers.length) {
					let member = jailMembers[Math.floor(Math.random()*jailMembers.length)];
					member.daysTillOut += 10;
					let string = `"${member.name}" got their jail sentence increased to ${member.daysTillOut} cycles.`;
					updateStatus(string);
					element.innerHTML = `<h3>${string}</h3><br><br><button onClick='nextCycleChoose(this)'>Next</button>`;
					return;
				}
				let string = `"${members[Math.floor(Math.random()*members.length)].name}" went out into the cold and froze up in the blizzard, but since they don't have a job they were dragged back home and thawed`;
				updateStatus(string);
				element.innerHTML = `<h3>${string}<br><br><button onClick="nextCycleChoose(this)">Next</button>`;
				return;
			}
			member = jobMembers[Math.floor(Math.random()*jobMembers.length)];
			string = `"${member.name}" went out into the cold and froze up in a blizzard, so they missed a day at work. They will lose their job unless you can convince the boss to let them back.`;
			updateStatus(string);
			element.innerHTML = `<h3>${string}</h3><br><br><span><button onClick='bribeToKeepJobHard(this)'>Convince the boss to keep the job - $30</button><br><br><button onClick='frozen(this, ${members.indexOf(member)})'>Quit your job</button></span>`;
			break;
		case 1:
			let stolen = (Math.floor(Math.random()*6)+1)*10;
			money -= stolen;
			string = `Your family met a con artist and got conned for $${stolen}`;
			updateStatus(string);
			element.innerHTML = `<h3>${string}</h3><br><br><button onClick='nextCycleChoose(this)'>Next</button>`;
			break;
		case 2:
			let jobLess = members.filter(person => person.job === 0 && person.canGetJob && !person.jail && !person.striker);
			if (!jobLess.length) {
				string = `A month passed and nothing happened! Yay!`;
			} else {
				member = jobLess[Math.floor(Math.random()*jobLess.length)];
				member.job = 2;
				string = `"${member.name}" gets a job and it pays them two dollars!`;
			}
			updateStatus(string);
			element.innerHTML = `<h3>${string}</h3><br><br><button onClick="nextCycleChoose(this)">Next</button>`;
			break;
		case 3:
			babies++;
			string = "Your family gets a baby! It's up to your imagination to know how";
			updateStatus(string);
			element.innerHTML = `<h3>${string}</h3><br><br><button onClick="nextCycleChoose(this)">Next</button>`;
			break;
		case 4:
			let memberIndex = Math.floor(Math.random()*members.length);
			let number;
			if (dwelling === "homeless" || members[memberIndex].jail) {
				string = `"${members[memberIndex].name}" turned depressed, and because of the state of your family they decided to end it all, and killed themselves`;
				members.splice(memberIndex, 1);
				updateFamily();
			} else {
				if (dwelling === "rent") number = 0.5;
				else if (dwelling === "house") number = 0.3;
				if (Math.random() < number) {
					string = `"${members[memberIndex].name}" turned depressed, and because of the state of your family they decided to end it all, and killed themselves`;
					members.splice(memberIndex, 1);
					updateFamily();
				} else {
					if (members[memberIndex].job) {
						string = `"${members[memberIndex].name}" turned depressed, decided to go to the salon, and spent his week's pay on drink`;
						money -= members[memberIndex].job;
					} else string = `"${members[memberIndex].name}" turned depressed, but they had nothing to lose so they pulled themselves together`;
				}
			}
			updateStatus(string);
			element.innerHTML = `<h3>${string}</h3><br><br><button onClick="nextCycleChoose(this)">Next</button>`;
			break;
		case 5:
			let canGetJobMembers = (jobMembers.length ? jobMembers : members.filter(person => person.canGetJob && !person.jail));
			if (!canGetJobMembers.length) {
				let memberIndex = Math.floor(Math.random()*members.length);
				string = `"${members[memberIndex].name}" fell into a pit, but because their hands were frostbitten they couldn't climb out. Nobody came to help them, their body froze, and they died`;
				members.splice(memberIndex, 1);
				updateFamily();
			} else {
				member = canGetJobMembers[Math.floor(Math.random()*canGetJobMembers.length)];
				member.canGetJob = false;
				string = `"${member.name}" went out into the cold and their hands got frostbite. They can't return to their job, nobody will hire them like this`;
			}
			updateStatus(string);
			element.innerHTML = `<h3>${string}</h3><br><br><button onClick="nextCycleChoose(this)">Next</button>`;
			break;
	}
}
function bribeToKeepJobHard(element) {
	if (money < 30) {
		alert("You don't have enough money!");
		return;
	}
	money -= 30;
	let string = "You bribed to boss and got to keep the job!";
	let parent = element.parentNode;
	parent.innerHTML = string;
	parent.parentNode.innerHTML += "<br><br><button onClick='nextCycleChoose(this)'>Next</button>";
}
function frozen(element, memberIndex) {
	let member = members[memberIndex];
	member.job = 0;
	let string = `"${member.name}" lost their job because they froze out in the blizzard and missed a day at work.`;
	updateStatus(string);
	let parent = element.parentNode;
	parent.innerHTML = string;
	parent.parentNode.innerHTML += "<br><br><button onClick='nextCycleChoose(this)'>Next</button>";
}
