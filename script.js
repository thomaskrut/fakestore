function getProductsFromAPI(target) {

    const apis = ['https://mocki.io/v1/a99e6cf4-1e5a-4b0e-bc57-6c651f0f09cd', 'https://fakestoreapi.com/products']
    const requests = apis.map(a => )
    const xhr1 = new XMLHttpRequest();
    const xhr2 = new XMLHttpRequest();

    xhr1.open('GET', 'https://mocki.io/v1/a99e6cf4-1e5a-4b0e-bc57-6c651f0f09cd');
    xhr2.open('GET', 'https://fakestoreapi.com/products');

    xhr1.send();
    xhr2.send();

    xhr1.onreadystatechange = () => {
        if (xhr1.readyState === 4 && xhr1.status === 200) {
            xhr2.abort();
            console.log("connected to https://mocki.io/v1/a99e6cf4-1e5a-4b0e-bc57-6c651f0f09cd")
            populateProductTable(JSON.parse(xhr1.response), target);
        }
    }

    xhr2.onreadystatechange = () => {
        if (xhr2.readyState === 4 && xhr2.status === 200) {
            xhr1.abort()
            console.log("connected to https://fakestoreapi.com/products")
            populateProductTable(JSON.parse(xhr2.response), target);
        }
    }

}

const saveInLocalStorage = (name, object) => localStorage.setItem(name, JSON.stringify(object));
const loadFromLocalStorage = (name) => JSON.parse(localStorage.getItem(name));

function populateCustomerDetailsTable(customerDetails, customerDetailsDiv) {
    const rowTemplate = customerDetailsDiv.querySelector('tr');
    
    Object.entries(customerDetails).forEach(([key, value]) => {
        const row = rowTemplate.cloneNode(true);
        
        row.cells[0].textContent = key.replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) + ':';
        row.cells[1].textContent = value;
        row.classList.remove('d-none');
        
        customerDetailsDiv.firstElementChild.appendChild(row);
    });
}

function buyProduct(product) {
    saveInLocalStorage('product', product);
    window.location = 'order.html';
}

function populateProductTable(products, productTable, showBuyButton = true) {
    products.forEach(p => {

        const row = document.querySelector('.product-col').cloneNode(true)
        const modal = document.querySelector('.modal').cloneNode(true)
        modal.id = 'modal' + p.id;
        modal.querySelector('.btn-close').addEventListener('click', () => {
            $('#modal' + p.id).modal('toggle');
        });

        [row, modal].forEach(e => {
            e.querySelector('.product-title').innerHTML = p.title;
            e.querySelector('.description').innerHTML = p.description;
            e.querySelector('.product-table-image').src = p.image;
            e.querySelector('.product-table-image').alt = 'Image of ' + p.title;
            e.querySelector('.rating-upper').style.width = p.rating.rate / 5 * 100 + "%"
            e.querySelector('.rating-text').innerHTML = p.rating.rate + " stars (" + p.rating.count + " votes)"
            e.querySelector('.price').innerHTML = "$" + p.price.toFixed(0)
            e.querySelector('.decimals').innerHTML = (((p.price - Math.floor(p.price)) * 100) + "0").substring(0, 2);
        })

        row.querySelector('.card-body').addEventListener('click', () => {
            $('#modal' + p.id).modal('toggle');
        });

        row.querySelector('.product-table-image').addEventListener('click', () => {
            $('#modal' + p.id).modal('toggle');
        });

        row.querySelector('.category').innerHTML = p.category
        

        if (showBuyButton) {
            [row, modal].forEach(e => {
                e.querySelector('.add-to-cart-button').addEventListener("mousedown", () => buyProduct(p))
            });
        } else {
            [row, modal].forEach(e => {
                e.querySelector('.add-to-cart-button').classList.add('d-none')
            });
        }

        row.classList.remove('d-none')
        productTable.appendChild(row)
        productTable.appendChild(modal);

    });

}

(function initForms() {
    const getFormValues = (form) => Object.fromEntries(new FormData(form).entries());
    const markInputValidity = (input, isValid) => { input.classList.toggle('is-valid', isValid); input.classList.toggle('is-invalid', !isValid); };
    const stopFormSubmissionIfInvalid = (form, event) => (form.checkValidity()) ? saveInLocalStorage(form.id, getFormValues(form)) : event.preventDefault();
    
    [...document.getElementsByTagName('form')].forEach(form => {
        form.addEventListener('submit', (event) => { form.classList.add('was-validated'); stopFormSubmissionIfInvalid(form, event); });
        form.addEventListener('change', (event) => markInputValidity(event.target, event.target.checkValidity()));
    })
})();

(function initTables() {
    [...document.getElementsByTagName('div')].forEach((div) => {
        switch (div.id) {
            case 'product-table': getProductsFromAPI(div); break;
            case 'products-in-cart-table': populateProductTable([loadFromLocalStorage('product')], div, false); break;
            case 'customer-details': populateCustomerDetailsTable(loadFromLocalStorage('customer-details'), div); break;
        }
    })
})();