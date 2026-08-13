const homeCakeContainer =
    document.getElementById(
        "homeCakeContainer"
    );


async function loadHomeCakes() {

    try {

        const response =
            await fetch(
                "/api/cakes/"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load cakes"
            );

        }


        const data =
            await response.json();


        const cakes =
            data.results ?? data;


        homeCakeContainer.innerHTML = "";


        if (
            !cakes ||
            cakes.length === 0
        ) {

            homeCakeContainer.innerHTML = `

                <div class="col-12 text-center">

                    <p>
                        No Cakes Available
                    </p>

                </div>

            `;

            return;
        }


        cakes
            .slice(0, 6)
            .forEach(cake => {

                const col =
                    document.createElement(
                        "div"
                    );

                col.className =
                    "col-lg-4 col-md-6";


                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "cake-card";


                const imageContainer =
                    document.createElement(
                        "div"
                    );

                imageContainer.className =
                    "cake-image";


                const image =
                    document.createElement(
                        "img"
                    );

                image.src =
                    cake.image ||
                    "/static/images/no-image.png";

                image.alt =
                    cake.name || "Cake";

                image.className =
                    "img-fluid";


                imageContainer.appendChild(
                    image
                );


                const content =
                    document.createElement(
                        "div"
                    );

                content.className =
                    "cake-content text-center";


                const name =
                    document.createElement(
                        "h4"
                    );

                name.textContent =
                    cake.name || "";


                content.appendChild(
                    name
                );


                card.appendChild(
                    imageContainer
                );

                card.appendChild(
                    content
                );


                col.appendChild(
                    card
                );


                homeCakeContainer.appendChild(
                    col
                );

            });

    }

    catch (error) {

        console.error(
            "Home Cakes Error:",
            error
        );


        homeCakeContainer.innerHTML = `

            <div class="col-12 text-center">

                <p class="text-danger">
                    Unable to load cakes.
                </p>

            </div>

        `;

    }

}


document.addEventListener(
    "DOMContentLoaded",
    loadHomeCakes
);