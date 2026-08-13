const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");
const form = document.getElementById("cakeForm");
const categorySelect = document.getElementById("category");

const accessToken = localStorage.getItem("access");


imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        preview.src = "/static/images/no-image.png";
        return;
    }

    preview.src = URL.createObjectURL(file);
});


form.addEventListener("submit", async function (e) {

    e.preventDefault();

    if (!imageInput.files[0]) {
        alert("Please select a cake image.");
        return;
    }

    const formData = new FormData();

    formData.append(
        "name",
        document.getElementById("name").value.trim()
    );

    formData.append(
        "category",
        categorySelect.value
    );

    formData.append(
        "price",
        document.getElementById("price").value
    );

    formData.append(
        "weight",
        document.getElementById("weight").value.trim()
    );

    formData.append(
        "description",
        document.getElementById("description").value.trim()
    );

    formData.append(
        "status",
        document.getElementById("status").value
    );

    formData.append(
        "image",
        imageInput.files[0]
    );


    try {

        const response = await fetch("/api/cakes/", {

            method: "POST",

            headers: {
                "Authorization": `Bearer ${accessToken}`
            },

            body: formData
        });


        const data = await response.json();


        if (response.ok) {

            alert("Cake Added Successfully");

            window.location.href = "/cake-list/";

        } else {

            console.log(data);

            alert("Unable to Add Cake");
        }

    } catch (error) {

        console.error(error);

        alert("Server Error");
    }

});


async function loadCategories() {

    try {

        const response = await fetch(
            "/api/categories/",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            }
        );


        if (!response.ok) {
            throw new Error("Failed to load categories");
        }


        const categories = await response.json();


        categorySelect.innerHTML =
            '<option value="">Select Category</option>';


        categories.forEach(category => {

            const option =
                document.createElement("option");

            option.value = category.id;
            option.textContent = category.name;

            categorySelect.appendChild(option);

        });

    } catch (error) {

        console.error(error);

        alert("Unable to load categories.");
    }
}


document.addEventListener(
    "DOMContentLoaded",
    loadCategories
);