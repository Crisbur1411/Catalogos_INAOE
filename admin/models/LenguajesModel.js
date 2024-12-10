let language = {};
let languages = [];

/**
 * Establece el lenguaje actual basado en su ID.
 * @param {mixed} id - ID del lenguaje.
 */
function setLanguage(id) {
    language = languages.find(o => o.id === id);
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
        url: `${apiURL}api/admin/language/${endpoint}`,
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
 * Busca lenguajes.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function getLanguages(callBack, callBackError = null) {
    const data = {
        search_by: {
            all: true
        }
    };
    
    $.ajax({
        url: `${apiURL}api/admin/language/list`,
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}` },
        data: JSON.stringify(data),  
        contentType: "application/json"  
    }).done(function (response) {
        callBack(response.data);
    }).fail(function (error) {
        if (callBackError) callBackError(error);
    });
}

/**
 * Registra un lenguaje.
 * @param {mixed} data - Datos a registrar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function registerLanguage(data, callBack, callBackError = null) {
    ajaxRequest('create', data, callBack, callBackError);
}

/**
 * Actualiza la información de un lenguaje.
 * @param {mixed} data - Datos a actualizar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function updateLanguage(data, callBack, callBackError = null) {
    ajaxRequest('update', data, callBack, callBackError);
}

// Modal de Confirmación------------------>

let actionToConfirm = ''; // Variable para almacenar la acción a realizar

/**
 * Abre el modal de confirmación.
 * @param {string} action - La acción a confirmar ('activar' o 'desactivar').
 */
function openConfirmModal(action) {
    const actionText = action === 'activate' ? 'activar' : 'desactivar';
    const modalTitle = `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} lenguaje`;
    const modalMessage = `¿Estás seguro de ${actionText} el Lenguaje?`;

    $('#confirmModalLabel').text(modalTitle);
    $('#confirmModalText').text(modalMessage);
    $('#confirmModal').modal('show');
}

/**
 * Marca el lenguaje actual como "Activo" tras confirmar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function setLanguageActive(callBack, callBackError = null) {
    openConfirmModal('activate');
    $('#confirmActionBtn').off('click').on('click', function() {
        ajaxRequest('activate', { language_id: language.id }, callBack, callBackError);
        $('#confirmModal').modal('hide');
    });
}

/**
 * Marca el lenguaje actual como "Inactivo" tras confirmar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function setLanguageInactive(callBack, callBackError = null) {
    openConfirmModal('deactivate');
    $('#confirmActionBtn').off('click').on('click', function() {
        ajaxRequest('deactivate', { language_id: language.id }, callBack, callBackError);
        $('#confirmModal').modal('hide');
    });
}
