const accessToken =
    localStorage.getItem("access");


if (!accessToken) {

    window.location.href =
        "/login/";

}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadDashboard();

    }
);


async function loadDashboard() {

    try {

        const response =
            await fetch(
                "/api/dashboard/",
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${accessToken}`
                    }
                }
            );


        if (response.status === 401 ||
            response.status === 403) {

            localStorage.removeItem(
                "access"
            );

            window.location.href =
                "/login/";

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Dashboard API Error: " +
                response.status
            );

        }


        const data =
            await response.json();


        const totalCakes =
            document.getElementById(
                "totalCakes"
            );

        const totalOrders =
            document.getElementById(
                "totalOrders"
            );

        const totalUsers =
            document.getElementById(
                "totalUsers"
            );

        const totalRevenue =
            document.getElementById(
                "totalRevenue"
            );

        const totalCartItems =
            document.getElementById(
                "totalCartItems"
            );


        if (totalCakes) {

            totalCakes.innerText =
                data.total_cakes ?? 0;

        }


        if (totalOrders) {

            totalOrders.innerText =
                data.total_orders ?? 0;

        }


        if (totalUsers) {

            totalUsers.innerText =
                data.total_users ?? 0;

        }


        if (totalRevenue) {

            totalRevenue.innerText =
                "₹" +
                Number(
                    data.total_revenue ?? 0
                ).toLocaleString(
                    "en-IN"
                );

        }


        if (totalCartItems) {

            totalCartItems.innerText =
                data.total_cart_items ?? 0;

        }


        const cakeTable =
            document.getElementById(
                "recentCakeTable"
            );


        cakeTable.innerHTML = "";


        if (
            !data.recent_cakes ||
            data.recent_cakes.length === 0
        ) {

            cakeTable.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="text-center">

                        No Cake Available

                    </td>

                </tr>

            `;

        }

        else {

            data.recent_cakes.forEach(
                function (cake) {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    const imageCell =
                        document.createElement(
                            "td"
                        );


                    const image =
                        document.createElement(
                            "img"
                        );


                    image.src =
                        cake.image ||
                        "/static/images/no-image.png";


                    image.alt =
                        cake.name || "Cake";


                    image.width = 55;
                    image.height = 55;

                    image.className =
                        "rounded";

                    image.style.objectFit =
                        "cover";


                    imageCell.appendChild(
                        image
                    );


                    const nameCell =
                        document.createElement(
                            "td"
                        );

                    nameCell.textContent =
                        cake.name || "";


                    const categoryCell =
                        document.createElement(
                            "td"
                        );

                    categoryCell.textContent =
                        cake.category || "";


                    const priceCell =
                        document.createElement(
                            "td"
                        );

                    priceCell.textContent =
                        "₹" +
                        Number(
                            cake.price ?? 0
                        ).toLocaleString(
                            "en-IN"
                        );


                    const statusCell =
                        document.createElement(
                            "td"
                        );


                    const statusBadge =
                        document.createElement(
                            "span"
                        );


                    statusBadge.className =
                        cake.status === "available"
                            ? "badge bg-success"
                            : "badge bg-danger";


                    statusBadge.textContent =
                        cake.status === "available"
                            ? "Available"
                            : "Out Of Stock";


                    statusCell.appendChild(
                        statusBadge
                    );


                    row.appendChild(
                        imageCell
                    );

                    row.appendChild(
                        nameCell
                    );

                    row.appendChild(
                        categoryCell
                    );

                    row.appendChild(
                        priceCell
                    );

                    row.appendChild(
                        statusCell
                    );


                    cakeTable.appendChild(
                        row
                    );

                }
            );

        }


        const orderTable =
            document.getElementById(
                "recentOrderTable"
            );


        orderTable.innerHTML = "";


        if (
            !data.recent_orders ||
            data.recent_orders.length === 0
        ) {

            orderTable.innerHTML = `

                <tr>

                    <td
                        colspan="4"
                        class="text-center">

                        No Orders Found

                    </td>

                </tr>

            `;

        }

        else {

            data.recent_orders.forEach(
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
                        "#" +
                        (
                            order.order_number ||
                            ""
                        );


                    const breakElement =
                        document.createElement(
                            "br"
                        );


                    const date =
                        document.createElement(
                            "small"
                        );


                    date.className =
                        "text-muted";


                    date.textContent =
                        order.created_at ||
                        "";


                    orderCell.appendChild(
                        orderNumber
                    );

                    orderCell.appendChild(
                        breakElement
                    );

                    orderCell.appendChild(
                        date
                    );


                    const customerCell =
                        document.createElement(
                            "td"
                        );


                    customerCell.textContent =
                        order.customer_name ||
                        "";


                    const amountCell =
                        document.createElement(
                            "td"
                        );


                    amountCell.textContent =
                        "₹" +
                        Number(
                            order.total_amount ?? 0
                        ).toLocaleString(
                            "en-IN"
                        );


                    const statusCell =
                        document.createElement(
                            "td"
                        );


                    const statusBadge =
                        document.createElement(
                            "span"
                        );


                    statusBadge.className =
                        "badge " +
                        getStatusClass(
                            order.order_status
                        );


                    statusBadge.textContent =
                        formatStatus(
                            order.order_status
                        );


                    statusCell.appendChild(
                        statusBadge
                    );


                    row.appendChild(
                        orderCell
                    );

                    row.appendChild(
                        customerCell
                    );

                    row.appendChild(
                        amountCell
                    );

                    row.appendChild(
                        statusCell
                    );


                    orderTable.appendChild(
                        row
                    );

                }
            );

        }

    }

    catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );


        const cakeTable =
            document.getElementById(
                "recentCakeTable"
            );


        const orderTable =
            document.getElementById(
                "recentOrderTable"
            );


        if (cakeTable) {

            cakeTable.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        class="text-center text-danger">

                        Failed to load dashboard data

                    </td>

                </tr>

            `;

        }


        if (orderTable) {

            orderTable.innerHTML = `

                <tr>

                    <td
                        colspan="4"
                        class="text-center text-danger">

                        Failed to load dashboard data

                    </td>

                </tr>

            `;

        }

    }

}


function getStatusClass(status) {

    switch (status) {

        case "delivered":
            return "bg-success";

        case "cancelled":
            return "bg-danger";

        case "pending":
            return "bg-warning text-dark";

        case "confirmed":
            return "bg-primary";

        case "preparing":
            return "bg-info text-dark";

        case "out_for_delivery":
            return "bg-dark";

        default:
            return "bg-secondary";

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