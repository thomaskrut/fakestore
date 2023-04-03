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
                populateProductTable(JSON.parse(requests[index].response), target, true);
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

function populateProductTable(products, productTable, shouldBeAdjusted) {
    const cardTemplate = document.getElementById('product-card-template').innerHTML;
    const modalTemplate = document.getElementById('product-modal-template').innerHTML;

    products.forEach(p => {
        if (shouldBeAdjusted) p = adjustProductForDisplay(p);
        productTable.insertAdjacentHTML('beforeend', Mustache.render(cardTemplate, p) + Mustache.render(modalTemplate, p));
    });
}

function adjustProductForDisplay(product) {
    product.modalId = "modal" + product.id;
    product.rating.width = product.rating.rate / 5 * 100 + "%";
    product.rating.text = product.rating.rate + " stars (" + product.rating.count + " votes)";
    product.price = { whole: "$" + product.price.toFixed(0), decimals: product.price.toFixed(2).split('.')[1].substring(0, 2) };
    product.toggleModal = "$('#" + product.modalId + "').modal('toggle');";
    product.buyProduct = "buyProduct(" + JSON.stringify(product) + ")";
    return product;
}

(function initForms() {
    const getFormValues = (form) => Object.fromEntries(new FormData(form).entries());
    const markInputValidity = (input, isValid) => { input.classList.toggle('is-valid', isValid); input.classList.toggle('is-invalid', !isValid); };
    const stopFormSubmissionIfInvalid = (form, event) => (form.checkValidity()) ? saveInLocalStorage(form.id, getFormValues(form)) : event.preventDefault();

    [...document.getElementsByTagName('form')].forEach(form => {
        form.addEventListener('submit', (event) => { form.classList.add('was-validated'); stopFormSubmissionIfInvalid(form, event); });
        form.addEventListener('change', (event) => { markInputValidity(event.target, event.target.checkValidity())});
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