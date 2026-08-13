const orderId = window.location.pathname.split("/")[2];

const table = document.getElementById("itemTable");

async function loadOrder() {

    try {

        const response = await fetch(

            `/api/orders/${orderId}/`,

            {

                headers: {

                    Authorization:
                    `Bearer ${localStorage.getItem("access")}`

                }

            }

        );

        const order = await response.json();

        document.getElementById("orderNumber").textContent =
            order.order_number;

        document.getElementById("customerName").textContent =
            order.customer_name;

        document.getElementById("paymentStatus").textContent =
            order.payment_status;

        document.getElementById("orderStatus").textContent =
            order.order_status;

        document.getElementById("totalAmount").textContent =
            order.total_amount;

        table.innerHTML = "";

        order.items.forEach(item => {

            table.innerHTML += `

            <tr>

                <td>${item.cake_name}</td>

                <td>${item.quantity}</td>

                <td>₹${item.price}</td>

                <td>₹${item.subtotal}</td>

            </tr>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

}

document.addEventListener(

    "DOMContentLoaded",

    loadOrder

);