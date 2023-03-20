async function getProductsFromAPI() {
    return (await fetch('https://fakestoreapi.com/products')).json();
}

const saveInLocalStorage = (name, object) => localStorage.setItem(name, JSON.stringify(object));
const loadFromLocalStorage = (name) => JSON.parse(localStorage.getItem(name));

function populateCustomerDetailsTable(customerDetails, customerDetailsTable) {
    Object.keys(customerDetails).forEach((key) => {
        const row = document.querySelector('.customer-details-table-row').cloneNode(true)
        const propertyNameCell = row.querySelector('.customer-details-table-property-name-cell')
        const propertyValueCell = row.querySelector('.customer-details-table-property-value-cell')

        propertyNameCell.querySelector('.customer-details-table-property-name').innerHTML = (key.charAt(0).toUpperCase() + key.slice(1) + ':').replace(/-/g, " ")
        propertyValueCell.querySelector('.customer-details-table-property-value').innerHTML = customerDetails[key]

        row.classList.remove('hidden')
        customerDetailsTable.appendChild(row)
      });
}

function buyProduct(product) {
    saveInLocalStorage('product', product);
    window.location = 'order.html';
}

function populateProductTable(products, productTable, showBuyButton = true) {
    products.forEach(p => {
        const row = document.querySelector('.product-table-row').cloneNode(true)
        const imageCell = row.querySelector('.product-table-image-cell')
        const descriptionCell = row.querySelector('.product-table-description-cell')

        imageCell.querySelector('.product-table-image').src = p.image
        imageCell.querySelector('.product-table-image').alt = 'Image of ' + p.title

        descriptionCell.querySelector('.title').innerHTML = p.title
        descriptionCell.querySelector('.category').innerHTML = p.category
        descriptionCell.querySelector('.description').innerHTML = p.description
        descriptionCell.querySelector('.rating-upper').style.width = p.rating.rate / 5 * 100 + "%"
        descriptionCell.querySelector('.rating-text').innerHTML = p.rating.rate + " stars (" + p.rating.count + " votes)"
        descriptionCell.querySelector('.price').innerHTML = "$" + p.price.toFixed(2)

        if (showBuyButton) {
            descriptionCell.querySelector('.add-to-cart-button').addEventListener("mousedown", () => buyProduct(p))
        } else {
            descriptionCell.querySelector('.add-to-cart-button').classList.add('hidden')
        }
        
        row.classList.remove('hidden')
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
    const tables = Array.from(document.querySelectorAll('table'))

    tables.forEach((table) => {
        switch(table.id) {
            case 'product-table': getProductsFromAPI().then((products) => populateProductTable(products, table)); break;
            case 'products-in-cart-table': populateProductTable([loadFromLocalStorage('product')], table, false); break;
            case 'customer-details-table': populateCustomerDetailsTable(loadFromLocalStorage('customer-details'), table); break;
        }
    })
})();