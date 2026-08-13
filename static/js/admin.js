
/* ADMIN LOGOUT */

function adminLogout() {

    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");


    fetch("/api/logout/", {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + access
        },

        body: JSON.stringify({
            refresh: refresh
        })

    })

    .finally(() => {

        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        window.location.href = "/login/";

    });
}


/* ADMIN SIDEBAR TOGGLE */

document.addEventListener("DOMContentLoaded", function () {

    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.querySelector(".sidebar");


    if (menuToggle && sidebar) {

        menuToggle.addEventListener("click", function () {

            sidebar.classList.toggle("active");

        });

    }

});
