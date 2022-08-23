function deleteProduct(id, btn) {
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;
    const productElement = btn.closest('.col-md-6');
    
    fetch('/admin/delete-product/' + id , {
        method:"DELETE",
        headers: {
            'csrf-token': csrf
        }
    })
    .then(result => {
        //console.log(result);
        return result.json()
    })
    .then(data => {
        console.log(data);
        if (data.response == 'success') {
            console.log("Inside public folder -> js -> ajax-scripts.js");
            console.log(data.message);
            productElement.parentNode.removeChild(productElement);
        } else {
            console.log("Inside public folder -> js -> ajax-scripts.js");
            console.log(data.message);
        }

    })
    .catch(err => {
        console.log(err);
    });
    

}
    