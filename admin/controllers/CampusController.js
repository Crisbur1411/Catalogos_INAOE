$(document).ready(function () {
    // Mostrar el modal de espera al cargar la página
    $('#loadingModal').modal('show');

    // Recupera los datos cuando la página esté lista
    getCampuses(data => {
        campuses = data;
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
    getCampuses(data => {
        campuses = data;
        fillDataTable();
        setTimeout(() => {
            $('#loadingModal').modal('hide');
        }, 500);
    });
});

/**
 * Rellena de información la tabla principal
 */
let dataDatable = [];
let count = 0;
const $table = $('#CampusTabla');

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

    const editButton = `<button type="button" class="btn btn-warning" onclick="updateModalCampus(${val.id}, ${count})" data-bs-toggle="tooltip" data-bs-title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>`;

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
        // Si desactivan el checkbox, se muestran todos los campus
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
    const filteredData = campuses.filter(campus => campus.status === status);
    fillDataTable(filteredData);
}

function fillDataTable(data = campuses) {
    $table.bootstrapTable('showLoading');
    
    // Reiniciar el contador de filas
    count = 0; 

    // Generar los datos para la tabla
    dataDatable = data.map(val => {
        count++; 
        return {
            count: count,  
            key: val.key,
            name: val.name,
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
function setActive(campusID, rowID) {
    setCampus(campusID);
    setCampusActive(data => {
        updateTableRow(rowID, data.campus);
    });
}

// Desactivar
function setInactive(campusID, rowID) {
    setCampus(campusID);
    setCampusInactive(data => {
        updateTableRow(rowID, data.campus);
    });
}






// REGISTRAR
const registerFormCampus = document.getElementById("registerFormCampus");
const registerFields = {
    key: $("#CampusClave"),
    name: $("#CampusName"),
};

// Función para verificar si ya existe un campus con la misma clave
function checkDuplicateKey(key) {
    return campuses.some(campus => campus.key === key);
}

// Manejador del evento submit para registrar un campus
registerFormCampus.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
        key: registerFields.key.val().toUpperCase(), // Convertir a mayúsculas
        name: registerFields.name.val().toUpperCase(), // Convertir a mayúsculas
    };

    // Verificar si ya existe un campus con la misma clave
    if (checkDuplicateKey(data.key)) {
        $('#errorModal').modal('show');
        return;
    }

    registerCampus(data, response => {
        count++;
        $table.bootstrapTable('insertRow', {
            index: 0,
            row: {
                count: count,
                name: response.campus.name,
                key: response.campus.key,
                status: createStatusBadge(response.campus.status),
                actions: createActionButtons(response.campus, count)
            }
        });

        campuses.push(data);
        resetModalRegisterCampus();

        showSuccessModal("Registro creado con éxito");

    }, error => {
        console.log("error", error);
    });
});

function resetModalRegisterCampus() {
    registerFormCampus.reset();
    $('#registerModalCampus').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}



// Función para mostrar el modal de éxito
function showSuccessModal(message) {
    const successModal = new bootstrap.Modal(document.getElementById('successModalCampus'));
    document.getElementById('successModalMessage').innerText = message;

    // Escuchar el evento de cierre del modal
    const modalElement = document.getElementById('successModalCampus');
    modalElement.addEventListener('hidden.bs.modal', () => {
        location.reload(); // Recargar la página al cerrar el modal
    });

    successModal.show();
}


// EDITAR

let rowGlobal = null;
function updateModalCampus(id, rowID) {
    resetModalUpdateCampus();

    rowGlobal = rowID;
    setCampus(id);

    $("#CampusNameUpdate").val(campus.name);
    $("#CampusClaveUpdate").val(campus.key);

    var myModal = createBootstrapModal("updateModalCampus");
    myModal.show();
}

const updateForm = document.getElementById("updateFormCampus");
const updateFields = {
    name: $("#CampusNameUpdate"),
    key: $("#CampusClaveUpdate"),
};

// Función para verificar si ya existe un campus con la misma clave, excluyendo el campus actual
function checkDuplicateKeyOnEdit(key, currentCampusID) {
    return campuses.some(campus => campus.key === key && campus.id !== currentCampusID);
}
updateForm.addEventListener("submit", (e) => { 
    e.preventDefault();

    const data = {
        campus_id: campus.id,
        data: {
            name: updateFields.name.val(),
            key: updateFields.key.val(),
        }
    };

    if (checkDuplicateKeyOnEdit(data.data.key, data.campus_id)) {
        $('#errorModalClave').modal('show');
        return; 
    }

    updateCampus(data, response => {
        $table.bootstrapTable('updateByUniqueId', {
            id: rowGlobal,
            row: {
                name: response.campus.name,
                key: response.campus.key,
                status: createStatusBadge(response.campus.status),
                actions: createActionButtons(response.campus, count)
            }
        });
        resetModalUpdateCampus();

                // Mostrar modal de éxito
                const successModal = new bootstrap.Modal(document.getElementById('successEditModalCampus'));
                successModal.show();
        
                // Recargar la página al cerrar el modal
                document.getElementById('successEditModalCampus').addEventListener('hidden.bs.modal', function () {
                    location.reload();
                });

    },error =>  {
        console.log("error",error);
    });
});


function resetModalUpdateCampus() {
    updateForm.reset();
    $('#updateModalCampus').modal('hide');  // Cierra la modal
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();  // Elimina el fondo oscuro de la modal
}


// Recargar la página al hacer clic en el botón "Actualizar"
document.getElementById('refreshButton').addEventListener('click', function() {
    location.reload();
});
