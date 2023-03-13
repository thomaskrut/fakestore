async function loadAllProducts() {
    let response = await fetch('https://fakestoreapi.com/products');
    let products = await response.json();
    populateTable(products, '#products-table');
}

function loadCart() {
    const productInCart = JSON.parse(localStorage.getItem("product"));
    populateTable([productInCart],'#cart-table',false);
}

function buyProduct(product) {

    // görs om till addToCart för vg-delen
    localStorage.setItem("product", JSON.stringify(product));
    window.location = 'order.html';
}

function populateTable(products,selector,showBuyButton = true) {

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
        productImage.className="product";
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





