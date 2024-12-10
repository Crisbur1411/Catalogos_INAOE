$(document).ready(function () {
    // Mostrar el modal de espera al cargar la página
    $('#loadingModal').modal('show');

    // Recupera los datos cuando la página esté lista
    getCourses(data => {
        courses = data;
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
    getCourses(data => {
        courses = data;
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
const $table = $('#CourseTabla');

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

    const editButton = `<button type="button" class="btn btn-warning" onclick="updateModalCourse(${val.id}, ${count})" data-bs-toggle="tooltip" data-bs-title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>`;

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
        // Si desactivan el checkbox, se muestran todos los courses
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
    const filteredData = courses.filter(course => course.status === status);
    fillDataTable(filteredData);
}

function fillDataTable(data = courses) {
    $table.bootstrapTable('showLoading');
    
    // Reiniciar el contador de filas
    count = 0; 

    // Generar los datos para la tabla
    dataDatable = data.map(val => {
        count++; 
        return {
            count: count,  
            cataloge: val.cataloge.name, 
            type: val.type,
            schedule: val.schedule, 
            professor: val.professor.name, 
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
function setActive(courseID, rowID) {
    setCourse(courseID);
    setCourseActive(data => {
        updateTableRow(rowID, data.course);
    });
}

// Desactivar
function setInactive(courseID, rowID) {
    setCourse(courseID);
    setCourseInactive(data => {
        updateTableRow(rowID, data.course);
    });
}

// Llenar el selector de campus al abrir el modal de registrar
$('#registerModalCourse').on('show.bs.modal', function () {
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
const registerFormCourse = document.getElementById("registerFormCourse");
const registerFields = {
    campus_id: $("#CampusSelect"),
    name: $("#CourseName"),
    size: $("#CourseCupo"),
    description: $("#CourseDescription"),
};

// Manejador del evento submit para registrar un course
registerFormCourse.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
        campus_id: registerFields.campus_id.val(), // Toma el valor del campus seleccionado
        name: registerFields.name.val(),
        size: registerFields.size.val(),
        description: registerFields.description.val(),
    };

    registerCourse(data, response => {
        count++;
        $table.bootstrapTable('insertRow', {
            index: 0,
            row: {
                count: count,
                campus_id: response.course.campus_id,
                name: response.course.name,
                size: response.course.size,
                description: response.course.description,
                status: createStatusBadge(response.course.status),
                actions: createActionButtons(response.course, count)
            }
        });

        courses.push(data);
        resetModalRegisterCourse();
        showSuccessModal("Registro creado con éxito");
    }, error => {
        console.log("error", error);
    });
});

function resetModalRegisterCourse() {
    registerFormCourse.reset();
    $('#registerModalCourse').modal('hide');
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
$('#updateModalCourse').on('show.bs.modal', function () {
    getCampuses(function (campuses) {
        const campusSelect = $('#CampusSelectUpdate');
        campusSelect.empty(); // Limpia las opciones existentes

        // Filtrar y agregar solo los campus con estatus activo
        campuses.filter(campus => campus.status === 'active').forEach(campus => {
            const isSelected = campus.id === course.campus_id ? 'selected' : '';
            campusSelect.append(`<option value="${campus.id}" ${isSelected} ${campus.id === course.campus_id ? 'disabled' : ''}>${campus.name}</option>`);
        });
    }, function (error) {
        console.error("Error al obtener los campus:", error);
    });
});

// EDITAR
let rowGlobal = null;
function updateModalCourse(id, rowID) {
    resetModalUpdateCourse();

    rowGlobal = rowID;
    setCourse(id);
    
    $("#CourseNameUpdate").val(course.name);
    $("#CourseCupoUpdate").val(course.size);
    $("#CourseDescriptionUpdate").val(course.description);

    var myModal = createBootstrapModal("updateModalCourse");
    myModal.show();
}

const updateForm = document.getElementById("updateFormCourse");
updateForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
        name: $("#CourseNameUpdate").val(),
        size: $("#CourseCupoUpdate").val(),
        description: $("#CourseDescriptionUpdate").val(),
    };

    updateCourse(data, response => {
        console.log("response de update", response);

        // Actualiza los datos en la tabla
        updateTableRow(rowGlobal, response.course);
        showSuccessModal("Registro actualizado con éxito");

    }, error => {
        console.log("error", error);
    });
});

function resetModalUpdateCourse() {
    updateForm.reset();
    $('#updateModalCourse').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}
