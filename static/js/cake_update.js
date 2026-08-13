const path = window.location.pathname;

// URL example:
// /cake-update/5/

const cakeId = path.split("/")[2];

const accessToken = localStorage.getItem("access");

// ==================================================
// AUTH CHECK
// ==================================================

if (!accessToken) {
    window.location.href = "/login/";
}


// ==================================================
// LOAD CAKE
// ==================================================

async function loadCake() {

    try {

        const response = await fetch(
            `/api/cakes/${cakeId}/`,
            {
                method: "GET",

                headers: {
                    Authorization:
                        `Bearer ${accessToken}`
                }
            }
        );


        if (!response.ok) {

            console.error(
                "Cake loading failed:",
                response.status
            );

            alert("Unable to load cake.");

            return;
        }


        const cake = await response.json();


        // ===============================
        // SET FORM VALUES
        // ===============================

        document.getElementById("name").value =
            cake.name ?? "";


        document.getElementById("price").value =
            cake.price ?? "";


        document.getElementById("weight").value =
            cake.weight ?? "";


        document.getElementById("description").value =
            cake.description ?? "";


        document.getElementById("status").value =
            cake.status ?? "available";


        // ===============================
        // CATEGORY
        // ===============================

        const categoryId =
            typeof cake.category === "object"
                ? cake.category.id
                : cake.category;


        document.getElementById("category").value =
            categoryId ?? "";


        // ===============================
        // IMAGE
        // ===============================

        const preview =
            document.getElementById("preview");


        if (cake.image) {

            preview.src = cake.image;

        } else {

            preview.src =
                "/static/images/no-image.png";
        }

    }

    catch (error) {

        console.error(
            "Load Cake Error:",
            error
        );

        alert("Unable to load cake.");

    }

}


// ==================================================
// LOAD CATEGORIES
// ==================================================

async function loadCategories() {

    try {

        const response = await fetch(
            "/api/categories/",
            {
                method: "GET",

                headers: {
                    Authorization:
                        `Bearer ${accessToken}`
                }
            }
        );


        if (!response.ok) {

            console.error(
                "Categories loading failed:",
                response.status
            );

            alert("Unable to load categories.");

            return;
        }


        const data = await response.json();

        const categories =
            data.results ?? data;


        const categorySelect =
            document.getElementById("category");


        // Clear existing options

        categorySelect.innerHTML = "";


        // Default option

        const defaultOption =
            document.createElement("option");

        defaultOption.value = "";
        defaultOption.textContent =
            "Select Category";

        categorySelect.appendChild(
            defaultOption
        );


        // Add categories

        categories.forEach(category => {

            const option =
                document.createElement("option");

            option.value = category.id;

            option.textContent =
                category.name;

            categorySelect.appendChild(
                option
            );

        });

    }

    catch (error) {

        console.error(
            "Load Categories Error:",
            error
        );

        alert("Unable to load categories.");

    }

}


// ==================================================
// IMAGE PREVIEW
// ==================================================

document
    .getElementById("image")
    .addEventListener(
        "change",
        function () {

            const image =
                this.files[0];


            if (!image) {
                return;
            }


            // Check image size
            // Maximum 2 MB

            if (image.size > 2 * 1024 * 1024) {

                alert(
                    "Image size should be less than 2 MB."
                );

                this.value = "";

                return;
            }


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    document
                        .getElementById("preview")
                        .src =
                        event.target.result;

                };


            reader.readAsDataURL(image);

        }
    );


// ==================================================
// UPDATE CAKE
// ==================================================

document
    .getElementById("cakeForm")
    .addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            // ===============================
            // FORM DATA
            // ===============================

            const formData =
                new FormData();


            formData.append(
                "name",
                document
                    .getElementById("name")
                    .value
                    .trim()
            );


            formData.append(
                "category",
                document
                    .getElementById("category")
                    .value
            );


            formData.append(
                "price",
                document
                    .getElementById("price")
                    .value
            );


            formData.append(
                "weight",
                document
                    .getElementById("weight")
                    .value
                    .trim()
            );


            formData.append(
                "description",
                document
                    .getElementById("description")
                    .value
                    .trim()
            );


            formData.append(
                "status",
                document
                    .getElementById("status")
                    .value
            );


            // ===============================
            // IMAGE
            // ===============================

            const image =
                document
                    .getElementById("image")
                    .files[0];


            // Only send new image

            if (image) {

                formData.append(
                    "image",
                    image
                );

            }


            // ===============================
            // UPDATE API
            // ===============================

            try {

                const response =
                    await fetch(
                        `/api/cakes/${cakeId}/`,
                        {
                            method: "PATCH",

                            headers: {
                                Authorization:
                                    `Bearer ${accessToken}`
                            },

                            body: formData
                        }
                    );


                // ===============================
                // SUCCESS
                // ===============================

                if (response.ok) {

                    alert(
                        "Cake Updated Successfully!"
                    );


                    window.location.href =
                        "/cake-list/";

                    return;
                }


                // ===============================
                // ERROR
                // ===============================

                const errorData =
                    await response
                        .json()
                        .catch(() => ({}));


                console.error(
                    "Update Error:",
                    errorData
                );


                // Show serializer validation errors

                if (
                    errorData &&
                    typeof errorData === "object"
                ) {

                    const messages =
                        Object.values(errorData)
                            .flat()
                            .join("\n");


                    if (messages) {

                        alert(messages);

                    } else {

                        alert(
                            "Update Failed."
                        );

                    }

                } else {

                    alert(
                        "Update Failed."
                    );

                }

            }

            catch (error) {

                console.error(
                    "Update Error:",
                    error
                );

                alert(
                    "Server Error."
                );

            }

        }
    );


// ==================================================
// PAGE LOAD
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        // First load categories

        await loadCategories();


        // Then load cake

        await loadCake();

    }
);