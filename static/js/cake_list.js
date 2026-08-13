const tableBody = document.getElementById("cakeTable");

const accessToken =
localStorage.getItem("access");

let deleteCakeId = null;

// ==================================================
// LOAD CAKES
// ==================================================

async function loadCakes() {


try {

    const response = await fetch(
        "/api/cakes/",
        {
            headers: {
                Authorization:
                    `Bearer ${accessToken}`
            }
        }
    );


    if (!response.ok) {

        throw new Error(
            "Unable to load cakes"
        );

    }


    const data =
        await response.json();


    // Pagination support

    const cakes =
        data.results ?? data;


    tableBody.innerHTML = "";


    if (cakes.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="text-center py-5">

                    No Cake Found

                </td>
            </tr>
        `;

        return;
    }


    cakes.forEach(cake => {

        tableBody.innerHTML += `

            <tr>

                <!-- IMAGE -->

                <td>

                    <img
                        src="${cake.image || '/static/images/no-image.png'}"
                        width="70"
                        height="70"
                        style="
                            object-fit:cover;
                            border-radius:10px;
                        ">

                </td>


                <!-- NAME -->

                <td>
                    ${cake.name}
                </td>


                <!-- CATEGORY -->

                <td>
                    ${cake.category_name || ""}
                </td>


                <!-- PRICE -->

                <td>
                    ₹${cake.price}
                </td>


                <!-- WEIGHT -->

                <td>
                    ${cake.weight}
                </td>


                <!-- STATUS -->

                <td>

                    ${
                        cake.status === "available"

                        ?

                        `<span class="status-active">
                            Available
                        </span>`

                        :

                        `<span class="status-out">
                            Out Of Stock
                        </span>`
                    }

                </td>


                <!-- ACTION -->

                <td>

                    <!-- EDIT -->

                    <button
                        type="button"
                        class="action-btn edit-btn"
                        onclick="editCake(${cake.id})">

                        <i class="bi bi-pencil-square"></i>

                    </button>


                    <!-- DELETE -->

                    <button
                        type="button"
                        class="action-btn delete-btn"
                        onclick="deleteCake(${cake.id})">

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            </tr>

        `;

    });

}

catch (error) {

    console.error(
        "Load Cakes Error:",
        error
    );

}


}

// ==================================================
// EDIT CAKE
// ==================================================

function editCake(id) {


window.location.href =
    `/cake-update/${id}/`;


}

// ==================================================
// DELETE CAKE - OPEN MODAL
// ==================================================

function deleteCake(id) {


deleteCakeId = id;


const modalElement =
    document.getElementById(
        "deleteModal"
    );


if (!modalElement) {

    console.error(
        "deleteModal not found!"
    );

    return;
}


const deleteModal =
    new bootstrap.Modal(
        modalElement
    );


deleteModal.show();


}

// ==================================================
// CONFIRM DELETE
// ==================================================

document
.getElementById("confirmDelete")
.addEventListener(
"click",
async function () {


        if (!deleteCakeId) {

            alert(
                "Cake ID not found."
            );

            return;
        }


        try {

            const response =
                await fetch(
                    `/api/cakes/${deleteCakeId}/`,
                    {
                        method: "DELETE",

                        headers: {
                            Authorization:
                                `Bearer ${localStorage.getItem("access")}`
                        }
                    }
                );


            // ==========================
            // DELETE SUCCESS
            // ==========================

            if (
                response.ok ||
                response.status === 204
            ) {

                const modalElement =
                    document.getElementById(
                        "deleteModal"
                    );


                const deleteModal =
                    bootstrap.Modal
                        .getInstance(
                            modalElement
                        );


                if (deleteModal) {

                    deleteModal.hide();

                }


                deleteCakeId = null;


                alert(
                    "Cake Deleted Successfully"
                );


                // Reload table

                loadCakes();

            }


            // ==========================
            // DELETE FAILED
            // ==========================

            else {

                console.error(
                    "Delete failed:",
                    response.status
                );


                alert(
                    "Unable to Delete Cake"
                );

            }

        }

        catch (error) {

            console.error(
                "Delete Error:",
                error
            );


            alert(
                "Server Error"
            );

        }

    }
);


// ==================================================
// PAGE LOAD
// ==================================================

document.addEventListener(
"DOMContentLoaded",
function () {


    loadCakes();

}


);
