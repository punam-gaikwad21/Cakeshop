const checkoutItems =
    document.getElementById("checkoutItems");

const accessToken =
    localStorage.getItem("access");


if (!accessToken) {

    window.location.href =
        "/login/";

}


async function loadCheckout() {

    try {

        const response =
            await fetch(
                "/api/cart/",
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`
                    }
                }
            );


        if (response.status === 401) {

            localStorage.removeItem(
                "access"
            );

            window.location.href =
                "/login/";

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Unable to load cart"
            );

        }


        const cart =
            await response.json();


        document
            .getElementById("checkoutTotal")
            .textContent =
            "₹" + (cart.total ?? "0");


        checkoutItems.innerHTML = "";


        if (
            !cart.items ||
            cart.items.length === 0
        ) {

            checkoutItems.innerHTML = `

                <div class="text-center py-4">

                    <h5>
                        Your cart is empty
                    </h5>

                    <a
                        href="/shop/"
                        class="btn btn-primary mt-3">

                        Continue Shopping

                    </a>

                </div>

            `;

            return;
        }


        cart.items.forEach(item => {

            const itemDiv =
                document.createElement("div");

            itemDiv.className =
                "d-flex justify-content-between mb-3";


            const infoDiv =
                document.createElement("div");


            const cakeName =
                document.createElement("strong");

            cakeName.textContent =
                item.cake_name || "";


            const breakElement =
                document.createElement("br");


            const quantity =
                document.createElement("small");

            quantity.textContent =
                `Qty : ${item.quantity}`;


            infoDiv.appendChild(
                cakeName
            );

            infoDiv.appendChild(
                breakElement
            );

            infoDiv.appendChild(
                quantity
            );


            const subtotal =
                document.createElement("strong");

            subtotal.textContent =
                "₹" + item.subtotal;


            itemDiv.appendChild(
                infoDiv
            );

            itemDiv.appendChild(
                subtotal
            );


            checkoutItems.appendChild(
                itemDiv
            );

        });

    }

    catch (error) {

        console.error(
            "Checkout Load Error:",
            error
        );

        checkoutItems.innerHTML = `

            <div class="text-center py-4">

                <p>
                    Unable to load checkout.
                </p>

            </div>

        `;

    }

}


document.addEventListener(
    "DOMContentLoaded",
    loadCheckout
);


async function placeOrder() {

    if (!accessToken) {

        window.location.href =
            "/login/";

        return;
    }


    try {

        const response =
            await fetch(
                "/api/orders/place/",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${accessToken}`
                    }
                }
            );


        if (response.status === 401) {

            localStorage.removeItem(
                "access"
            );

            window.location.href =
                "/login/";

            return;
        }


        const data =
            await response
                .json()
                .catch(() => ({}));


        if (response.ok) {

            alert(
                "Order Placed Successfully\n\n" +
                "Order No : " +
                data.order_number
            );


            window.location.href =
                "/my-orders/";

            return;
        }


        alert(
            data.detail ||
            data.message ||
            data.error ||
            "Failed to place order."
        );

    }

    catch (error) {

        console.error(
            "Place Order Error:",
            error
        );

        alert(
            "Server Error. Please try again."
        );

    }

}