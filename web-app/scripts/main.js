const url = 'https://us-central1-fir-api-d8bf2.cloudfunctions.net'
// const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
// const url = proxyUrl + apiUrl

getAllProducts().then( data => {

    data.forEach( product => {

        console.log(product)
        document.getElementById('product-tbody').innerHTML = document.getElementById('product-tbody').innerHTML + 
        `<tr>
            <input type="hidden" value="${product.id}">
            <th scope="row"></th>
            <td>${product.name}</td>
            <td>${product.type}</td>
            <td><button type="button" class="btn btn-danger" onCLick="deleteClick(this.parentNode.parentNode)">Delete</button></td>
         </tr>`
    });
});

function deleteClick(item) {

    const id = item.querySelector("input").value

    deleteProduct(id);

    item.remove();
}

async function getAllProducts() {

	const response = await fetch(`${url}/product`, {
        method: 'GET'
    });

	if(response.ok) {
        return response.json();
    }
}

async function deleteProduct(id) {

    const response = await fetch(`${url}/product/${id}`, {
        method: 'DELETE'
    });

    if(response.ok) {
        console.log("Item deleted")
    }

}