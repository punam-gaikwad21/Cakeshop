const orderId = window.location.pathname.split("/")[2];

async function loadOrder() {

    try {

        const token = localStorage.getItem("access");

        if (!token) {
            console.error("Access token not found");
            return;
        }

        const response = await fetch(
            `/api/uorder-details/${orderId}/`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("Status:", response.status);

        if (!response.ok) {
            const error = await response.text();
            console.error("API Error:", error);
            return;
        }

        const order = await response.json();

        console.log("Order:", order);


        // Order Number
        document.getElementById("orderNumber").textContent =
            order.order_number || "-";


        // Order Date
        document.getElementById("orderDate").textContent =
            order.created_at
                ? new Date(order.created_at).toLocaleString()
                : "-";


        // Payment Status
        document.getElementById("paymentStatus").textContent =
            order.payment_status || "-";


        // Order Status
        document.getElementById("orderStatus").textContent =
            order.order_status || "-";


        // Total
        document.getElementById("grandTotal").textContent =
            order.total_amount || "0";


        // Order Items
        let html = "";

        if (order.items && order.items.length > 0) {

            order.items.forEach(item => {

                html += `
                    <tr>

                        <td>
                            ${item.cake_name || "-"}
                        </td>

                        <td>
                            ${item.quantity || 0}
                        </td>

                        <td>
                            ₹${item.price || 0}
                        </td>

                        <td>
                            ₹${item.subtotal || 0}
                        </td>

                    </tr>
                `;

            });

        } else {

            html = `
                <tr>
                    <td colspan="4" class="text-center">
                        No items found
                    </td>
                </tr>
            `;

        }

        document.getElementById("orderItems").innerHTML = html;

    } catch (error) {

        console.error(
            "Order Details Error:",
            error
        );

    }
}


document.addEventListener(
    "DOMContentLoaded",
    loadOrder
);