// =====================================
// GET ORDER ID FROM URL
// =====================================

const pathParts = window.location.pathname
.split("/")
.filter(Boolean);

const orderId =
pathParts[pathParts.length - 1];

// =====================================
// FORM
// =====================================

const paymentStatusForm =
document.getElementById("paymentStatusForm");

const paymentStatus =
document.getElementById("paymentStatus");

// =====================================
// LOAD CURRENT PAYMENT STATUS
// =====================================

async function loadPaymentStatus() {


try {

    const response = await fetch(
        `/api/orders/${orderId}/`,
        {
            method: "GET",

            headers: {
                "Authorization":
                    `Bearer ${localStorage.getItem("access")}`
            }
        }
    );


    if (!response.ok) {

        throw new Error(
            "Failed to load order"
        );

    }


    const order =
        await response.json();


    paymentStatus.value =
        order.payment_status;

}

catch (error) {

    console.error(
        "Payment Load Error:",
        error
    );

    alert(
        "Failed to load payment status."
    );

}


}

// =====================================
// UPDATE PAYMENT STATUS
// =====================================

paymentStatusForm.addEventListener(
"submit",
async function (event) {

    event.preventDefault();


    const status =
        paymentStatus.value;


    try {

        const response = await fetch(
            `/api/orders/${orderId}/`,
            {
                method: "PATCH",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${localStorage.getItem("access")}`

                },

                body: JSON.stringify({

                    payment_status: status

                })

            }
        );


        if (!response.ok) {

            const errorData =
                await response.json();

            console.error(
                "Payment Update Error:",
                errorData
            );

            throw new Error(
                "Payment update failed"
            );

        }


        alert(
            "Payment Status Updated Successfully!"
        );
window.location.href = "/order-list/";
    }

    catch (error) {

        console.error(
            "Payment Update Error:",
            error
        );

        alert(
            "Failed to update payment status."
        );

    }

}


);

// =====================================
// PAGE LOAD
// =====================================

document.addEventListener(
"DOMContentLoaded",
loadPaymentStatus
);
