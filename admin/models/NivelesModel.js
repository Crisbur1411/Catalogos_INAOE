// Variables globales para manejar un reporte individual y la lista de reportes.
let level = {};
let levels = [];

/**
 * Establece el level actual basado en su ID.
 * @param {mixed} id - ID del level.
 */
function setLevel(id) {
    level = levels.find(o => o.id === id);
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
        url: `${apiURL}api/admin/level/${endpoint}`,
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
 * Busca levels.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function getLevels(callBack, callBackError = null) {
    const data = {
        search_by: {
            all: true
        }
        
    };
    
    $.ajax({
        url: `${apiURL}api/admin/level/search`,
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
 * Registra un level.
 * @param {mixed} data - Datos a registrar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function registerLevel(data, callBack, callBackError = null) {
    ajaxRequest('create', data, callBack, callBackError);
}

/**
 * Actualiza la información de un level.
 * @param {mixed} data - Datos a actualizar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function updateLevel(data, callBack, callBackError = null) {
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
    const modalTitle = `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} nivel`;
    const modalMessage = `¿Estás seguro de ${actionText} el nivel?`;

    $('#confirmModalLabel').text(modalTitle);
    $('#confirmModalText').text(modalMessage);
    $('#confirmModal').modal('show');
}

/**
 * Marca el level actual como "Activo" tras confirmar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function setLevelActive(callBack, callBackError = null) {
    openConfirmModal('activate');
    $('#confirmActionBtn').off('click').on('click', function() {
        ajaxRequest('activate', { level_id: level.id }, callBack, callBackError);
        $('#confirmModal').modal('hide');
    });
}

/**
 * Marca el level actual como "Inactivo" tras confirmar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function setLevelInactive(callBack, callBackError = null) {
    openConfirmModal('deactivate');
    $('#confirmActionBtn').off('click').on('click', function() {
        ajaxRequest('deactivate', { level_id: level.id }, callBack, callBackError);
        $('#confirmModal').modal('hide');
    });
}
