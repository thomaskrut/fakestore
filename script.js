async function loadAllProducts() {
    let response = await fetch('https://fakestoreapi.com/products');
    let products = await response.json();
    populateTable(products);
}

function populateTable(products) {

    const productsTable = document.querySelector('#products-table')

    products.forEach(p => {
        const newTableRow = document.createElement("tr");
        const titleCell = document.createElement("td");
        const productImage = document.createElement("img");
        productImage.src = p.image;
        titleCell.textContent = p.title;
        titleCell.appendChild(productImage);
        productsTable.appendChild(newTableRow);
        newTableRow.appendChild(titleCell);
    });

}

loadAllProducts();




