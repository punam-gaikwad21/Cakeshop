document.addEventListener("DOMContentLoaded", function(){


    const registerForm = document.getElementById("registerForm");


    if(registerForm){


        registerForm.addEventListener("submit", function(e){


            e.preventDefault();



            let first_name =
            document.getElementById("first_name").value;


            let last_name =
            document.getElementById("last_name").value;


            let username =
            document.getElementById("username").value;


            let email =
            document.getElementById("email").value;


            let password =
            document.getElementById("password").value;


            let confirm_password =
            document.getElementById("confirm_password").value;



            fetch("/api/register/",{


                method:"POST",


                headers:{


                    "Content-Type":"application/json"

                },


                body:JSON.stringify({


                    first_name:first_name,


                    last_name:last_name,


                    username:username,


                    email:email,


                    password:password,


                    confirm_password:confirm_password


                })


            })



            .then(response => response.json())



            .then(data => {



                if(data.message){



                    alert("Registration Successful 🎉");


                    window.location.href="/login/";



                }


                else{


                    alert(JSON.stringify(data));


                }


            })



            .catch(error=>{


                console.log(error);


                alert("Something went wrong");


            });



        });


    }



});