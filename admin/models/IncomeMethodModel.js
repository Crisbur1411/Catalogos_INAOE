// Variables globales para manejar un reporte individual y la lista de reportes.
let method = {};
let methods = [];

/**
 * Establece el método de ingreso actual basado en su ID.
 * @param {mixed} id - ID del método de ingreso.
 */
function setIncomeMethod(id) {
    method = methods.find(o => o.id === id);
}

/**
 * Realiza una solicitud AJAX.
 * @param {string} endpoint - Endpoint de la API.
 * @param {mixed} data - Datos a enviar en la solicitud.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function ajaxRequest(endpoint, data, callBack, callBackError = null) {
    const settings = {
        url: `${apiURL}api/admin/income_method/${endpoint}`,
        method: "POST",
        data: data,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    $.ajax(settings).done(function (response) {
        callBack(response.data);
    }).fail(function (error) {
        if (callBackError) callBackError(error);
    });
}


/**
 * Busca metodos de ingreso
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function getIncomeMethods(callBack, callBackError = null) {
    $.ajax({
        ...{
            url: `${apiURL}api/admin/income_method/search`,
            method: "POST",
            headers: { 'Authorization': `Bearer ${token}` },
        }
    }).done(function (response) {
        callBack(response.data);
    }).fail(function (error) {
        if (callBackError) callBackError(error);
    });
}

/**
 * Registra un método de ingreso.
 * @param {mixed} data - Datos a registrar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function registerIncomeMethod(data, callBack, callBackError = null) {
    ajaxRequest('create', data, callBack, callBackError);
}


/**
 * Actualiza la información de un método de ingreso.
 * @param {mixed} data - Datos a actualizar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function updateIncomeMethod(data, callBack, callBackError = null) {
    ajaxRequest('update', data, callBack, callBackError);
}


/**
 * Marca el método de ingreso actual como "Activo".
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function setIncomeMethodActive(callBack, callBackError = null) {
    ajaxRequest('activate', { method_id: method.id }, callBack, callBackError);
}

/**
 * Marca el método de ingreso actual como "Activo".
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function setIncomeMethodInactive(callBack, callBackError = null) {
    ajaxRequest('deactivate', { method_id: method.id }, callBack, callBackError);
}