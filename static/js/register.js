document
.getElementById("registerForm")
.addEventListener("submit", function(e){

    e.preventDefault();


    let password =
    document.getElementById("password").value;


    let confirm_password =
    document.getElementById("confirm_password").value;


    if(password !== confirm_password){

        alert("Password and Confirm Password are not same");
        return;

    }



    let data = {

        first_name:
        document.getElementById("first_name").value,


        last_name:
        document.getElementById("last_name").value,


        username:
        document.getElementById("username").value,


        email:
        document.getElementById("email").value,


        password:password

    };



    fetch("/api/register/",{


        method:"POST",


        headers:{

            "Content-Type":"application/json"

        },


        body:JSON.stringify(data)


    })


    .then(response=>response.json())


    .then(result=>{


        console.log(result);



        if(result.message){


            alert(result.message);


            window.location.href="/login/";


        }

        else{


            alert(JSON.stringify(result));


        }



    })


    .catch(error=>{


        console.log(error);


        alert("Something went wrong");


    });



});