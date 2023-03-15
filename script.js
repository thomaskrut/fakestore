async function loadAllProducts() {
    let response = await fetch('https://fakestoreapi.com/products');
    let products = await response.json();
    populateTable(products, '#products-table');
}

const saveInLocalStorage = (name, object) => localStorage.setItem(name, JSON.stringify(object));
const loadFromLocalStorage = (name) => JSON.parse(localStorage.getItem(name));

function loadCart() {
    const productInCart = loadFromLocalStorage('product')
    populateTable([productInCart], '#cart-table', false);
}

function loadCustomerDetails() {
    const customerDetails = loadFromLocalStorage('customer-details')
    populateTwoColTable(customerDetails, '#customer-details-table')
}

function populateTwoColTable(object, selector) {
    const table = document.querySelector(selector)
    
    Object.keys(object).forEach((key) => {
        const tableRow = document.createElement("tr")
        const tableCell1 = document.createElement("td")
       
        const tableCell2 = document.createElement("td")
       
        addParagraphToCell(key + '-key', (key.charAt(0).toUpperCase() + key.slice(1) + ':').replace(/-/g, " "), tableCell1)
        addParagraphToCell(key + '-value', object[key], tableCell2)
        tableRow.appendChild(tableCell1)
        tableRow.appendChild(tableCell2)
        table.appendChild(tableRow)
      });
}

function addParagraphToCell(className, textContent, cell) {
    const p = document.createElement("p");
        p.className = className;
        p.textContent = textContent;
        cell.appendChild(p);
}

function buyProduct(product) {
    saveInLocalStorage('product', product)
    window.location = 'order.html';
}

function populateTable(products, selector, showBuyButton = true) {

    const productsTable = document.querySelector(selector);

    products.forEach(p => {
        const newTableRow = document.createElement("tr");

        const imageCell = document.createElement("td");

        const descriptionCell = document.createElement("td");

        const title = document.createElement("p");
        title.className = "title";
        title.textContent = p.title;
        descriptionCell.appendChild(title);

        const category = document.createElement("p");
        category.className = "category";
        category.textContent = p.category;
        descriptionCell.appendChild(category);

        const description = document.createElement("p");
        description.className = "description";
        description.textContent = p.description;
        descriptionCell.appendChild(description);

        const starImage = document.createElement("img");
        starImage.src = "stars.png";
        starImage.style.height = "35px"
        starImage.style.width = p.rating.rate * 30 + "px";
        starImage.style.objectPosition = "0% 0";
        starImage.style.objectFit = "none";
        descriptionCell.appendChild(starImage);

        const rating = document.createElement("p");
        rating.className = "rating";
        rating.textContent = p.rating.rate + " stars (" + p.rating.count + " votes)";
        descriptionCell.appendChild(rating);

        const price = document.createElement("p");
        price.className = "price";
        price.textContent = "$" + p.price.toFixed(2);
        descriptionCell.appendChild(price);

        if (showBuyButton) {
            const buyButton = document.createElement("button");
            buyButton.className = "btn btn-success";
            buyButton.textContent = "Buy!";
            descriptionCell.appendChild(buyButton);
            buyButton.addEventListener("mousedown", () => buyProduct(p));
        }

        const productImage = document.createElement("img");
        productImage.src = p.image;
        productImage.className = "product";
        imageCell.appendChild(productImage);

        productsTable.appendChild(newTableRow);
        newTableRow.appendChild(imageCell);
        newTableRow.appendChild(descriptionCell);

    });

}

if (document.body.contains(document.getElementById('products-table'))) {
    loadAllProducts();
}

if (document.body.contains(document.getElementById('cart-table'))) {
    loadCart();
}

if (document.body.contains(document.getElementById('customer-details-table'))) {
    loadCustomerDetails();
}

const validationPatterns = {
    email: /^(?=.{1,50}$)[^@]+@[^@]+$/i,
    phone: /^(?=.{1,50}$)(\d|-|\(|\))+$/i,
    'full-name': /^.{2,50}$/i,
    'street-and-number': /^.{1,50}$/i,
    'postal-code': /^[0-9]{3} [0-9]{2}$/i,
    city: /^.{2,50}$/i,
};


const markInputAsValid = (input) => { input.classList.add('is-valid'); input.classList.remove('is-invalid') }
const markInputAsInValid = (input) => { input.classList.add('is-invalid'); input.classList.remove('is-valid') }

function validateSingleInput(input) {
    var validationPattern = validationPatterns[input.id]
    var inputIsValid = validationPattern.test(input.value);

    if (inputIsValid) {
        markInputAsValid(input)
    } else {
        markInputAsInValid(input)
    }
}

const getFormInputs = () => Array.from(document.querySelectorAll('.form-input'));
const validateAllInputs = () => getFormInputs().forEach((input) => validateSingleInput(input))
const allInputsAreValid = () => getFormInputs().every((input) => input.classList.contains('is-valid'));
const getFormsToValidate = () => Array.from(document.querySelectorAll('.needs-validation'))
const preventSubmission = (event) => { event.preventDefault(); event.stopPropagation() }

function getObjectFromInputs() {
    var inputs = getFormInputs();
    var inputsMap = inputs.map((input) => [input.id, input.value])

    return Object.fromEntries(inputsMap);
}

(function () {
    getFormsToValidate().forEach((form) => {
        form.addEventListener('submit', (event) => {
            validateAllInputs();
            if (allInputsAreValid()) {
                saveInLocalStorage(form.id, getObjectFromInputs())
            } else {
                preventSubmission(event);
            }

        });

        form.addEventListener('change', (event) => {
            validateSingleInput(event.target, validationPatterns[event.target.attributes.id.value]);
        });
    })
})()



