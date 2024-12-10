$(document).ready(function () {
    // Mostrar el modal de espera al cargar la página
$('#loadingModal').modal('show');

    // Recupera los datos cuando la página esté lista
getPrograms(data => {
    programs = data;
    fillDataTable();

    // Cerrar el modal de espera después de que los datos se hayan cargado
    setTimeout(() => {
        $('#loadingModal').modal('hide');
    }, 500);
});
});

// Usar window.onload para asegurarnos de que la página completa haya cargado
window.onload = function () {
setTimeout(() => {
    $('#loadingModal').modal('hide');
}, 500); // Añadimos un pequeño retraso de 500ms
};

// Detectar navegación de regreso a la página y recargar los datos
$(window).on('pageshow', function () {
$('#loadingModal').modal('show');

// Volver a cargar los Programas y cerrar el modal
getPrograms(data => {
    programs = data;
    fillDataTable();

    setTimeout(() => {
        $('#loadingModal').modal('hide');
    }, 500);// Añadimos un pequeño retraso de 500ms
});
});


/**
* Rellena de información la tabla principal
*/
let dataDatable = [];
let count = 0;
const $table = $('#ProgramTabla');

$table.bootstrapTable({
search: true,
pagination: true,
pageSize: 25,
pageList: [25, 50, 100, 200],
showColumns: true,
showColumnsToggleAll: true,
exportTypes: ['excel', 'pdf']
});

function createStatusBadge(status) {
const statusMap = {
    created: '<span class="badge bg-secondary">Creado</span>',
    active: '<span class="badge bg-success">Activo</span>',
    inactive: '<span class="badge bg-danger">Inactivo</span>'
};
return statusMap[status] || statusMap.created;
}

function createActionButtons(val, count) {
    const statusButton = val.status === 'active'
        ? createStatusButton('danger', val.id, count, 'Desactivar', 'fa-lock')
        : createStatusButton('success', val.id, count, 'Activar', 'fa-unlock');

    const editButton = `<button type="button" class="btn btn-warning me-2 border" onclick="updateModalProgram(${val.id}, ${count})" data-bs-toggle="tooltip" data-bs-title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>`;
    const documentButton = `<button type="button" class="btn btn-warning me-2 border" onclick="openDocumentSelectModal('${val.name}', ${val.id})" data-bs-toggle="tooltip" data-bs-title="Editar Documentos"><i class="fa-solid fa-file-alt"></i></button>`;
    const requirementButton = `<button type="button" class="btn btn-warning me -2 border" onclick="openRequisitoSelectModal('${val.name}', ${val.id})" data-bs-toggle="tooltip" data-bs-title="Editar Requisitos"><i class="fa-solid fa-graduation-cap"></i></button>`;

    // Agregar márgenes adicionales y bordes a `statusButton` si es necesario.
    const statusButtonWithBorder = statusButton.replace('btn', 'btn border me-2');

    return `<div class="btn-group btn-group-sm">${statusButtonWithBorder}${editButton}${documentButton}${requirementButton}</div>`;
}



function createStatusButton(type, id, count, tooltip, icon) {
return `<button type="button" class="btn btn-${type}" onclick="${type === 'success' ? 'setActive' : 'setInactive'}(${id}, ${count})" data-bs-toggle="tooltip" data-bs-title="${tooltip}"><i class="fa-solid ${icon}"></i></button>`;
}

// Mostrar/ocultar el filtro de estatus según el checkbox
$('#filterCheckbox').on('change', function () {
if ($(this).is(':checked')) {
    $('#statusFilterContainer').show();

    // Seleccionar la primera opción del select y aplicar el filtro automáticamente
    const $statusFilter = $('#statusFilter');
    $statusFilter.prop('selectedIndex', 0); // Selecciona la primera opción
    const selectedStatus = $statusFilter.val();
    filterTableByStatus(selectedStatus); // Aplica el filtro con la primera opción seleccionada
} else {
    $('#statusFilterContainer').hide();
    // Si desactivan el checkbox, se muestran todos los programas
    fillDataTable();
}
});

// Filtrar datos cuando se cambia el select de estatus
$('#statusFilter').on('change', function () {
const selectedStatus = $(this).val();
filterTableByStatus(selectedStatus);
});

// Función para filtrar la tabla por estatus
function filterTableByStatus(status) {
const filteredData = programs.filter(program => program.status === status);
fillDataTable(filteredData);
}

function fillDataTable(data = programs) {
$table.bootstrapTable('showLoading');

// Reiniciar el contador de filas
count = 0; 

// Generar los datos para la tabla
dataDatable = data.map(val => {
    count++; 
    return {
        count: count, 
        name: val.name, 
        abbreviation: val.abbreviation,
        key: val.key,
        description: val.description,
        status: createStatusBadge(val.status),
        actions: createActionButtons(val, count)
    };
});


$table.bootstrapTable('load', dataDatable);
$table.bootstrapTable('hideLoading');

const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}


// Función auxiliar para actualizar el estado y las acciones
function updateTableRow(rowID, data) {
$table.bootstrapTable('updateByUniqueId', {
    id: rowID,
    row: {
        status: createStatusBadge(data.status),
        actions: createActionButtons(data, rowID)
    }
});
}

// Activar
function setActive(programID, rowID) {
setProgram(programID);
setProgramActive(data => {
    updateTableRow(rowID, data.program);
});
}

// Desactivar
function setInactive(programID, rowID) {
setProgram(programID);
setProgramInactive(data => {
    updateTableRow(rowID, data.program);
});
}

// REGISTRAR
const registerFormProgram = document.getElementById("registerFormProgram");
const registerFields = {
name: $("#ProgramName"),
abbreviation: $("#ProgramAbbreviation"),
key: $("#ProgramClave"),
description: $("#ProgramDescription")
};

// Función para verificar si ya existe un programa con la misma clave
function checkDuplicateKey(key) {
return programs.some(program => program.key === key);
}

// Manejador del evento submit para registrar un programa
registerFormProgram.addEventListener("submit", (e) => {
e.preventDefault();

const data = {
    name: registerFields.name.val(),
    abbreviation: registerFields.abbreviation.val(),
    key: registerFields.key.val(),
    description: registerFields.description.val(),
};
// Verificar si ya existe un programa con la misma clave
if (checkDuplicateKey(data.key)) {
// Mostrar el modal de error si hay una clave duplicada
    $('#errorModal').modal('show');
    return;// Detener el registro
}

// Si no hay duplicados, proceder con el registro
registerProgram(data, response => {
    count++;
    $table.bootstrapTable('insertRow', {
        index: 0,
        row: {
            count: count,
            name: response.program.name,
            abbreviation: response.program.abbreviation,
            key: response.program.key,
            description: response.program.description,
            status: createStatusBadge(response.program.status),
            actions: createActionButtons(response.program, count)
        }
    });
    // Actualizar el array
    programs.push(data);
    resetModalRegisterProgram();
}, error => {
    console.log("error", error);
});
});

function resetModalRegisterProgram() {
registerFormProgram.reset();
$('#registerModalProgram').modal('hide');
$('body').removeClass('modal-open');
$('.modal-backdrop').remove();
}

//EDITAR
// Función para manejar la edición de un programa

let rowGlobal = null;
function updateModalProgram(id, rowID) {
resetModalUpdateProgram();

rowGlobal = rowID;
setProgram(id);

$("#ProgramNameUpdate").val(program.name);
$("#ProgramDescriptionUpdate").val(program.description);
$("#ProgramAbbreviationUpdate").val(program.abbreviation);
$("#ProgramClaveUpdate").val(program.key);

var myModal = createBootstrapModal("updateModalProgram");
myModal.show();
}

const updateForm = document.getElementById("updateFormProgram");
const updateFields = {
name: $("#ProgramNameUpdate"),
description: $("#ProgramDescriptionUpdate"),
abbreviation: $("#ProgramAbbreviationUpdate"),
key: $("#ProgramClaveUpdate"),
};

// Función para verificar si ya existe un programa con la misma clave, excluyendo el programa actual
function checkDuplicateKeyOnEdit(key, currentProgramID) {
return programs.some(program => program.key === key && program.id !== currentProgramID);
}


updateForm.addEventListener("submit", (e) => { 
e.preventDefault();

const data = {
    program_id: program.id,
    data: {
        name: updateFields.name.val(),
        description: updateFields.description.val(),
        abbreviation: updateFields.abbreviation.val(),
        key: updateFields.key.val()
    }
};

console.log("Datos enviados a la API para actualizar el programa:", data);

if (checkDuplicateKeyOnEdit(data.data.key, data.program_id)) {
    $('#errorModalClave').modal('show');
    return; 
}

updateProgram(data, response => {
    $table.bootstrapTable('updateByUniqueId', {
        id: rowGlobal,
        row: {
            name: response.program.name,
            description: response.program.description,
            abbreviation: response.program.abbreviation,
            key: response.program.key,
            status: createStatusBadge(response.program.status),
            actions: createActionButtons(response.program, count)
        }
    });
    resetModalUpdateProgram();
},error =>  {
    console.log("error",error);
});
});

function resetModalUpdateProgram() {
updateForm.reset();
$('#updateModalProgram').modal('hide');
$('body').removeClass('modal-open');
$('.modal-backdrop').remove();
}

document.getElementById('refreshButton').addEventListener('click', function() {
location.reload();
});



//-------------------------Agregar Documentos.

// Función para llenar el selector de documentos y mostrar el ID del programa
function fillDocumentSelect(programId) {
    getDocuments(data => {
        const $select = $('#DocumentSelect');
        $select.empty(); // Limpiar las opciones previas

        data.forEach(document => {
            const option = `<option value="${document.id}">${document.name}</option>`;
            $select.append(option);
        });

        // Mostrar el ID del programa en el modal
        $('#selectedProgramId').text(`ID del Programa: ${programId}`);
    });
}

function openDocumentSelectModal(programName, programId) {
    $('#selectedProgramName').text(programName); // Actualizar el nombre del programa en el modal
    fillDocumentSelect(programId); // Llenar el selector de documentos y mostrar el ID del programa
    $('#selectedDocumentsList').empty(); // Limpiar la lista de documentos seleccionados al abrir el modal
    $('#selectedDocumentsContainer').hide(); // Ocultar la lista de documentos seleccionados
    $('#DocumentSelectModal').modal('show'); // Mostrar el modal
}

// Función para agregar el documento seleccionado a la lista
function addSelectedDocument() {
    const $select = $('#DocumentSelect');
    const documentId = $select.val();
    const documentName = $select.find('option:selected').text();

    // Verificar si el documento ya está en la lista
    if ($(`#selectedDocumentsList li[data-id="${documentId}"]`).length === 0) {
        // Mostrar la lista y la nota si se agrega el primer documento
        $('#selectedDocumentsContainer').show();

        // Agregar el documento a la lista de seleccionados
        const listItem = `<li class="list-group-item d-flex justify-content-between align-items-center" data-id="${documentId}">
            ${documentName}
            <div class="form-check form-switch">
                <input type="checkbox" class="form-check-input" id="mandatorySwitch${documentId}">
                <label class="form-check-label" for="mandatorySwitch${documentId}">Obligatorio</label>
            </div>
            <button type="button" class="btn btn-sm btn-danger ms-2" onclick="removeSelectedDocument(${documentId})">Eliminar</button>
        </li>`;
        $('#selectedDocumentsList').append(listItem);

        // Actualizar el texto con el número de documentos agregados
        updateDocumentCount();
    }
}

// Función para actualizar el mensaje de "Documentos Agregados" con el número total
function updateDocumentCount() {
    const documentCount = $('#selectedDocumentsList li').length;
    $('#documentCountLabel').text(`Documentos Agregados: ${documentCount}`);
}

// Función para eliminar un documento de la lista de seleccionados
function removeSelectedDocument(documentId) {
    $(`#selectedDocumentsList li[data-id="${documentId}"]`).remove();

    // Ocultar la lista y el mensaje si ya no quedan documentos seleccionados
    if ($('#selectedDocumentsList li').length === 0) {
        $('#selectedDocumentsContainer').hide();
    }

    // Actualizar el texto con el número de documentos agregados
    updateDocumentCount();
}


// Evento para agregar el documento seleccionado cada vez que cambia la selección
$('#DocumentSelect').on('change', addSelectedDocument);




//-------------------------------------


// Función para llenar el selector de Requisitos
function fillRequisitoSelect(programId2) {
    getRequisito(data => {
        const $select = $('#RequisitoSelect');
        $select.empty(); // Limpiar las opciones previas
    
        data.forEach(requirement => {
            const option = `<option value="${requirement.id}">${requirement.name}</option>`;
            $select.append(option);
        });
        // Mostrar el ID del programa en el modal
        $('#selectedProgramId2').text(`ID del Programa: ${programId2}`);
    });
}



// Función para abrir el modal con el nombre del programa seleccionado
function openRequisitoSelectModal(programName, programId2) {
    $('#selectedProgramNameReq').text(programName); // Actualizar el nombre del programa en el modal
    fillRequisitoSelect(programId2); // Llenar el selector de Requisitos
    $('#selectedRequisitoList').empty(); // Limpiar la lista de Requisitos seleccionados al abrir el modal
    $('#selectedRequisitoContainer').hide(); // Ocultar la lista de Requisitos seleccionados
    $('#RequisitoSelectModal').modal('show'); // Mostrar el modal
    }
    
    // Función para agregar el Requisito seleccionado a la lista
    function addSelectedRequisito() {
        const $select = $('#RequisitoSelect');
        const requirementId = $select.val();
        const requirementName = $select.find('option:selected').text();
    
        // Verificar si el Requisito ya está en la lista
        if ($(`#selectedRequisitoList li[data-id="${requirementId}"]`).length === 0) {
            // Mostrar la lista y la nota si se agrega el primer Requisito
            $('#selectedRequisitoContainer').show();
    
            // Agregar el Requisito a la lista de seleccionados
            const listItem = `<li class="list-group-item d-flex justify-content-between align-items-center" data-id="${requirementId}">
                ${requirementName}
                <button type="button" class="btn btn-sm btn-danger ms-2" onclick="removeSelectedRequisito(${requirementId})">Eliminar</button>
            </li>`;
            $('#selectedRequisitoList').append(listItem);
    
            // Actualizar el texto con el número de Requisitos agregados
            updateRequisitoCount();
        }
    }
    
    // Función para actualizar el mensaje de "Requisitos Agregados" con el número total
    function updateRequisitoCount() {
        const requirementCount = $('#selectedRequisitoList li').length;
        $('#RequisitoCountLabel').text(`Requisitos de Graduación Agregados: ${requirementCount}`);
    }
    
    // Función para eliminar un Requisito de la lista de seleccionados
    function removeSelectedRequisito(requirementId) {
        $(`#selectedRequisitoList li[data-id="${requirementId}"]`).remove();
    
        // Ocultar la lista y el mensaje si ya no quedan Requisitos seleccionados
        if ($('#selectedRequisitoList li').length === 0) {
            $('#selectedRequisitoContainer').hide();
        }
    
        // Actualizar el texto con el número de Requisitos agregados
        updateRequisitoCount();
    }
    
    
    // Evento para agregar el Requisito seleccionado cada vez que cambia la selección
    $('#RequisitoSelect').on('change', addSelectedRequisito);