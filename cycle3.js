function chooseCycleThree(element) {
	let chosen = Math.floor(Math.random()*6);
	let member, string = "";
	switch (chosen) {
		case 0:
			let freeMembers = members.filter(person => !person.jail);
			if (!freeMembers.length) {
				let member = members[Math.floor(Math.random()*members.length)];
				member.daysTillOut += 10;
				string = `"${member.name}" got their jail sentence increased to ${member.daysTillOut} cycles.`;
			} else {
				member = freeMembers[Math.floor(Math.random()*freeMembers.length)];
				member.jail = true;
				member.daysTillOut = 10;
				member.job = 0;
				string = `"${member.name}" got into jail for 10 days and lost their job`;
			}
			updateStatus(string);
			element.innerHTML = `<h3>${string}</h3><br><br><button onClick='nextCycleChoose(this)'>Next</button>`;
			break;
		case 1:
			string = `A month passed and nothing happened! Yay!`;
			updateStatus(string);
			element.innerHTML = `<h3>${string}</h3><br><br><button onClick='nextCycleChoose(this)'>Next</button>`;
			break;
		case 2:
			member = members[Math.floor(Math.random()*members.length)];
			if (member.druggie) {
				if (member.job) {
					string = `"${member.name}" showed up to their job under the influence of drugs, didn't get payed, and got their wages cut in half as punishment`;
					money -= member.job;
					member.job /= 2;
				} else {
					string = `"${member.name}" went to the drug den and spent $5 to escape their sorrow`;
					money -= 5;
				}
			} else {
				member.druggie = true;
				string = `"${member.name}" stumbled upon a drug den and got drawn inside. They were compelled by the pull of drugs and got addictied.`;
			}
			updateStatus(string);
			element.innerHTML = `<h3>${string}</h3><br><br><button onClick='nextCycleChoose(this)'>Next</button>`;
			break;
		case 3:
			member = Math.floor(Math.random()*members.length);
			if (members[member].jail) {
				string = `"${members[member].name}" got sick in jail`;
				updateStatus(string);
				element.innerHTML = `<h3>${string}</h3><br><br>Press a button to see if they live:<br><button onClick="dontPayForDoctor(${JSON.stringify([member])}, this)">Take your Chances</button>`;
				break;
			}
			let otherMember = false;
			if (dwelling === "homeless") {
				string = `"${members[member].name}" got sick, and because your family is homeless their condition escalated and they died`;
				updateStatus(string);
				element.innerHTML = `<h3>${string}</h3><br><br><button onClick="nextCycleChoose(this)">Next</button>`;
				members.splice(member, 1);
				updateFamily();
				return;
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
		case 4:
			if (babies) {
				string = `One of your family's infants died of sickness.`;
				babies--;
				updateStatus(string);
				element.innerHTML = `<h3>${string}</h3><br><br><button onClick="nextCycleChoose(this)">Next</button>`;
			} else {
				string = `"${members[Math.floor(Math.random()*members.length)].name}" chances upon a $10 bill outside and brings it home to your family`;
				money += 10;
			}
			updateStatus(string);
			element.innerHTML = `<h3>${string}</h3><br><br><button onClick="nextCycleChoose(this)">Next</button>`;
			break;
		case 5:
			let cantGetJob = members.filter(person => !person.canGetJob && !person.jail);
			if (cantGetJob.length) {
				let member = cantGetJob[Math.floor(Math.random()*cantGetJob.length)];
				member.canGetJob = true;
				string = `Someone sees "${member.name}" out in the street and takes pity on their injuries, so they take them to the hospital and get them fixed up.`;
			} else {
				string = `Someone sees "${members[Math.floor(Math.random()*members.length)].name}", takes pity on them, and takes them out to dinner`;
			}
			updateStatus(string);
			element.innerHTML = `<h3>${string}</h3><br><br><button onClick="nextCycleChoose(this)">Next</button>`;
			break;
	}
}
