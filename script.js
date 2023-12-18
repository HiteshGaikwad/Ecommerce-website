const section = document.getElementById('section');
let products;

document.addEventListener('DOMContentLoaded', () => {
    getProducts(); // Load products initially

    // Add event listeners to handle filter changes
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('priceFilter').addEventListener('change', applyFilters);
    document.getElementById('ratingFilter').addEventListener('change', applyFilters);
    document.getElementById('searchInput').addEventListener('input', applyFilters);

    const filterButton = document.getElementById('filterButton');
    const navbar = document.querySelector('.navbar');

    filterButton.addEventListener('click', function () {
        navbar.classList.toggle('visible');
    });

    // Add this event listener to close the .navbar on a click outside of it
    document.addEventListener('click', function (event) {
        if (!navbar.contains(event.target) && !filterButton.contains(event.target)) {
            navbar.classList.remove('visible');
        }
    });

    const menuBtn= document.getElementsByClassName('menu-btn')[0];
    const menu= document.querySelector('.menu');
    const cancelBtn= document.getElementsByClassName('cancel')[0];

    menuBtn.addEventListener('click', function () {
        menu.classList.toggle('show');
        // menuBtn.style.display = 'none';
        menuBtn.classList.remove('visible');
    });

    document.addEventListener('click', function (event) {
        if (!menu.contains(event.target) && !menuBtn.contains(event.target)) {
            menu.classList.remove('show');
            menuBtn.classList.toggle('visible');
            // menuBtn.style.display = 'block';
        }
    });
    cancelBtn.addEventListener('click',()=>{
        // menuBtn.style.display = 'block';
        menuBtn.classList.toggle('visible');
        menu.classList.remove('show');
    })
});

async function getProducts() {
    const response = await fetch('https://fakestoreapi.com/products');
    const result = await response.json();
    products = [...result];
    applyFilters(); // Apply filters after fetching products
}

function applyFilters() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const priceFilter = document.getElementById('priceFilter').value;
    const ratingFilter = document.getElementById('ratingFilter').value;
    const searchInput = document.getElementById('searchInput').value.toLowerCase();

    const filteredProducts = filterProducts(categoryFilter, priceFilter,ratingFilter,searchInput);
    displayProducts(filteredProducts);
}

function filterProducts(category, price, rating,search) {
    const filtered = products.filter(product => {
        const title = product.title.toLowerCase();
        const categoryMatch = (category === 'all' || product.category === category);
        const searchMatch = title.includes(search);

        return categoryMatch && searchMatch;
    });

    // Sort based on price filter
    if (price === 'highToLow') {
        return filtered.sort((a, b) => b.price - a.price);
    } else if (price === 'lowToHigh') {
        return filtered.sort((a, b) => a.price - b.price);
    }

    // sort based on rating filter
    if(rating==='highToLow'){
        return filtered.sort((a,b)=>b.rating.rate - a.rating.rate);
    } else if(rating==='lowToHigh'){
        return filtered.sort((a,b)=>a.rating.rate - b.rating.rate)
    }
    return filtered;
}

function displayProducts(filteredProducts) {
    // Clear existing products
    section.innerHTML = '';

    // Display filtered products
    if (filteredProducts.length === 0) {
        // If no products found, display a message
        section.innerHTML = '<p class="message">Not found...</p>';
    } else{
    filteredProducts.forEach(product => {
        let cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerHTML = `
            <img class="card-image" src=${product.image}>
            <h2 class="card-title">${product.title}</h2>
            <div class="price-rating-div">
                <h3>$${product.price}</h3>
                <h3 class="rating">⭐${product.rating.rate}</h3>
            </div>
            <h3 class="category">${product.category}</h3>
            <button onClick='alert("Your item has been added successfully.")' class="buy-btn ${product.id}">Buy now</button>
        `;
        section.append(cardElement);
    });
} 
}
