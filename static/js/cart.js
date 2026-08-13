const cartItems = document.getElementById("cartItems");

const accessToken = localStorage.getItem("access");


// ==================================================
// AUTH CHECK
// ==================================================

if (!accessToken) {
    window.location.href = "/login/";
}


// ==================================================
// LOAD CART
// ==================================================

async function loadCart() {

    try {

        const response = await fetch(
            "/api/cart/",
            {
                method: "GET",

                headers: {
                    Authorization:
                        `Bearer ${accessToken}`
                }
            }
        );


        // ===============================
        // LOGIN REQUIRED
        // ===============================

        if (response.status === 401) {

            localStorage.removeItem("access");

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


        // ===============================
        // CART TOTAL
        // ===============================

        document
            .getElementById("cartTotal")
            .textContent =
            "₹" + (cart.total ?? "0");


        // ===============================
        // CLEAR CART TABLE
        // ===============================

        cartItems.innerHTML = "";


        // ===============================
        // EMPTY CART
        // ===============================

        if (
            !cart.items ||
            cart.items.length === 0
        ) {

            cartItems.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        class="text-center py-5">

                        <h5>
                            Your cart is empty
                        </h5>

                        <a
                            href="/shop/"
                            class="btn btn-primary mt-3">

                            Continue Shopping

                        </a>

                    </td>

                </tr>

            `;

            return;
        }


        // ===============================
        // CART ITEMS
        // ===============================

        cart.items.forEach(item => {

            const row =
                document.createElement("tr");


            // ===============================
            // IMAGE
            // ===============================

            const imageCell =
                document.createElement("td");


            const image =
                document.createElement("img");


            image.src =
                item.cake_image ||
                "/static/images/no-image.png";


            image.alt =
                item.cake_name || "Cake";


            image.className =
                "img-thumbnail";


            image.style.width = "90px";
            image.style.height = "90px";
            image.style.objectFit = "cover";


            imageCell.appendChild(image);


            // ===============================
            // CAKE NAME
            // ===============================

            const nameCell =
                document.createElement("td");


            const name =
                document.createElement("strong");


            name.textContent =
                item.cake_name || "";


            nameCell.appendChild(name);


            // ===============================
            // PRICE
            // ===============================

            const priceCell =
                document.createElement("td");


            priceCell.textContent =
                "₹" + item.price;


            // ===============================
            // QUANTITY
            // ===============================

            const quantityCell =
                document.createElement("td");


            const quantityBox =
                document.createElement("div");


            quantityBox.className =
                "quantity-box";


            // Decrease button

            const decreaseButton =
                document.createElement("button");


            decreaseButton.className =
                "btn btn-outline-secondary btn-sm";


            decreaseButton.textContent = "-";


            decreaseButton.addEventListener(
                "click",
                () => updateQuantity(
                    item.id,
                    "decrease"
                )
            );


            // Quantity

            const quantity =
                document.createElement("span");


            quantity.textContent =
                ` ${item.quantity} `;


            // Increase button

            const increaseButton =
                document.createElement("button");


            increaseButton.className =
                "btn btn-outline-secondary btn-sm";


            increaseButton.textContent = "+";


            increaseButton.addEventListener(
                "click",
                () => updateQuantity(
                    item.id,
                    "increase"
                )
            );


            quantityBox.appendChild(
                decreaseButton
            );


            quantityBox.appendChild(
                quantity
            );


            quantityBox.appendChild(
                increaseButton
            );


            quantityCell.appendChild(
                quantityBox
            );


            // ===============================
            // SUBTOTAL
            // ===============================

            const subtotalCell =
                document.createElement("td");


            subtotalCell.textContent =
                "₹" + item.subtotal;


            // ===============================
            // REMOVE
            // ===============================

            const removeCell =
                document.createElement("td");


            const removeButton =
                document.createElement("button");


            removeButton.className =
                "btn btn-danger btn-sm";


            removeButton.textContent =
                "Remove";


            removeButton.addEventListener(
                "click",
                () => removeItem(item.id)
            );


            removeCell.appendChild(
                removeButton
            );


            // ===============================
            // ADD CELLS
            // ===============================

            row.appendChild(imageCell);

            row.appendChild(nameCell);

            row.appendChild(priceCell);

            row.appendChild(quantityCell);

            row.appendChild(subtotalCell);

            row.appendChild(removeCell);


            cartItems.appendChild(row);

        });

    }

    catch (error) {

        console.error(
            "Load Cart Error:",
            error
        );

        cartItems.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="text-center py-5">

                    Unable to load cart.

                </td>

            </tr>

        `;

    }

}


// ==================================================
// UPDATE QUANTITY
// ==================================================

async function updateQuantity(
    itemId,
    action
) {

    try {

        const response =
            await fetch(
                "/api/cart/update/",
                {
                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${accessToken}`

                    },

                    body: JSON.stringify({

                        item: itemId,

                        action: action

                    })
                }
            );


        if (response.status === 401) {

            localStorage.removeItem("access");

            window.location.href =
                "/login/";

            return;
        }


        const data =
            await response.json()
                .catch(() => ({}));


        if (!response.ok) {

            alert(
                data.error ||
                data.message ||
                "Unable to update quantity."
            );

            return;
        }


        await loadCart();

    }

    catch (error) {

        console.error(
            "Update Quantity Error:",
            error
        );

        alert(
            "Something went wrong."
        );

    }

}


// ==================================================
// REMOVE ITEM
// ==================================================

async function removeItem(itemId) {

    if (
        !confirm(
            "Remove this cake from cart?"
        )
    ) {

        return;
    }


    try {

        const response =
            await fetch(
                `/api/cart/remove/${itemId}/`,
                {
                    method: "DELETE",

                    headers: {

                        Authorization:
                            `Bearer ${accessToken}`

                    }
                }
            );


        if (response.status === 401) {

            localStorage.removeItem("access");

            window.location.href =
                "/login/";

            return;
        }


        const data =
            await response.json()
                .catch(() => ({}));


        if (response.ok) {

            await loadCart();

        }

        else {

            alert(
                data.error ||
                data.message ||
                "Unable to remove item."
            );

        }

    }

    catch (error) {

        console.error(
            "Remove Item Error:",
            error
        );

        alert(
            "Something went wrong."
        );

    }

}


// ==================================================
// PAGE LOAD
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    loadCart
);