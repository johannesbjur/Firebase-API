const url = 'https://us-central1-fir-api-d8bf2.cloudfunctions.net'

// addProduct("Orange", "fruit")


function initializeApp() {

    getAllProducts().then( data => {
        data.forEach( product => {
            document.getElementById('product-tbody').innerHTML = document.getElementById('product-tbody').innerHTML + 
                `<tr>
                    <input type="hidden" value="${product.id}">
                    <th scope="row"></th>
                    <td>${product.name}</td>
                    <td>${product.type}</td>
                    <td class="btn-td">
                        <a href="#" class="btn btn-primary mr-3">Edit</a>
                        <button type="button" class="btn btn-danger" onCLick="deleteClick(this.parentNode.parentNode)">Delete</button>
                    </td>
                    <td></td>
                </tr>`
        });
    });
}

function addSubmit(form) {

    let product = {
        "name": form.getElementsByTagName("input")[0].value,
        "type": form.getElementsByTagName("input")[1].value
    }
    addProduct(product).then( res => {
        if(res) window.location.href = './index.html';
    });
}

function deleteClick(item) {

    const id = item.querySelector("input").value

    deleteProduct(id);
    item.remove();
}

// API Functions
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

async function addProduct(product) {

    const response = await fetch(`${url}/product`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    });

    if(response.ok) {
        console.log("Item added")
        return true
    }
    return false
}