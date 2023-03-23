const shoppingCart = {

    cart: new Map(),

    numberOfItems: 0,

    addProduct: function (product) {
        if (this.cart.has(product.id)) {
            this.cart.set(product.id, this.cart.get(product.id) + 1);
        } else {
            this.cart.set(product.id, 1);
        }
        this.numberOfItems++;
        this.saveToLocalStorage();
    },

    alterProductCount: function (productId, count) {
        this.cart.set(productId, count)
        this.saveToLocalStorage();
    },

    removeProduct: function (productId) {
        this.cart.delete(productId);
        this.saveToLocalStorage();
    },

    removeAllProducts: function () {
        if (confirm("Delete all items from order?")) {
            this.cart.clear();
            this.saveToLocalStorage();
            this.updateSum();
        }

    },

    sendOrder: function () {
        this.cart.clear();
            this.saveToLocalStorage();
            this.updateSum();
    },

    updateSum: function (products) {

        if (this.cart.size == 0) {
            window.location.href = "index.html";
            return;
        }
        let sum = 0;
        this.cart.forEach((value, key) => {
            const currentProductPrice = products.filter(p => { return p.id == key; })[0].price;
            sum = sum + currentProductPrice * value;
        })
        document.querySelector('#sumOfAll').textContent = sum.toFixed(2);

    },

    saveToLocalStorage: function () {

        localStorage.setItem('cart', JSON.stringify(Array.from(this.cart)));
        this.readFromLocalStorage();

    },

    updateCartIcon: function () {
        document.querySelector('#products-in-cart').innerHTML = this.numberOfItems;
    },

    readFromLocalStorage: function () {
        this.numberOfItems = 0;
        if (localStorage.getItem('cart') !== null) {
            const cartArray = JSON.parse(localStorage.getItem('cart'));
            cartArray.forEach(entry => {
                this.cart.set(entry[0], entry[1]);
                this.numberOfItems += entry[1];
            });
        }
        this.updateCartIcon();
    }


};

shoppingCart.readFromLocalStorage();

loadAllProducts();

async function loadAllProducts() {
    let response = await fetch('https://fakestoreapi.com/products');
    let products = await response.json();

    if (window.location.search == '?cart') {
        viewShoppingCart(products);
    } else if (window.location.search == '?checkout') {
        viewShoppingCart(products);
        viewCheckOutForm();
    } else {
        populateProductsTable(products);
    }

}

function viewCheckOutForm() {
    document.querySelector('#customer-details').style.visibility = 'visible';


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
        validationPattern.test(input.value) ? markInputAsValid(input) : markInputAsInValid(input);
    }

    const getFormInputs = () => Array.from(document.querySelectorAll('.form-input'));
    const validateAllInputs = () => getFormInputs().forEach((input) => validateSingleInput(input))
    const allInputsAreValid = () => getFormInputs().every((input) => input.classList.contains('is-valid'));
    const getFormsToValidate = () => Array.from(document.querySelectorAll('.needs-validation'))
    const preventSubmission = (event) => { event.preventDefault(); event.stopPropagation() }

    (function () {
        getFormsToValidate().forEach((form) => {
            form.addEventListener('submit', (event) => {
                validateAllInputs();
                if (allInputsAreValid()) {
                    shoppingCart.sendOrder();
                } else {
                    preventSubmission(event);
                }

            });

            form.addEventListener('change', (event) => {
                validateSingleInput(event.target, validationPatterns[event.target.attributes.id.value]);
            });
        })
    })()


}

function viewShoppingCart(products) {

    const productsTable = document.querySelector('#products-table');

    shoppingCart.cart.forEach((value, key) => {
        const count = value;
        const currentProduct = products.filter(p => { return p.id == key; })[0];
        const newTableRow = document.createElement("tr");
        newTableRow.id = currentProduct.id;

        const imageCell = document.createElement("td");
        const productImage = document.createElement("img");
        productImage.src = currentProduct.image;
        productImage.className = "cart-product";
        imageCell.appendChild(productImage);
        newTableRow.appendChild(imageCell);

        const countCell = document.createElement("td");
        const countField = document.createElement("input");
        countField.className = 'count';
        countField.min = 0;
        countField.type = 'number';
        countField.value = count;
        countField.addEventListener("input", (event) => {
            shoppingCart.alterProductCount(currentProduct.id, Number(countField.value));
            document.querySelector('#sum' + currentProduct.id).textContent = (currentProduct.price * countField.value).toFixed(2);
            shoppingCart.updateSum(products);
        });
        countCell.appendChild(countField);
        newTableRow.appendChild(countCell);

        const titleCell = document.createElement("td");
        titleCell.style.width = '100%';
        titleCell.textContent = currentProduct.title;
        newTableRow.appendChild(titleCell);

        const productSum = document.createElement("td");
        productSum.id = 'sum' + currentProduct.id;
        productSum.textContent = (currentProduct.price * count).toFixed(2);
        productSum.style.textAlign = 'right';
        newTableRow.appendChild(productSum);

        const deleteCell = document.createElement("td");
        const deleteImage = document.createElement("img");
        deleteImage.src = "x.jpg";
        deleteImage.className = 'delete';

        deleteCell.appendChild(deleteImage);
        newTableRow.appendChild(deleteCell);

        productsTable.appendChild(newTableRow);
        deleteImage.addEventListener('click', () => {
            productsTable.removeChild(newTableRow);
            shoppingCart.removeProduct(currentProduct.id);
            shoppingCart.updateSum(products);
        });
    })


    const bottomRow = document.createElement("tr");
    bottomRow.className = 'bottom-row';

    const removeAllCell = document.createElement("td");
    const checkoutCell = document.createElement("td");

    checkoutCell.colSpan = 2;
    bottomRow.appendChild(checkoutCell);
    bottomRow.appendChild(removeAllCell);


    const checkOutButton = document.createElement("button");
    checkOutButton.addEventListener("click", () => checkOut());
    checkOutButton.className = "btn btn-success";
    checkOutButton.textContent = "Checkout";
    checkoutCell.appendChild(checkOutButton);

    const removeAllButton = document.createElement("button");
    removeAllButton.addEventListener("click", () => shoppingCart.removeAllProducts());
    removeAllButton.className = "btn btn-warning";
    removeAllButton.textContent = "Remove all items";
    removeAllCell.appendChild(removeAllButton);

    const sumCell = document.createElement("td");
    sumCell.id = 'sumOfAll';
    sumCell.style.textAlign = 'right';
    sumCell.style.fontWeight = 'bold';
    sumCell.textContent = 'summa';

    bottomRow.appendChild(sumCell);

    productsTable.appendChild(bottomRow);
    shoppingCart.updateSum(products);


}

function checkOut() {
    window.location = "index.html?checkout";
}

function addParagraphToCell(className, textContent, cell) {
    const p = document.createElement("p");
    p.className = className;
    p.textContent = textContent;
    cell.appendChild(p);
}

function populateProductsTable(products) {

    const productsTable = document.querySelector('#products-table')

    products.forEach(p => {
        const newTableRow = document.createElement("tr");

        const imageCell = document.createElement("td");

        const descriptionCell = document.createElement("td");

        addParagraphToCell('title', p.title, descriptionCell);
        addParagraphToCell('category', p.category, descriptionCell);
        addParagraphToCell('description', p.description, descriptionCell);

        const starImage = document.createElement("img");
        starImage.src = "stars.png";
        starImage.style.height = "35px"
        starImage.style.width = p.rating.rate * 30 + "px";
        starImage.style.objectPosition = "0% 0";
        starImage.style.objectFit = "none";
        descriptionCell.appendChild(starImage);

        addParagraphToCell('rating', p.rating.rate + " stars (" + p.rating.count + " votes)", descriptionCell);
        addParagraphToCell('price', "$" + p.price.toFixed(2), descriptionCell);


        const buyButton = document.createElement("button");
        buyButton.className = "btn btn-success";
        buyButton.textContent = "Add to cart";
        descriptionCell.appendChild(buyButton);
        buyButton.addEventListener("mousedown", () => shoppingCart.addProduct(p));


        const productImage = document.createElement("img");
        productImage.src = p.image;
        productImage.className = "product";
        imageCell.appendChild(productImage);

        productsTable.appendChild(newTableRow);
        newTableRow.appendChild(imageCell);
        newTableRow.appendChild(descriptionCell);

    });

}








