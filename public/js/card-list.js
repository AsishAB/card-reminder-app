function viewCard(id, btn = "") {
	// const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
	//const productElement = btn.closest(".col-md-6");

	fetch("/cards/view-card/" + id, {
		method: "GET",
		// body: JSON.stringify({
		// 	cardId: id,
		// }),
		// headers: {
		// 	"Content-Type": "application/json",
		// },
	})
		.then(result => {
			return result.json();
		})
		.then(data => {
			if (data.response == "success") {
				//console.log(data);
				document.getElementById("card-image").src =
					data.data.TCR_BankName.TBM_BankImage;
				document.getElementById("card-number").value = data.data.TCR_CardNumber;
				document.getElementById("card-month").value =
					data.data.TCR_CardExpiryMonth;
				document.getElementById("card-year").value =
					data.data.TCR_CardExpiryYear;
				document.getElementById("card-cvv").value =
					data.data.TCR_CardSecretCode;
				var myModal = new bootstrap.Modal(
					document.getElementById("cardSecretDetailsModal")
				);
				myModal.show();
			} else {
			}
		})
		.catch(err => {
			console.log(err);
		});
}

function deleteCard(id, btn = "") {
	// const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
	//const productElement = btn.closest(".col-md-6");

	fetch("/cards/delete-card/" + id, {
		method: "DELETE",
		// headers: {
		// 	"csrf-token": csrf,
		// },
	})
		.then(result => {
			//console.log(result);
			return result.json();
		})
		.then(data => {
			console.log(data);
			if (data.response == "success") {
				console.log("Inside public folder -> js -> card-list.js");
				console.log(data.message);
				location.reload();
				//productElement.parentNode.removeChild(productElement);
			} else {
				console.log("Inside public folder -> js -> card-list.js");
				console.log(data.message);
			}
		})
		.catch(err => {
			console.log(err);
		});
}
