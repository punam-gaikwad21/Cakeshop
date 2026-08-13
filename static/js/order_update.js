const orderId =
    window.location.pathname.split("/")[2];


const form =
    document.getElementById(
        "orderStatusForm"
    );


const accessToken =
    localStorage.getItem("access");


if (!accessToken) {

    window.location.href =
        "/login/";

}


async function loadOrder() {

    try {

        const response =
            await fetch(
                `/api/orders/${orderId}/`,
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
                "Unable to load order"
            );

        }


        const order =
            await response.json();


        document.getElementById(
            "orderStatus"
        ).value =
            order.order_status || "";

    }

    catch (error) {

        console.error(
            "Load Order Error:",
            error
        );

        alert(
            "Unable to load order."
        );

    }

}


if (form) {

    form.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const orderStatus =
                document.getElementById(
                    "orderStatus"
                ).value;


            if (!orderStatus) {

                alert(
                    "Please select order status."
                );

                return;

            }


            try {

                const response =
                    await fetch(
                        `/api/orders/${orderId}/`,
                        {
                            method: "PATCH",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${accessToken}`
                            },

                            body: JSON.stringify({
                                order_status:
                                    orderStatus
                            })
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


                const data =
                    await response
                        .json()
                        .catch(() => ({}));


                if (response.ok) {

                    alert(
                        "Order Status Updated Successfully"
                    );


                    window.location.href =
                        "/order-list/";

                    return;

                }


                console.error(
                    "Update Order Error:",
                    data
                );


                alert(
                    data.detail ||
                    data.order_status?.[0] ||
                    "Unable to Update Order"
                );

            }

            catch (error) {

                console.error(
                    "Update Order Error:",
                    error
                );

                alert(
                    "Server Error. Please try again."
                );

            }

        }
    );

}


document.addEventListener(
    "DOMContentLoaded",
    loadOrder
);