document
    .getElementById("loginForm")
    .addEventListener("submit", function (e) {

        e.preventDefault();

        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;

        fetch("/api/login/", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username: username,
                password: password
            })

        })

        .then(response => response.json())

        .then(data => {

            console.log(data);

            if (data.access) {

                localStorage.setItem("access", data.access);
                localStorage.setItem("refresh", data.refresh);

                alert("Login Successful");

                window.location.href = data.redirect;

            } else {

                alert(data.error || "Invalid Login");

            }

        })

        .catch(error => {

            console.log(error);
            alert("Something went wrong");

        });

    });