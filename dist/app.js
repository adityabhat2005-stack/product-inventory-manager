// --- 1. Initial Sample Dataset ---
const initialInventory = [
    { id: "PROD-101", name: "Logitech MX Master 3S", price: 99.99, inStock: true, tags: ["electronics", "peripherals"] },
    { id: "PROD-102", name: "4K USB-C Monitor Cable", price: 24.50, inStock: false, tags: ["cables"] },
    { id: 103, name: "Ergonomic Office Chair", price: 249.00, inStock: true, tags: ["furniture", "office"] },
    { id: "PROD-104", name: "AA Rechargeable Batteries", price: 18.00, inStock: true }
];
// Deep copy of our initial inventory state for run-time updates
let currentInventory = JSON.parse(JSON.stringify(initialInventory));
let activeDiscount = 0; // State tracking for applied discount rate
// --- 2. Pure Logic Functions ---
function getAvailableProducts(products) {
    return products.filter(product => product.inStock);
}
function applyDiscountToProducts(products, fixedDiscount) {
    return products.map(product => (Object.assign(Object.assign({}, product), { discountPercent: fixedDiscount })));
}
function calculateDiscountedPrice(price, discountPercent) {
    return price - (price * (discountPercent / 100));
}
// --- 3. DOM Rendering Engine ---
function renderTable(productsToDisplay) {
    const tableBody = document.getElementById("inventory-table-body");
    if (!tableBody)
        return;
    tableBody.innerHTML = ""; // Clear existing rows
    productsToDisplay.forEach(product => {
        const row = document.createElement("tr");
        // Calculate conditional discounted price display
        let discountDisplay = "-";
        if (activeDiscount > 0) {
            const finalPrice = calculateDiscountedPrice(product.price, activeDiscount);
            discountDisplay = `$${finalPrice.toFixed(2)} (${activeDiscount}%)`;
        }
        // Status styling badge
        const statusBadge = product.inStock
            ? `<span class="badge instock">Available</span>`
            : `<span class="badge outstock">Out of Stock</span>`;
        // Parse optional tag elements cleanly
        const tagsHTML = product.tags
            ? product.tags.map(t => `<span class="tag">${t}</span>`).join("")
            : `<em>None</em>`;
        row.innerHTML = `
            <td>${product.id}</td>
            <td><strong>${product.name}</strong></td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${discountDisplay}</td>
            <td>${statusBadge}</td>
            <td>${tagsHTML}</td>
        `;
        tableBody.appendChild(row);
    });
}
// --- 4. DOM Event Binding ---
document.addEventListener("DOMContentLoaded", () => {
    // Render setup on initial launch
    renderTable(currentInventory);
    const btnAll = document.getElementById("btn-all");
    const btnAvailable = document.getElementById("btn-available");
    const btnDiscount = document.getElementById("btn-discount");
    const btnReset = document.getElementById("btn-reset");
    const addForm = document.getElementById("add-product-form");
    btnAll.addEventListener("click", () => {
        renderTable(currentInventory);
    });
    btnAvailable.addEventListener("click", () => {
        const matchingItems = getAvailableProducts(currentInventory);
        renderTable(matchingItems);
    });
    btnDiscount.addEventListener("click", () => {
        activeDiscount = 15; // Setup continuous application rules
        renderTable(currentInventory);
    });
    btnReset.addEventListener("click", () => {
        // Clear mutations and restore raw defaults
        currentInventory = JSON.parse(JSON.stringify(initialInventory));
        activeDiscount = 0;
        renderTable(currentInventory);
    });
    // Interactive Form Submit Handler
    if (addForm) {
        addForm.addEventListener("submit", (event) => {
            event.preventDefault(); // Stop standard HTTP page reload
            const nameInput = document.getElementById("form-name");
            const priceInput = document.getElementById("form-price");
            const tagsInput = document.getElementById("form-tags");
            const instockInput = document.getElementById("form-instock");
            // Parse explicit string sequences safely out into clean array chunks
            const cleanTags = tagsInput.value.trim()
                ? tagsInput.value.split(",").map(t => t.trim()).filter(t => t.length > 0)
                : undefined;
            // Formulate new product object
            const newProduct = {
                id: `PROD-${Date.now()}`, // Unique timestamp ID
                name: nameInput.value.trim(),
                price: parseFloat(priceInput.value),
                inStock: instockInput.checked,
                tags: cleanTags
            };
            // Mutate array state and immediately update layout metrics
            currentInventory.push(newProduct);
            renderTable(currentInventory);
            // Wipe clean the form inputs
            addForm.reset();
        });
    }
});
