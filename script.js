function getProductsFromAPI(target) {

    const urls = ['https://mocki.io/v1/a99e6cf4-1e5a-4b0e-bc57-6c651f0f09cd', 'https://fakestoreapi.com/products']
    const requests = [];
    urls.forEach((url, index) => {
        requests.push(new XMLHttpRequest());
        requests[index].open('GET', url);
        requests[index].send();
        requests[index].onreadystatechange = () => {
            if (requests[index].readyState === 4 && requests[index].status === 200) {
                console.log("connected to " + url);
                populateProductTable(JSON.parse(requests[index].response), target);
                requests.forEach(req => req.abort());
            }
        }
    });

}

const saveInLocalStorage = (name, object) => localStorage.setItem(name, JSON.stringify(object));
const loadFromLocalStorage = (name) => JSON.parse(localStorage.getItem(name));

function populateCustomerDetailsTable(customerDetails, customerDetailsTable) {
    const template = document.getElementById('customer-details-table-template').innerHTML;
    customerDetailsTable.innerHTML = Mustache.render(template, customerDetails);
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
            case 'customer-details-table': populateCustomerDetailsTable(loadFromLocalStorage('customer-details'), div); break;
        }
    })
})();