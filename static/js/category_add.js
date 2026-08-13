const form = document.getElementById("categoryForm");

form.addEventListener("submit", async function (e) {

    e.preventDefault();


    // ==========================================
    // GET CATEGORY NAME
    // ==========================================

    const name =
        document
            .getElementById("name")
            .value
            .trim();


    // ==========================================
    // VALIDATION
    // ==========================================

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


    // ==========================================
    // ACCESS TOKEN
    // ==========================================

    const accessToken =
        localStorage.getItem("access");


    if (!accessToken) {

        alert(
            "Please login as admin."
        );

        window.location.href =
            "/login/";

        return;
    }


    // ==========================================
    // API REQUEST
    // ==========================================

    try {

        const response =
            await fetch(
                "/api/categories/",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${accessToken}`

                    },

                    body: JSON.stringify({
                        name: name
                    })

                }
            );


        const data =
            await response.json()
                .catch(() => ({}));


        // ==========================================
        // SUCCESS
        // ==========================================

        if (response.ok) {

            alert(
                "Category Added Successfully"
            );

            window.location.href =
                "/category-list/";

            return;
        }


        // ==========================================
        // VALIDATION ERROR
        // ==========================================

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
                "Unable to Add Category"
            );

        }

    }

    catch (error) {

        console.error(
            "Category Add Error:",
            error
        );

        alert(
            "Server Error"
        );

    }

});