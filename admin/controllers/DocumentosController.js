$(document).ready(function () {
    // Mostrar el modal de espera al cargar la página
    $('#loadingModal').modal('show');

    // Recupera los datos cuando la página esté lista
    getDocumentos(data => {
        documentos = data;
        fillDataTable();

        // Cerrar el modal de espera después de que los datos se hayan cargado
        setTimeout(() => {
            $('#loadingModal').modal('hide');
        }, 500);
    });
});

// Asegurarse de que la página haya cargado completamente antes de cerrar el modal
window.onload = function () {
    setTimeout(() => {
        $('#loadingModal').modal('hide');
    }, 500);
};

// Detectar navegación de regreso a la página y recargar los datos
$(window).on('pageshow', function () {
    $('#loadingModal').modal('show');
    getDocumentos(data => {
        documentos = data;
        fillDataTable();
        setTimeout(() => {
            $('#loadingModal').modal('hide');
        }, 500);
    });
});

/**
 * Función ajustar fecha y hora
 */
function formatDate(dateString) {
    const date = new Date(dateString);

    // Formatear la fecha
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('es-ES', options).format(date);

    // Formatear la hora
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const amPm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12; // Convertir a formato de 12 horas

    const formattedTime = `${hours}:${minutes} ${amPm}`;

    return `${formattedDate}, ${formattedTime}`;
}

/**
 * Rellena de información la tabla principal
 */
let dataDatable = [];
let count = 0;
const $table = $('#DocumentTabla');

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

    const editButton = `<button type="button" class="btn btn-warning" onclick="updateModalDocument(${val.id}, ${count})" data-bs-toggle="tooltip" data-bs-title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>`;

    return `<div class="btn-group btn-group-sm">${statusButton}${editButton}</div>`;
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
        // Si desactivan el checkbox, se muestran todos los documentos
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
    const filteredData = documentos.filter(documento => documento.status === status);
    fillDataTable(filteredData);
}

function fillDataTable(data = documentos) {
    $table.bootstrapTable('showLoading');
    
    // Reiniciar el contador de filas
    count = 0; 

    // Generar los datos para la tabla
    dataDatable = data.map(val => {
        count++; 
        return {
            count: count,  
            name: val.name,
            description: val.description,
            created_at: formatDate(val.created_at),
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
function setActive(documentoID, rowID) {
    setDocumento(documentoID);
    setDocumentoActive(data => {
        updateTableRow(rowID, data.document);
    });
}

// Desactivar
function setInactive(documentoID, rowID) {
    setDocumento(documentoID);
    setDocumentoInactive(data => {
        updateTableRow(rowID, data.document);
    });
}

// REGISTRAR
const registerFormDocument = document.getElementById("registerFormDocument");
const registerFields = {
    name: $("#DocumentName"),
    description: $("#DocumentDescription"),
};

// Función para verificar si ya existe un documento con el mismo nombre
function checkDuplicateName(name) {
    return documentos.some(document => document.name === name);
}

// Manejador del evento submit para registrar un documento
registerFormDocument.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
        name: registerFields.name.val(), 
        description: registerFields.description.val(),
    };

    // Verificar si ya existe un documento con el mismo nombre
    if (checkDuplicateName(data.name)) {
        $('#errorModal').modal('show');
        return;
    }

    registerDocumento(data, response => {
        count++;
        $table.bootstrapTable('insertRow', {
            index: 0,
            row: {
                count: count,
                name: response.document.name,
                description: response.document.description,
                status: createStatusBadge(response.document.status),
                actions: createActionButtons(response.document, count)
            }
        });

        documentos.push(data);
        resetModalRegisterDocument();
        showSuccessModal("Registro creado con éxito");


    }, error => {
        console.log("error", error);
    });
});

function resetModalRegisterDocument() {
    registerFormDocument.reset();
    $('#registerModalDocument').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}


// Función para mostrar el modal de éxito
function showSuccessModal(message) {
    const successModal = new bootstrap.Modal(document.getElementById('successModalDocument'));
    document.getElementById('successModalMessage').innerText = message;

    // Escuchar el evento de cierre del modal
    const modalElement = document.getElementById('successModalDocument');
    modalElement.addEventListener('hidden.bs.modal', () => {
        location.reload(); // Recargar la página al cerrar el modal
    });

    successModal.show();
}


// EDITAR

let rowGlobal = null;
function updateModalDocument(id, rowID) {
    resetModalUpdateDocumento();

    rowGlobal = rowID;
    setDocumento(id);

    $("#DocumentNameUpdate").val(documento.name);
    $("#DocumentDescriptionUpdate").val(documento.description);
        
    var myModal = createBootstrapModal("updateModalDocument");
    myModal.show();
}

const updateForm = document.getElementById("updateFormDocument");
const updateFields = {
    name: $("#DocumentNameUpdate"),
    description: $("#DocumentDescriptionUpdate")
};

// Función para verificar si ya existe un documento con el mismo nombre, excluyendo el documento actual
function checkDuplicateNameOnEdit(name, currentDocumentID) {
    return documentos.some(doc => doc.name === name && doc.id !== currentDocumentID);
}

updateForm.addEventListener("submit", (e) => { 
    e.preventDefault();

    const data = {
        document_id: documento.id, // ID actual del documento
        data: {
            name: updateFields.name.val(),
            description: updateFields.description.val(),
        }
    };

    // Verificar si ya existe un documento con el mismo nombre, excluyendo el actual
    if (checkDuplicateNameOnEdit(data.data.name, data.document_id)) {
        $('#errorModalClave').modal('show'); // Mostrar modal de error
        return; 
    }

    updateDocumento(data, response => {
        $table.bootstrapTable('updateByUniqueId', {
            id: rowGlobal,
            row: {
                name: response.document.name,
                description: response.document.description,
                status: createStatusBadge(response.document.status),
                actions: createActionButtons(response.document, count)
            }
        });
        resetModalUpdateDocumento();

         // Mostrar modal de éxito
         const successModal = new bootstrap.Modal(document.getElementById('successEditModalDocument'));
         successModal.show();
 
         // Recargar la página al cerrar el modal
         document.getElementById('successEditModalDocument').addEventListener('hidden.bs.modal', function () {
             location.reload();
         });



    }, error =>  {
        console.log("error", error);
    });
});

function resetModalUpdateDocumento() {
    updateForm.reset();
    $('#updateModalDocument').modal('hide');  // Cierra la modal
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();  // Elimina el fondo oscuro de la modal
}

// Recargar la página al hacer clic en el botón "Actualizar"
document.getElementById('refreshButton').addEventListener('click', function() {
    location.reload();
});
