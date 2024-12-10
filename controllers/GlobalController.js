const environment = 'staging';
const projectURL = `${window.location.protocol}//${window.location.host}`;
var token = sessionStorage.getItem('token');
var apiURL = '';

$(function () {
    setAPIUrl();
});

function setAPIUrl() {
    const urls = {
        local: '',
        staging: 'https://students-control-staging.herokuapp.com/',
        production: ''
    };

    apiURL = urls[environment] || '';
}

function returnToLogin() {
    window.location.href = projectURL;
}

function reloadPage() {
    location.reload();
}

function goBack() {
    history.back();
}

function logout() {
    const settings = {
        url: `${apiURL}api/auth/logout`,
        method: "POST",
        type: 0,
        headers: {
            "Authorization": "Bearer " + token
        }
    };

    $.ajax(settings).done(function (response) {

        sessionStorage.clear();
        returnToLogin();

    }).fail(function (error) {
        console.log(error);
    });
}
