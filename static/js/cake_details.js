const cakeId = window.location.pathname.split("/")[2];


async function loadCake() {

    try {

        const response = await fetch(
            `/api/cakes/${cakeId}/`
        );

        if (!response.ok) {
            throw new Error("Cake not found");
        }

        const cake = await response.json();

        document.getElementById("cakeImage").src =
            cake.image;

        document.getElementById("cakeName").textContent =
            cake.name;

        document.getElementById("cakePrice").textContent =
            cake.price;

        document.getElementById("cakeCategory").textContent =
            cake.category_name;

        document.getElementById("cakeWeight").textContent =
            cake.weight;

        document.getElementById("cakeDescription").textContent =
            cake.description;

    }

    catch (error) {

        console.error(error);

        alert("Unable to load cake details.");

    }
}


async function addToCart() {

    const token = localStorage.getItem("access");

    if (!token) {

        alert("Please login first.");

        window.location.href = "/login/";

        return;
    }


    try {

        const response = await fetch(
            "/api/cart/add/",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "Authorization":
                        `Bearer ${token}`
                },

                body: JSON.stringify({

                    cake: cakeId,

                    quantity: 1
                })

            }
        );


        const data = await response.json();


        if (response.ok) {

            alert(
                data.message ||
                "Cake added to cart."
            );

            window.location.href = "/cart/";

        }

        else {

            console.error(data);

            alert(
                data.error ||
                data.detail ||
                "Unable to add cake to cart."
            );

        }

    }

    catch (error) {

        console.error(error);

        alert("Something went wrong.");

    }
}


document.addEventListener(
    "DOMContentLoaded",
    loadCake
);