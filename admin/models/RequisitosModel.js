let requirement = {};
let requirements = [];

/**
 * Establece el requirement actual basado en su ID.
 * @param {mixed} id - ID del requirement.
 */
function setRequirement(id) {
    requirement = requirements.find(o => o.id === id);
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
        url: `${apiURL}api/admin/program/graduation_requirement/${endpoint}`,
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
 * Busca requirements.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function getRequirements(callBack, callBackError = null) {
    const data = {
        search_by: {
            all: true
        }
    };
    
    $.ajax({
        url: `${apiURL}api/admin/program/graduation_requirement/search`,
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
 * Registra un requirement.
 * @param {mixed} data - Datos a registrar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function registerRequirement(data, callBack, callBackError = null) {
    ajaxRequest('create', data, callBack, callBackError);
}

/**
 * Actualiza la información de un requirement.
 * @param {mixed} data - Datos a actualizar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function updateRequirement(data, callBack, callBackError = null) {
    ajaxRequest('update', data, callBack, callBackError);
}

// Modal de Confirmación ------------------>.

let actionToConfirm = ''; // Variable para almacenar la acción a realizar

/**
 * Abre el modal de confirmación.
 * @param {string} action - La acción a confirmar ('activar' o 'desactivar').
 */
function openConfirmModal(action) {
    const actionText = action === 'activate' ? 'activar' : 'desactivar';
    const modalTitle = `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Requisito`;
    const modalMessage = `¿Estás seguro de ${actionText} el Requisito?`;

    $('#confirmModalLabel').text(modalTitle);
    $('#confirmModalText').text(modalMessage);
    $('#confirmModal').modal('show');
}

/**
 * Marca el requirement actual como "Activo" tras confirmar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function setRequirementActive(callBack, callBackError = null) {
    openConfirmModal('activate');
    $('#confirmActionBtn').off('click').on('click', function() {
        ajaxRequest('activate', { requirement_id: requirement.id }, callBack, callBackError);
        $('#confirmModal').modal('hide');
    });
}

/**
 * Marca el requirement actual como "Inactivo" tras confirmar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function setRequirementInactive(callBack, callBackError = null) {
    openConfirmModal('deactivate');
    $('#confirmActionBtn').off('click').on('click', function() {
        ajaxRequest('deactivate', { requirement_id: requirement.id }, callBack, callBackError);
        $('#confirmModal').modal('hide');
    });
}
