function getMonthWithin12() {
	const cardexpirymonth = document.getElementById("cardexpirymonth").value;

	if (cardexpirymonth > 12) {
		document.getElementById("cardexpirymonth").value = 12;
	}
	if (cardexpirymonth < 0) {
		document.getElementById("cardexpirymonth").value = 1;
	}
	// if (cardexpirymonth == 0 || cardexpirymonth == '') {
	//   document.getElementById('cardexpirymonth').value = '00';
	// }
}
function getYearCorrectly() {
	let cardexpiryyear = document.getElementById("cardexpiryyear").value;
	cardexpiryyear = cardexpiryyear != "" ? Number("20" + cardexpiryyear) : "";
	const cardexpirymonth = document.getElementById("cardexpirymonth").value;
	const currentYear = new Date().getFullYear();
	const adjustedYear = cardexpiryyear != "" ? currentYear - 2000 : "";

	// if (cardexpirymonth != '' && cardexpirymonth != '00' &&  cardexpiryyear == '') {
	//   document.getElementById('cardexpiryyear').value = adjustedYear;
	// }
	if (cardexpiryyear != "" && cardexpiryyear < currentYear) {
		document.getElementById("cardexpiryyear").value = adjustedYear;
	}
}
