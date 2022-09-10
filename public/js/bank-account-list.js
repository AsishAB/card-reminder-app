function viewBankAccount(id, btn = "") {
	document.getElementById("bankaccount-table").innerHTML = "";
	// const csrf = btn.parentNode.querySelector("[name=_csrf]").value;
	document.getElementById("loader").style.display = "block";
	fetch("/bankaccount/view-bankaccount/" + id, {
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
			document.getElementById("loader").style.display = "none";
			if (data.response == "success") {
				//console.log(data);
				document.getElementById("bank-image").src =
					data.data.TBAM_BankName.TBM_BankImage;
				var table = `
							<tr>
								<th scope="col">${data.excelSheetArrForBankAccount[0]}</th>
								<td>${data.data.TBAM_BankName.TBM_BankName}</td>
							</tr>
							<tr>
								<th scope="col">${data.excelSheetArrForBankAccount[1]}</th>
								<td>${data.data.TBAM_AccountNumber}</td>
							</tr>
							<tr>
								<th scope="col">${data.excelSheetArrForBankAccount[2]}</th>
								<td>${data.data.TBAM_IFSCCode}</td>
							</tr>
							<tr>
								<th scope="col">${data.excelSheetArrForBankAccount[3]}</th>
								<td>${data.data.TBAM_InternetBankingUserName}</td>
							</tr>
							<tr>
								<th scope="col">${data.excelSheetArrForBankAccount[4]}</th>
								<td>${data.data.TBAM_InternetBankingPassword}</td>
							</tr>
							<tr>
								<th scope="col">${data.excelSheetArrForBankAccount[5]}</th>
								<td>${data.data.TBAM_CreditCards}</td>
							</tr>
							<tr>
								<th scope="col">${data.excelSheetArrForBankAccount[6]}</th>
								<td>${data.data.TBAM_ContactNumbers}</td>
							</tr>
							<tr>
								<th scope="col">${data.excelSheetArrForBankAccount[7]}</th>
								<td>${data.data.TBAM_ContactEmailIds}</td>
							</tr>
							`;
				document.getElementById("bankaccount-table").innerHTML += table;
				var myModal = new bootstrap.Modal(
					document.getElementById("bankAccSecretDetailsModal")
				);
				myModal.show();
			} else {
				console.log("Some Error in public->js->bank-account-list.js");
			}
		})
		.catch(err => {
			console.log("Some Server Error in public->js->bank-account-list.js\n");
			console.log(err);
		});
}

function deleteBankAccount(id, btn = "") {
	// const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

	document.getElementById("loader").style.display = "block";
	fetch("/bankaccount/delete-bankaccount/" + id, {
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
			// console.log(data);
			document.getElementById("loader").style.display = "none";
			if (data.response == "success") {
				console.log("Inside public folder -> js -> bank-account-list.js");
				console.log(data.message);
				location.reload();
				//productElement.parentNode.removeChild(productElement);
			} else {
				console.log("Inside public folder -> js -> bank-account-list.js");
				console.log(data.message);
			}
		})
		.catch(err => {
			console.log(err);
		});
}

function alertMessageBankAcc() {
	Swal.fire({
		title:
			"P.S - The file will download all the details, including the Account Numbers and Internet Banking User Details",
		text: `If you want to hide these sensitive details, you should click the 'CSV' button instead`,
		icon: "warning",
		showCancelButton: true,
		confirmButtonText: "Download File",
		confirmButtonAriaLabel: "Download File",
		cancelButtonText: "Cancel",
		cancelButtonColor: "#d33",
		cancelButtonAriaLabel: "Cancel",
	})
		.then(result => {
			if (result.isConfirmed) {
				//document.getElementById("loader").style.display = "block";
				window.location = "/bankaccount/exportToExcel";
				// method: "GET",

				// })
				// .then(result => {
				//     return result.json();
				// })
				// //.then(data => {
				//     // console.log(data);
				//     // return;
				//     // if (data.response == 'error') {
				//     //     swal("There was some error in downloading the file. Please refresh the page and try again. If the issue persists, contact us");
				//     // } else {
				//     //     return false;
				//     // }
				// //})
			} else {
				return false;
			}
		})
		.catch(err => {
			Swal.fire(
				"Server Error. Please refresh the page and try again. If the issue persists, contact us"
			);
		});
}
