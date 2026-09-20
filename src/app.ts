// --- 1. Interfaces ---
interface Product {
    id: number | string; // Union Type
    name: string;
    price: number;
    inStock: boolean;
    tags?: string[];     // Optional Property
}

interface DiscountedProduct extends Product {
    discountPercent: number;
}

// --- 2. Initial Sample Dataset ---
const initialInventory: Product[] = [
    { id: "PROD-101", name: "Logitech MX Master 3S", price: 99.99, inStock: true, tags: ["electronics", "peripherals"] },
    { id: "PROD-102", name: "4K USB-C Monitor Cable", price: 24.50, inStock: false, tags: ["cables"] },
    { id: 103,        name: "Ergonomic Office Chair", price: 249.00, inStock: true, tags: ["furniture", "office"] },
    { id: "PROD-104", name: "AA Rechargeable Batteries", price: 18.00, inStock: true }
];

// Deep copy of our initial inventory state for run-time updates
let currentInventory: Product[] = JSON.parse(JSON.stringify(initialInventory));
let activeDiscount: number = 0; // State tracking for applied discount rate

// --- 3. Pure Logic Functions (From Assignment Specs) ---
function getAvailableProducts(products: Product[]): Product[] {
    return products.filter(product => product.inStock);
}

function applyDiscountToProducts(products: Product[], fixedDiscount: number): DiscountedProduct[] {
    return products.map(product => ({
        ...product,
        discountPercent: fixedDiscount
    }));
}

function calculateDiscountedPrice(price: number, discountPercent: number): number {
    return price - (price * (discountPercent / 100));
}

// --- 4. DOM Rendering Engine ---
function renderTable(productsToDisplay: Product[]): void {
    const tableBody = document.getElementById("inventory-table-body") as HTMLTableSectionElement | null;
    
    if (!tableBody) return;
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

// --- 5. DOM Event Binding ---
document.addEventListener("DOMContentLoaded", () => {
    // Render setup on initial launch
    renderTable(currentInventory);

    const btnAll = document.getElementById("btn-all") as HTMLButtonElement;
    const btnAvailable = document.getElementById("btn-available") as HTMLButtonElement;
    const btnDiscount = document.getElementById("btn-discount") as HTMLButtonElement;
    const btnReset = document.getElementById("btn-reset") as HTMLButtonElement;

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
});
