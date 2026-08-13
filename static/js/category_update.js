const path = window.location.pathname;

const categoryId = path.split("/")[2];

const form =
    document.getElementById("categoryForm");

const accessToken =
    localStorage.getItem("access");


if (!accessToken) {

    window.location.href =
        "/login/";

}


async function loadCategory() {

    try {

        const response =
            await fetch(
                `/api/categories/${categoryId}/`,
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

            window.location.href =
                "/login/";

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Unable to load category"
            );

        }


        const category =
            await response.json();


        document
            .getElementById("name")
            .value =
            category.name ?? "";

    }

    catch (error) {

        console.error(
            "Load Category Error:",
            error
        );

        alert(
            "Unable to load category."
        );

    }

}


if (form) {

    form.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            if (name === "") {

                alert(
                    "Category Name is required"
                );

                return;
            }


            if (name.length < 2) {

                alert(
                    "Category name must be at least 2 characters."
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        `/api/categories/${categoryId}/`,
                        {
                            method: "PUT",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${accessToken}`

                            },

                            body: JSON.stringify({
                                name: name
                            })
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


                const data =
                    await response
                        .json()
                        .catch(() => ({}));


                if (response.ok) {

                    alert(
                        "Category Updated Successfully"
                    );


                    window.location.href =
                        "/category-list/";

                    return;
                }


                if (data.name) {

                    alert(
                        data.name[0]
                    );

                }

                else if (data.detail) {

                    alert(
                        data.detail
                    );

                }

                else {

                    alert(
                        "Update Failed"
                    );

                }

            }

            catch (error) {

                console.error(
                    "Update Category Error:",
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

        loadCategory();

    }
);


function editCategory(id) {

    window.location.href =
        `/category-update/${id}/`;

}