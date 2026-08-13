const table =
    document.getElementById(
        "ordersTable"
    );

const accessToken =
    localStorage.getItem("access");


if (!accessToken) {

    window.location.href =
        "/login/";

}


async function loadOrders() {

    try {

        const response =
            await fetch(
                "/api/orders/my/",
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

            localStorage.removeItem(
                "refresh"
            );

            window.location.href =
                "/login/";

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Unable to load orders"
            );

        }


        const orders =
            await response.json();


        console.log(
            "Orders:",
            orders
        );


        table.innerHTML = "";


        if (
            !orders ||
            orders.length === 0
        ) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="6"
                        class="text-center py-4">

                        No Orders Found

                    </td>

                </tr>

            `;

            return;
        }


        orders.forEach(
            function (order) {

                const row =
                    document.createElement(
                        "tr"
                    );


                const orderNumberCell =
                    document.createElement(
                        "td"
                    );

                orderNumberCell.textContent =
                    order.order_number || "";


                const dateCell =
                    document.createElement(
                        "td"
                    );

                dateCell.textContent =
                    order.created_at || "";


                const amountCell =
                    document.createElement(
                        "td"
                    );

                amountCell.textContent =
                    "₹" +
                    (order.total_amount || "0");


                const paymentCell =
                    document.createElement(
                        "td"
                    );

                paymentCell.textContent =
                    formatStatus(
                        order.payment_status
                    );


                const orderStatusCell =
                    document.createElement(
                        "td"
                    );

                orderStatusCell.textContent =
                    formatStatus(
                        order.order_status
                    );


                const actionCell =
                    document.createElement(
                        "td"
                    );


                const viewButton =
                    document.createElement(
                        "a"
                    );

                viewButton.href =
                    `/uorder-details/${order.id}/`;

                viewButton.className =
                    "btn btn-main btn-sm";

                viewButton.textContent =
                    "View";


                actionCell.appendChild(
                    viewButton
                );


                row.appendChild(
                    orderNumberCell
                );

                row.appendChild(
                    dateCell
                );

                row.appendChild(
                    amountCell
                );

                row.appendChild(
                    paymentCell
                );

                row.appendChild(
                    orderStatusCell
                );

                row.appendChild(
                    actionCell
                );


                table.appendChild(
                    row
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Load Orders Error:",
            error
        );


        table.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="text-center text-danger py-4">

                    Unable to load orders.

                </td>

            </tr>

        `;

    }

}


function formatStatus(status) {

    if (!status) {

        return "";

    }


    return status
        .replaceAll("_", " ")
        .replace(
            /\b\w/g,
            function (letter) {
                return letter.toUpperCase();
            }
        );

}


document.addEventListener(
    "DOMContentLoaded",
    loadOrders
);