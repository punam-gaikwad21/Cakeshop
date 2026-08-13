const table = document.getElementById("categoryTable");

let categoryId = null;

const accessToken = localStorage.getItem("access");

if (!accessToken) {
    window.location.href = "/login/";
}

async function loadCategories() {

    try {

        const response = await fetch(
            "/api/categories/",
            {
                headers: {
                    Authorization:
                        `Bearer ${accessToken}`
                }
            }
        );

        if (response.status === 401) {
            localStorage.removeItem("access");
            window.location.href = "/login/";
            return;
        }

        if (!response.ok) {
            throw new Error(
                `Failed to load categories: ${response.status}`
            );
        }

        const data = await response.json();

        const categories = data.results ?? data;

        table.innerHTML = "";

        if (!categories || categories.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="3" class="text-center">
                        No Categories Found
                    </td>
                </tr>
            `;

            return;
        }

        categories.forEach(category => {

            const row = document.createElement("tr");

            const idCell = document.createElement("td");
            idCell.textContent = category.id;

            const nameCell = document.createElement("td");
            nameCell.textContent = category.name;

            const actionCell = document.createElement("td");
            actionCell.className = "text-center";

            const editButton =
                document.createElement("button");

            editButton.type = "button";
            editButton.className =
                "btn btn-sm btn-primary me-1";

            editButton.innerHTML =
                '<i class="bi bi-pencil"></i>';

            editButton.addEventListener(
                "click",
                function () {
                    editCategory(category.id);
                }
            );

            const deleteButton =
                document.createElement("button");

            deleteButton.type = "button";
            deleteButton.className =
                "btn btn-sm btn-danger";

            deleteButton.innerHTML =
                '<i class="bi bi-trash"></i>';

            deleteButton.addEventListener(
                "click",
                function () {
                    deleteCategory(category.id);
                }
            );

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);

            row.appendChild(idCell);
            row.appendChild(nameCell);
            row.appendChild(actionCell);

            table.appendChild(row);

        });

    }

    catch (error) {

        console.error(
            "Load Category Error:",
            error
        );

        table.innerHTML = `
            <tr>
                <td colspan="3" class="text-center">
                    Unable to load categories.
                </td>
            </tr>
        `;

    }

}

function editCategory(id) {

    window.location.href =
        `/category-update/${id}/`;

}

function deleteCategory(id) {

    categoryId = id;

    const modalElement =
        document.getElementById(
            "deleteCategoryModal"
        );

    if (!modalElement) {

        console.error(
            "deleteCategoryModal not found in HTML"
        );

        return;
    }

    const deleteModal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );

    deleteModal.show();

}

const confirmDeleteButton =
    document.getElementById(
        "confirmDeleteCategory"
    );

if (confirmDeleteButton) {

    confirmDeleteButton.addEventListener(
        "click",
        async function () {

            if (!categoryId) {

                alert(
                    "Category ID not found."
                );

                return;
            }

            try {

                const response =
                    await fetch(
                        `/api/categories/${categoryId}/`,
                        {
                            method: "DELETE",

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

                if (
                    response.ok ||
                    response.status === 204
                ) {

                    const modalElement =
                        document.getElementById(
                            "deleteCategoryModal"
                        );

                    const deleteModal =
                        bootstrap.Modal.getInstance(
                            modalElement
                        );

                    if (deleteModal) {
                        deleteModal.hide();
                    }

                    categoryId = null;

                    alert(
                        "Category Deleted Successfully"
                    );

                    await loadCategories();

                }

                else {

                    let data = {};

                    try {
                        data = await response.json();
                    }
                    catch (error) {
                        console.error(error);
                    }

                    alert(
                        data.detail ||
                        data.message ||
                        "Unable to Delete Category"
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

}

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadCategories();

    }
);