$(document).ready(function () {
    // Mostrar el modal de espera al cargar la página
    $('#loadingModal').modal('show');

    // Recupera los datos cuando la página esté lista
    getCatCourses(data => {
        cat_courses = data;
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
    getCatCourses(data => {
        cat_courses = data;
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
const $table = $('#CatCourseTabla');

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

    const editButton = `<button type="button" class="btn btn-warning" onclick="updateModalCatCourse(${val.id}, ${count})" data-bs-toggle="tooltip" data-bs-title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>`;

    return `<div class="btn-group btn-group-sm">${statusButton}${editButton}</div>`;
}

function createStatusButton(type, id, count, tooltip, icon) {
    return `<button type="button" class="btn btn-${type}" onclick="${type === 'success' ? 'setActive' : 'setInactive'}(${id}, ${count})" data-bs-toggle="tooltip" data-bs-title="${tooltip}"><i class="fa-solid ${icon}"></i></button>`;
}

// Mostrar/ocultar el filtro de estatus según el checkbox
$('#filterCheckbox').on('change', function () {
    if ($(this).is(':checked')) {
        $('#statusFilterContainer').show();

        const $statusFilter = $('#statusFilter');
        $statusFilter.prop('selectedIndex', 0);
        const selectedStatus = $statusFilter.val();
        filterTableByStatus(selectedStatus);
    } else {
        $('#statusFilterContainer').hide();
        fillDataTable();
    }
});

// Filtrar datos cuando se cambia el select de estatus
$('#statusFilter').on('change', function () {
    const selectedStatus = $(this).val();
    filterTableByStatus(selectedStatus);
});

function filterTableByStatus(status) {
    const filteredData = cat_courses.filter(course => course.status === status);
    fillDataTable(filteredData);
}

function fillDataTable(data = cat_courses) {
    $table.bootstrapTable('showLoading');

    count = 0;

    dataDatable = data.map(val => {
        count++;
        return {
            count: count,
            name: val.name,
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
function setActive(catCourseID, rowID) {
    setCatCourse(catCourseID);
    setCatCourseActive(data => {
        updateTableRow(rowID, data.course);
    });
}

// Desactivar
function setInactive(catCourseID, rowID) {
    setCatCourse(catCourseID);
    setCatCourseInactive(data => {
        updateTableRow(rowID, data.course);
    });
}

// REGISTRAR
const registerFormCatCourse = document.getElementById("registerFormCatCourse");
const registerFields = {
    name: $("#CatCourseName"),
    description: $("#CatCourseDescription"),
};


registerFormCatCourse.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
        name: registerFields.name.val(),
        description: registerFields.description.val(),
    };

    registerCatCourse(data, response => {
        count++;
        $table.bootstrapTable('insertRow', {
            index: 0,
            row: {
                count: count,
                name: response.course.name,
                description: response.course.description,
                status: createStatusBadge(response.course.status),
                actions: createActionButtons(response.course, count)
            }
        });

        cat_courses.push(data);
        resetModalRegisterCatCourse();

        showSuccessModal("Registro creado con éxito");

    }, error => {
        console.log("error", error);
    });
});

function resetModalRegisterCatCourse() {
    registerFormCatCourse.reset();
    $('#registerModalCatCourse').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}

// Función para mostrar el modal de éxito
function showSuccessModal(message) {
    const successModal = new bootstrap.Modal(document.getElementById('successModalCatCourse'));
    document.getElementById('successModalMessage').innerText = message;

    // Escuchar el evento de cierre del modal
    const modalElement = document.getElementById('successModalCatCourse');
    modalElement.addEventListener('hidden.bs.modal', () => {
        location.reload(); // Recargar la página al cerrar el modal
    });

    successModal.show();
}


// EDITAR
let rowGlobal = null;
function updateModalCatCourse(id, rowID) {
    resetModalUpdateCatCourse();

    rowGlobal = rowID;
    setCatCourse(id);

    $("#CatCourseNameUpdate").val(cat_course.name);
    $("#CatCourseDescriptionUpdate").val(cat_course.description);

    var myModal = createBootstrapModal("updateModalCatCourse");
    myModal.show();
}

const updateForm = document.getElementById("updateFormCatCourse");
const updateFields = {
    name: $("#CatCourseNameUpdate"),
    description: $("#CatCourseDescriptionUpdate"),
};


updateForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
        cat_course_id: cat_course.id,
        data: {
            name: updateFields.name.val(),
            description: updateFields.description.val(),
        }
    };

    updateCatCourse(data, response => {
        $table.bootstrapTable('updateByUniqueId', {
            id: rowGlobal,
            row: {
                name: response.course.name,
                description: response.course.description,
                status: createStatusBadge(response.course.status),
                actions: createActionButtons(response.course, count)
            }
        });

        resetModalUpdateCatCourse();

        // Mostrar modal de éxito
        const successModal = new bootstrap.Modal(document.getElementById('successEditModalCatCourse'));
        successModal.show();

        // Recargar la página al cerrar el modal
        document.getElementById('successEditModalCatCourse').addEventListener('hidden.bs.modal', function () {
            location.reload();
        });

    }, error => {
        console.log("error", error);
    });
});


function resetModalUpdateCatCourse() {
    updateForm.reset();
    $('#updateModalCatCourse').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}

// Recargar la página al hacer clic en el botón "Actualizar"
document.getElementById('refreshButton').addEventListener('click', function () {
    location.reload();
});
