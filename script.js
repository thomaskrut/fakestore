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

function populateCustomerDetailsTable(customerDetailsTable) {
    const template = document.getElementById('customer-details-table-template').innerHTML;
    const urlParams = Object.fromEntries((new URLSearchParams(window.location.search)));
    customerDetailsTable.innerHTML = Mustache.render(template, urlParams);
}

function buyProduct(productId) {
    window.location = 'order.html?productid=' + productId;
}

function populateProductTable(products, productTable) {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('productid')) {
        const productIdElement = document.getElementById('selected-product-id');
        productIdElement && (productIdElement.value = urlParams.get('productid'));
        products = products.filter(p => p.id == urlParams.get('productid'));
    }
    const cardTemplate = document.getElementById('product-card-template').innerHTML;
    const modalTemplate = document.getElementById('product-modal-template').innerHTML;

    products.map(p => adjustProductForDisplay(p)).forEach(p => {
        productTable.insertAdjacentHTML('beforeend', Mustache.render(cardTemplate, p) + Mustache.render(modalTemplate, p));
    });
}

function adjustProductForDisplay(product) {
    product.modalId = "modal" + product.id;
    product.rating.width = product.rating.rate / 5 * 100 + "%";
    product.rating.text = product.rating.rate + " stars (" + product.rating.count + " votes)";
    product.price = { whole: "$" + product.price.toFixed(0), decimals: product.price.toFixed(2).split('.')[1].substring(0, 2) };
    product.toggleModal = "$('#" + product.modalId + "').modal('toggle');";
    product.buyProduct = "buyProduct("  + product.id + ")";
    return product;
}

(function initForms() {
    const markInputValidity = (input, isValid) => { input.classList.toggle('is-valid', isValid); input.classList.toggle('is-invalid', !isValid); };
    const stopFormSubmissionIfInvalid = (form, event) => { if (!form.checkValidity()) event.preventDefault(); }

    [...document.getElementsByTagName('form')].forEach(form => {
        form.addEventListener('submit', (event) => { form.classList.add('was-validated'); stopFormSubmissionIfInvalid(form, event); });
        form.addEventListener('change', (event) => { markInputValidity(event.target, event.target.checkValidity()) });
    })
})();

(function initTables() {
    [...document.getElementsByTagName('div')].forEach((div) => {
        switch (div.id) {
            case 'product-table': getProductsFromAPI(div); break;
            case 'products-in-cart-table': getProductsFromAPI(div); break;
            case 'customer-details-table': populateCustomerDetailsTable(div); break;
        }
    })
})();