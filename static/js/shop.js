const cakeContainer = document.getElementById("cakeContainer");
const categoryFilter = document.getElementById("categoryFilter");
const searchCake = document.getElementById("searchCake");
const pagination = document.getElementById("pagination");

let currentPage = 1;


async function loadCategories() {

    try {

        const response = await fetch("/api/categories/");

        const categories = await response.json();

        categoryFilter.innerHTML = `
            <option value="">All Categories</option>
        `;

        categories.forEach(category => {

            categoryFilter.innerHTML += `
                <option value="${category.id}">
                    ${category.name}
                </option>
            `;

        });

    }

    catch(error){

        console.log(error);

    }

}






async function loadCakes(page = 1){

    let url = `/api/cakes/?page=${page}`;

    if(searchCake.value){

        url += `&search=${searchCake.value}`;

    }

    if(categoryFilter.value){

        url += `&category=${categoryFilter.value}`;

    }

    try{

        const response = await fetch(url);

        const data = await response.json();

        displayCakes(data.results);

        createPagination(data);

    }

    catch(error){

        console.log(error);

    }

}


function displayCakes(cakes){

    cakeContainer.innerHTML = "";

    cakes.forEach(cake=>{

        cakeContainer.innerHTML += `

        <div class="col-lg-3 col-md-6">

            <div class="shop-card">

                <div class="shop-image">

                    <img
                        src="${cake.image}"
                        alt="${cake.name}">

                </div>

                <div class="shop-body">

                    <h4>${cake.name}</h4>

                    <div class="shop-price">

                        ₹${cake.price}

                    </div>

                    <a
                        href="/cake-details/${cake.id}/"
                        class="btn btn-main btn-view">

                        View Details

                    </a>

                </div>

            </div>

        </div>

        `;

    });

}


function createPagination(data){

    pagination.innerHTML = "";

    let html = `<ul class="pagination">`;

    if(data.previous){

        html += `

        <li class="page-item">

            <button
                class="page-link"
                onclick="changePage(${currentPage-1})">

                Previous

            </button>

        </li>

        `;

    }

    if(data.next){

        html += `

        <li class="page-item">

            <button
                class="page-link"
                onclick="changePage(${currentPage+1})">

                Next

            </button>

        </li>

        `;

    }

    html += "</ul>";

    pagination.innerHTML = html;

}


function changePage(page){

    currentPage = page;

    loadCakes(page);

}

searchCake.addEventListener(

    "keyup",

    function(){

        currentPage = 1;

        loadCakes();

    }

);

categoryFilter.addEventListener(

    "change",

    function(){

        currentPage = 1;

        loadCakes();

    }

);


document.addEventListener(

    "DOMContentLoaded",

    function(){

        loadCategories();

        loadCakes();

    }

);