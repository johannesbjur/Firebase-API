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
                        <button type="button" class="btn btn-primary mr-2" onCLick="editClick(this.parentNode.parentNode)">Edit</button>
                        <button type="button" class="btn btn-danger" onCLick="deleteClick(this.parentNode.parentNode)">Delete</button>
                    </td>
                    <td></td>
                </tr>`
        });
    });
}

function initializeEdit() {

    document.getElementById('add-form').addEventListener('submit', (e) => {e.preventDefault()});

    if (sessionStorage.getItem('edit-item')) {

        document.getElementById('submit-btn').textContent = "Edit";

        let product = JSON.parse(sessionStorage.getItem('edit-item'))

        document.getElementById("product-id").value = product.id
        document.getElementById("name").value       = product.name
        document.getElementById("type").value       = product.type
    }
}

function addSubmit(form) {

    let id = document.getElementById("product-id").value
    let product = {
        "name": form.getElementsByTagName("input")[1].value,
        "type": form.getElementsByTagName("input")[2].value
    }

    if(!product.name || !product.type) {
          
        return document.getElementById("form-alert").style.display = "block";
    }

    if (id) {
        editProduct(id, product).then( res => {
            sessionStorage.clear()
            if(res) window.location.href = './index.html';
        });
    }
    else {
        addProduct(product).then( res => {
            if(res) window.location.href = './index.html';
        });
    }
}

function deleteClick(element) {

    const id = element.querySelector("input").value;

    deleteProduct(id);
    element.remove();
}

function editClick(element) {

    let product = {
        "id": element.querySelector("input").value,
        "name": element.getElementsByTagName("td")[0].textContent,
        "type": element.getElementsByTagName("td")[1].textContent
    }

    sessionStorage.setItem('edit-item', JSON.stringify(product));
    window.location.href = './add_product.html';
}

function backClick() {
    sessionStorage.clear()
    window.location.href = './index.html';
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

async function editProduct(id, product) {

    const response = await fetch(`${url}/product/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    });

    if(response.ok) {
        console.log("Item edited")
        return true
    }
    return false
}