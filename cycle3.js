function chooseCycleThree(element) {
	let chosen = Math.floor(Math.random()*6);chosen=0;
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
	}
}
