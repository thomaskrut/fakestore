async function loadAllProducts() {
    let response = await fetch('https://fakestoreapi.com/products');
    let products = await response.json();
    populateTable(products);
}

function populateTable(products) {

    const productsTable = document.querySelector('#products-table')

products.forEach(p => {
    const newTableRow = document.createElement("tr");
    
    const newTableCell = document.createElement("td");
    newTableCell.textContent = p.title;
    productsTable.appendChild(newTableRow);
    newTableRow.appendChild(newTableCell);

});

}

loadAllProducts();




