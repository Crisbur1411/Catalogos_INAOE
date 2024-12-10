$(document).ready(function () {
    // Mostrar el modal de espera al cargar la página
    $('#loadingModal').modal('show');

    // Recupera los datos cuando la página esté lista
    getClassrooms(data => {
        classrooms = data;
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
    getClassrooms(data => {
        classrooms = data;
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
const $table = $('#ClassroomTabla');

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

    const editButton = `<button type="button" class="btn btn-warning" onclick="updateModalClassroom(${val.id}, ${count})" data-bs-toggle="tooltip" data-bs-title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>`;

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
        // Si desactivan el checkbox, se muestran todas las classrooms
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
    const filteredData = classrooms.filter(classroom => classroom.status === status);
    fillDataTable(filteredData);
}

function fillDataTable(data = classrooms) {
    $table.bootstrapTable('showLoading');
    
    // Reiniciar el contador de filas
    count = 0; 

    // Generar los datos para la tabla
    dataDatable = data.map(val => {
        count++; 
        return {
            count: count,  
            campus: val.campus.name, // Mostrar el nombre del campus o 'No disponible' si no existe
            name: val.name,
            size: val.size,
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
function setActive(classroomID, rowID) {
    setClassroom(classroomID);
    setClassroomActive(data => {
        updateTableRow(rowID, data.classroom);
    });
    

}

// Desactivar
function setInactive(classroomID, rowID) {
    setClassroom(classroomID);
    setClassroomInactive(data => {
        updateTableRow(rowID, data.classroom);
    });
}



// Llenar el selector de campus al abrir el modal de registrar
$('#registerModalClassroom').on('show.bs.modal', function () {
    getCampuses(function (campuses) {
        const campusSelect = $('#CampusSelect');
        campusSelect.empty(); // Limpia las opciones existentes

        // Filtrar y agregar solo los campus con estatus activo
        campuses.filter(campus => campus.status === 'active').forEach(campus => {
            campusSelect.append(`<option value="${campus.id}">${campus.name}</option>`);
        });
    }, function (error) {
        console.error("Error al obtener los campus:", error);
    });
});



// REGISTRAR
const registerFormClassroom = document.getElementById("registerFormClassroom");
const registerFields = {
    campus_id: $("#CampusSelect"),
    name: $("#ClassroomName"),
    size: $("#ClassroomCupo"),
    description: $("#ClassroomDescription"),
};


// Manejador del evento submit para registrar un classroom
registerFormClassroom.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
        campus_id: registerFields.campus_id.val(), // Toma el valor del campus seleccionado
        name: registerFields.name.val(),
        size: registerFields.size.val(),
        description: registerFields.description.val(),
    };

    registerClassroom(data, response => {
        count++;
        $table.bootstrapTable('insertRow', {
            index: 0,
            row: {
                count: count,
                campus_id: response.classroom.campus_id,
                name: response.classroom.name,
                size: response.classroom.size,
                description: response.classroom.description,
                status: createStatusBadge(response.classroom.status),
                actions: createActionButtons(response.classroom, count)
            }
        });

        classrooms.push(data);
        resetModalRegisterClassroom();
        showSuccessModal("Registro creado con éxito");


    }, error => {
        console.log("error", error);
    });
});

function resetModalRegisterClassroom() {
    registerFormClassroom.reset();
    $('#registerModalClassroom').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}


// Función para mostrar el modal de éxito
function showSuccessModal(message) {
    const successModal = new bootstrap.Modal(document.getElementById('successModalAula'));
    document.getElementById('successModalMessage').innerText = message;

    // Escuchar el evento de cierre del modal
    const modalElement = document.getElementById('successModalAula');
    modalElement.addEventListener('hidden.bs.modal', () => {
        location.reload(); // Recargar la página al cerrar el modal
    });

    successModal.show();
}


// Llenar el selector de campus al abrir el modal de editar
$('#updateModalClassroom').on('show.bs.modal', function () {
    getCampuses(function (campuses) {
        const campusSelect = $('#CampusSelectUpdate');
        campusSelect.empty(); // Limpia las opciones existentes

        // Filtrar y agregar solo los campus con estatus activo
        campuses.filter(campus => campus.status === 'active').forEach(campus => {
            // Añadir las opciones y marcar como seleccionada la opción del campus del aula
            const isSelected = campus.id === classroom.campus_id ? 'selected' : '';
            campusSelect.append(`<option value="${campus.id}" ${isSelected} ${campus.id === classroom.campus_id ? 'disabled' : ''}>${campus.name}</option>`);
        });
    }, function (error) {
        console.error("Error al obtener los campus:", error);
    });
});

// EDITAR
let rowGlobal = null;
function updateModalClassroom(id, rowID) {
    resetModalUpdateClassroom();

    rowGlobal = rowID;
    setClassroom(id);
    
    $("#ClassroomNameUpdate").val(classroom.name);
    $("#ClassroomCupoUpdate").val(classroom.size);
    $("#ClassroomDescriptionUpdate").val(classroom.description);


    var myModal = createBootstrapModal("updateModalClassroom");
    myModal.show();
}

const updateForm = document.getElementById("updateFormClassroom");
const updateFields = {
    name: $("#ClassroomNameUpdate"),
    size: $("#ClassroomCupoUpdate"),
    description: $("#ClassroomDescriptionUpdate"),
};

updateForm.addEventListener("submit", (e) => { 
    e.preventDefault();

    const data = {
        classroom_id: classroom.id,
        data: {
            name: updateFields.name.val(),
            size: updateFields.size.val(),
            description: updateFields.description.val(),
        }
    };


    updateClassroom(data, response => {
        $table.bootstrapTable('updateByUniqueId', {
            id: rowGlobal,
            row: {
                name: response.classroom.name,
                size: response.classroom.size,
                description: response.classroom.description,
                status: createStatusBadge(response.classroom.status),
                actions: createActionButtons(response.classroom, count)
            }
        });
        resetModalUpdateClassroom();

         // Mostrar modal de éxito
         const successModal = new bootstrap.Modal(document.getElementById('successEditModalAula'));
         successModal.show();
 
         // Recargar la página al cerrar el modal
         document.getElementById('successEditModalAula').addEventListener('hidden.bs.modal', function () {
             location.reload();
         });


    }, error => {
        console.log("error", error);
    });
});

function resetModalUpdateClassroom() {
    updateForm.reset();
    $('#updateModalClassroom').modal('hide');  // Cierra la modal
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();  // Elimina el fondo oscuro de la modal
}


// Recargar la página al hacer clic en el botón "Actualizar"
document.getElementById('refreshButton').addEventListener('click', function () {
    location.reload();
});



