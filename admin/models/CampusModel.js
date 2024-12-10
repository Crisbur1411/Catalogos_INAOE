let campus = {};
let campuses = [];

/**
 * Establece el campus actual basado en su ID.
 * @param {mixed} id - ID del campus.
 */
function setCampus(id) {
    campus = campuses.find(o => o.id === id);
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
        url: `${apiURL}api/admin/campus/${endpoint}`,
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
 * Busca campuses.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function getCampuses(callBack, callBackError = null) {
    const data = {
        search_by: {
            all: true
        }
    };
    
    $.ajax({
        url: `${apiURL}api/admin/campus/search`,
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
 * Registra un campus.
 * @param {mixed} data - Datos a registrar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function registerCampus(data, callBack, callBackError = null) {
    ajaxRequest('create', data, callBack, callBackError);
}

/**
 * Actualiza la información de un campus.
 * @param {mixed} data - Datos a actualizar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function updateCampus(data, callBack, callBackError = null) {
    ajaxRequest('update', data, callBack, callBackError);
}

//Modal de Confirmacion------------------>.

let actionToConfirm = ''; // Variable para almacenar la acción a realizar

/**
 * Abre el modal de confirmación.
 * @param {string} action - La acción a confirmar ('activar' o 'desactivar').
 */
function openConfirmModal(action) {
    const actionText = action === 'activate' ? 'activar' : 'desactivar';
    const modalTitle = `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} campus`;
    const modalMessage = `¿Estás seguro de ${actionText} el Campus?`;

    $('#confirmModalLabel').text(modalTitle);
    $('#confirmModalText').text(modalMessage);
    $('#confirmModal').modal('show');
}

/**
 * Marca el campus actual como "Activo" tras confirmar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function setCampusActive(callBack, callBackError = null) {
    openConfirmModal('activate');
    $('#confirmActionBtn').off('click').on('click', function() {
        ajaxRequest('activate', { campus_id: campus.id }, callBack, callBackError);
        $('#confirmModal').modal('hide');
    });
}

/**
 * Marca el level actual como "Inactivo" tras confirmar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function setCampusInactive(callBack, callBackError = null) {
    openConfirmModal('deactivate');
    $('#confirmActionBtn').off('click').on('click', function() {
        ajaxRequest('deactivate', { campus_id: campus.id }, callBack, callBackError);
        $('#confirmModal').modal('hide');
    });
}



