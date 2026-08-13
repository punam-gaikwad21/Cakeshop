const search =
    document.getElementById("search");

const table =
    document.getElementById("orderTable");

const accessToken =
    localStorage.getItem("access");


if (!accessToken) {

    window.location.href =
        "/login/";

}


async function loadOrders() {

    try {

        let url =
            "/api/orders/";

        const searchValue =
            search
                ? search.value.trim()
                : "";


        if (searchValue) {

            url +=
                `?search=${encodeURIComponent(searchValue)}`;

        }


        const response =
            await fetch(
                url,
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`
                    }
                }
            );


        if (
            response.status === 401 ||
            response.status === 403
        ) {

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
                "Failed to load orders"
            );

        }


        const data =
            await response.json();


        const orders =
            data.results ?? data;


        table.innerHTML = "";


        if (
            !orders ||
            orders.length === 0
        ) {

            table.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        class="text-center text-muted py-4">

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


                const orderCell =
                    document.createElement(
                        "td"
                    );


                const orderNumber =
                    document.createElement(
                        "strong"
                    );


                orderNumber.textContent =
                    order.order_number || "";


                orderCell.appendChild(
                    orderNumber
                );


                const customerCell =
                    document.createElement(
                        "td"
                    );

                customerCell.textContent =
                    order.customer_name || "";


                const totalCell =
                    document.createElement(
                        "td"
                    );

                totalCell.textContent =
                    "₹" +
                    Number(
                        order.total_amount || 0
                    ).toLocaleString(
                        "en-IN"
                    );


                const paymentCell =
                    document.createElement(
                        "td"
                    );

                paymentCell.innerHTML =
                    paymentBadge(
                        order.payment_status
                    );


                const statusCell =
                    document.createElement(
                        "td"
                    );

                statusCell.innerHTML =
                    orderBadge(
                        order.order_status
                    );


                const dateCell =
                    document.createElement(
                        "td"
                    );

                dateCell.textContent =
                    formatDate(
                        order.created_at
                    );


                const actionCell =
                    document.createElement(
                        "td"
                    );


                const viewButton =
                    document.createElement(
                        "button"
                    );

                viewButton.type =
                    "button";

                viewButton.className =
                    "btn btn-sm btn-primary me-1";

                viewButton.title =
                    "View Order";

                viewButton.innerHTML =
                    '<i class="bi bi-eye"></i>';

                viewButton.addEventListener(
                    "click",
                    function () {
                        viewOrder(
                            order.id
                        );
                    }
                );


                const updateButton =
                    document.createElement(
                        "button"
                    );

                updateButton.type =
                    "button";

                updateButton.className =
                    "btn btn-sm btn-warning me-1";

                updateButton.title =
                    "Update Order";

                updateButton.innerHTML =
                    '<i class="bi bi-pencil"></i>';

                updateButton.addEventListener(
                    "click",
                    function () {
                        updateOrder(
                            order.id
                        );
                    }
                );


                const paymentButton =
                    document.createElement(
                        "button"
                    );

                paymentButton.type =
                    "button";

                paymentButton.className =
                    "btn btn-sm btn-success";

                paymentButton.title =
                    "Update Payment";

                paymentButton.innerHTML =
                    '<i class="bi bi-credit-card"></i>';

                paymentButton.addEventListener(
                    "click",
                    function () {
                        updatePayment(
                            order.id
                        );
                    }
                );


                actionCell.appendChild(
                    viewButton
                );

                actionCell.appendChild(
                    updateButton
                );

                actionCell.appendChild(
                    paymentButton
                );


                row.appendChild(
                    orderCell
                );

                row.appendChild(
                    customerCell
                );

                row.appendChild(
                    totalCell
                );

                row.appendChild(
                    paymentCell
                );

                row.appendChild(
                    statusCell
                );

                row.appendChild(
                    dateCell
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
            "Order Load Error:",
            error
        );


        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="text-center text-danger py-4">

                    Failed to load orders.

                </td>

            </tr>

        `;

    }

}


document.addEventListener(
    "DOMContentLoaded",
    loadOrders
);


if (search) {

    let searchTimeout;


    search.addEventListener(
        "input",
        function () {

            clearTimeout(
                searchTimeout
            );


            searchTimeout =
                setTimeout(
                    loadOrders,
                    300
                );

        }
    );

}


function viewOrder(id) {

    window.location.href =
        `/order-details/${id}/`;

}


function updateOrder(id) {

    window.location.href =
        `/order-update/${id}/`;

}


function updatePayment(id) {

    window.location.href =
        `/payment-update/${id}/`;

}


function paymentBadge(status) {

    switch (status) {

        case "paid":

            return `
                <span class="badge bg-success">
                    Paid
                </span>
            `;


        case "pending":

            return `
                <span class="badge bg-warning text-dark">
                    Pending
                </span>
            `;


        case "failed":

            return `
                <span class="badge bg-danger">
                    Failed
                </span>
            `;


        default:

            return `
                <span class="badge bg-secondary">
                    Unknown
                </span>
            `;

    }

}


function orderBadge(status) {

    switch (status) {

        case "pending":

            return `
                <span class="badge bg-secondary">
                    Pending
                </span>
            `;


        case "confirmed":

            return `
                <span class="badge bg-primary">
                    Confirmed
                </span>
            `;


        case "preparing":

            return `
                <span class="badge bg-info text-dark">
                    Preparing
                </span>
            `;


        case "out_for_delivery":

            return `
                <span class="badge bg-warning text-dark">
                    Out For Delivery
                </span>
            `;


        case "delivered":

            return `
                <span class="badge bg-success">
                    Delivered
                </span>
            `;


        case "cancelled":

            return `
                <span class="badge bg-danger">
                    Cancelled
                </span>
            `;


        default:

            return `
                <span class="badge bg-secondary">
                    Unknown
                </span>
            `;

    }

}


function formatDate(date) {

    if (!date) {

        return "-";

    }


    const parsedDate =
        new Date(date);


    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {

        return "-";

    }


    return parsedDate.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}