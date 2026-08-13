document.addEventListener(
    "DOMContentLoaded",
    loadNavbar
);


function loadNavbar() {

    const guestMenu =
        document.getElementById("guestMenu");

    const userMenu =
        document.getElementById("userMenu");


    if (!guestMenu || !userMenu) {
        return;
    }


    const accessToken =
        localStorage.getItem("access");


    if (accessToken) {

        guestMenu.style.display = "none";

        userMenu.style.display = "flex";

    }

    else {

        guestMenu.style.display = "block";

        userMenu.style.display = "none";

    }

}


async function logout() {

    const accessToken =
        localStorage.getItem("access");

    const refreshToken =
        localStorage.getItem("refresh");


    try {

        if (accessToken && refreshToken) {

            await fetch(
                "/api/logout/",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${accessToken}`
                    },

                    body: JSON.stringify({
                        refresh:
                            refreshToken
                    })
                }
            );

        }

    }

    catch (error) {

        console.error(
            "Logout Error:",
            error
        );

    }


    localStorage.removeItem("access");
    localStorage.removeItem("refresh");


    window.location.href = "/login/";
}