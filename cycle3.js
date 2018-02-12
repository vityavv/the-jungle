function chooseCycleThree(element) {
	let chosen = Math.floor(Math.random()*6);chosen=2;
	let member, stringl
	switch (chosen) {
		case 0:
			let freeMembers = members.filter(person => !person.jail);
			if (!freeMembers.length) {
				let member = members[Math.floor(Math.random()*members.length)];
				member.daysTillOut += 10;
				let string = `"${member.name}" got their jail sentence increased to ${member.daysTillOut} cycles.`;
				updateStatus(string);
				element.innerHTML = `<h3>${string}</h3><br><br><button onClick='nextCycleChoose(this)'>Next</button>`;
				return;
			}
			member = freeMembers[Math.floor(Math.random()*freeMembers.length)];
			member.jail = true;
			member.daysTillOut = 10;
			member.job = 0;
			string = `"${member.name}" got into jail for 10 days and lost their job`;
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
					updateStatus(string);
					element.innerHTML = `<h3>${string}</h3><br><br><button onClick="nextCycleChoose(this)">Next</button>`;
				} else {
					string = `"${member.name}" went to the drug den and spent $5 to escape their sorrow`;
					money -= 5;
					updateStatus(string);
					element.innerHTML = `<h3>${string}</h3><br><br><button onClick="nextCycleChoose(this)">Next</button>`;
				}
			} else {
				member.druggie = true;
				string = `"${member.name}" stumbled upon a drug den and got drawn inside. They were compelled by the pull of drugs and got addictied.`;
				updateStatus(string);
				element.innerHTML = `<h3>${string}</h3><br><br><button onClick='nextCycleChoose(this)'>Next</button>`;
			}
			break;
	}
}
