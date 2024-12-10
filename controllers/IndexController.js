
$(function () {
    sessionStorage.clear();
});

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const email = $("#email");
    const password = $("#password");

    const data = {
        email: email.val(),
        password: password.val(),
    };

    const settings = {
        url: `${apiURL}api/auth/login`,
        method: "POST",
        type: 0,
        data: data
    };

    $.ajax(settings).done( response => {

        console.info(response);

        //Se asigna el token de acesso
        token = sessionStorage.setItem('token', response.data.access_token);
        console.log(sessionStorage.getItem('token'));
        

        // Ejemplo de redirección, considerar roles
        window.location.href = './admin/index.php';

    }).fail( error => {

        console.log(error);
    
    });
});