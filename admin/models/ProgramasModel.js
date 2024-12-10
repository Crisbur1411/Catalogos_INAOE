// Variables globales para manejar un reporte individual y la lista de reportes.
let program = {};
let programs = [];

/**
 * Establece el program actual basado en su ID.
 * @param {mixed} id - ID del program.
 */
function setProgram(id) {
    program = programs.find(o => o.id === id);
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
        url: `${apiURL}api/admin/program/${endpoint}`,
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
 * Registra un Documento.
 * @param {mixed} data - Datos a registrar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function registerDocument(data, callBack, callBackError = null) {
    ajaxRequest('update_documents', data, callBack, callBackError);
}

/**
 * Busca documentos.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function getDocuments(callBack, callBackError = null) {
    const data = {
        search_by: {
            all: true
        }
    };
    
    $.ajax({
        url: `${apiURL}api/admin/program/document/search`,
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
 * Busca requisitos.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function getRequisito(callBack, callBackError = null) {
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
 * Busca programs.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function getPrograms(callBack, callBackError = null) {
    const data = {
        search_by: {
            all: true
        }
    };
    
    $.ajax({
        url: `${apiURL}api/admin/program/list`,
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
 * Registra un program.
 * @param {mixed} data - Datos a registrar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function registerProgram(data, callBack, callBackError = null) {
    ajaxRequest('create', data, callBack, callBackError);
}


/**
 * Actualiza la información de un program.
 * @param {mixed} data - Datos a actualizar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function updateProgram(data, callBack, callBackError = null) {
    ajaxRequest('update', data, callBack, callBackError);
}

/**
 * Marca el program actual como "Activo".
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function setProgramActive(callBack, callBackError = null) {
    ajaxRequest('activate', { program_id: program.id }, callBack, callBackError);
}

/**
 * Marca el program actual como "Inactivo".
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function setProgramInactive(callBack, callBackError = null) {
    ajaxRequest('deactivate', { program_id: program.id }, callBack, callBackError);
}

// Modal de Confirmación------------------>.

let actionToConfirm = ''; // Variable para almacenar la acción a realizar

/**
 * Abre el modal de confirmación.
 * @param {string} action - La acción a confirmar ('activar' o 'desactivar').
 */
function openConfirmModal(action) {
    const actionText = action === 'activate' ? 'activar' : 'desactivar';
    const modalTitle = `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} programa`;
    const modalMessage = `¿Estás seguro de ${actionText} el programa?`;

    $('#confirmModalLabel').text(modalTitle);
    $('#confirmModalText').text(modalMessage);
    $('#confirmModal').modal('show');
}

/**
 * Marca el program actual como "Activo" tras confirmar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function setProgramActive(callBack, callBackError = null) {
    openConfirmModal('activate');
    $('#confirmActionBtn').off('click').on('click', function() {
        ajaxRequest('activate', { program_id: program.id }, callBack, callBackError);
        $('#confirmModal').modal('hide');
    });
}

/**
 * Marca el program actual como "Inactivo" tras confirmar.
 * @param {function} callBack - Función a ejecutar en caso de éxito.
 * @param {function} [callBackError=null] - Función a ejecutar en caso de error.
 */
function setProgramInactive(callBack, callBackError = null) {
    openConfirmModal('deactivate');
    $('#confirmActionBtn').off('click').on('click', function() {
        ajaxRequest('deactivate', { program_id: program.id }, callBack, callBackError);
        $('#confirmModal').modal('hide');
    });
}
