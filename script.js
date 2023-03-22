async function getProductsFromAPI() {
    return (await fetch('https://mocki.io/v1/a99e6cf4-1e5a-4b0e-bc57-6c651f0f09cd')).json();
}

const saveInLocalStorage = (name, object) => localStorage.setItem(name, JSON.stringify(object));
const loadFromLocalStorage = (name) => JSON.parse(localStorage.getItem(name));

function populateCustomerDetailsTable(customerDetails, customerDetailsDiv) {
    Object.keys(customerDetails).forEach((key) => {
        const row = document.querySelector('.customer-details-table-row').cloneNode(true)

        row.querySelector('.customer-details-table-property-name').innerHTML = (key.charAt(0).toUpperCase() + key.slice(1) + ':').replace(/-/g, " ")
        row.querySelector('.customer-details-table-property-value').innerHTML = customerDetails[key]

        row.classList.remove('d-none')
        customerDetailsDiv.querySelector('.customer-details-table').appendChild(row)
      });
}

function buyProduct(product) {
    saveInLocalStorage('product', product);
    window.location = 'order.html';
}

function populateProductTable(products, productTable, showBuyButton = true) {
    products.forEach(p => {
        const row = document.querySelector('.product-col').cloneNode(true)

        row.querySelector('.product-table-image').src = p.image
        row.querySelector('.product-table-image').alt = 'Image of ' + p.title
        row.querySelector('.card-title').innerHTML = p.title
        row.querySelector('.category').innerHTML = p.category
        row.querySelector('.description').innerHTML = p.description
        row.querySelector('.description').addEventListener('click', (event) => {
            event.target.classList.contains('text-truncate') ? event.target.classList.remove('text-truncate') : event.target.classList.add('text-truncate');
        });

       
        row.querySelector('.rating-upper').style.width = p.rating.rate / 5 * 100 + "%"
        row.querySelector('.rating-text').innerHTML = p.rating.rate + " stars (" + p.rating.count + " votes)"
        row.querySelector('.price').innerHTML = "$" + p.price.toFixed(2)

       

        if (showBuyButton) {
            row.querySelector('.add-to-cart-button').addEventListener("mousedown", () => buyProduct(p))
        } else {
            row.querySelector('.add-to-cart-button').classList.add('d-none')
        }
        
        row.classList.remove('d-none')
        productTable.appendChild(row)
        
    });

}

const validationPatterns = {
    'email': /^(?=.{1,50}$)[^@]+@[^@]+$/i,
    'phone': /^(?=.{1,50}$)(\d|-|\(|\))+$/i,
    'full-name': /^.{2,50}$/i,
    'street-and-number': /^.{1,50}$/i,
    'postal-code': /^[0-9]{3} [0-9]{2}$/i,
    'city': /^.{2,50}$/i,
};

(function initForms() {
    const markInputAsValid = (input) => { input.classList.add('is-valid'); input.classList.remove('is-invalid'); return true }
    const markInputAsInValid = (input) => { input.classList.add('is-invalid'); input.classList.remove('is-valid'); return false }
    const validateSingleInput = (input) => validationPatterns[input.id].test(input.value) ? markInputAsValid(input) : markInputAsInValid(input)
    const getFormInputs = () => Array.from(document.querySelectorAll('.form-input'));
    const allInputsAreValid = () => getFormInputs().every((input) => validateSingleInput(input))
    const getInputsAsObject = () => Object.fromEntries(getFormInputs().map((input) => [input.id, input.value]))
    const forms = Array.from(document.querySelectorAll('.needs-validation'));

    forms.forEach((form) => {
        form.addEventListener('submit', (event) => allInputsAreValid() ? saveInLocalStorage(form.id, getInputsAsObject()) : event.preventDefault());
        form.addEventListener('change', (event) => validateSingleInput(event.target, validationPatterns[event.target.attributes.id.value]));
    })
})();

(function initTables() {
    const divs = Array.from(document.querySelectorAll('div'))

    divs.forEach((div) => {
        switch(div.id) {
            case 'product-table': getProductsFromAPI().then((products) => populateProductTable(products, div)); break;
            case 'products-in-cart-table': populateProductTable([loadFromLocalStorage('product')], div, false); break;
            case 'customer-details': populateCustomerDetailsTable(loadFromLocalStorage('customer-details'), div); break;
        }
    })
})();