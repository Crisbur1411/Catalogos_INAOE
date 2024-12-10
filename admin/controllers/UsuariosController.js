$(document).ready(function () {
    // Mostrar el modal de espera al cargar la página
    $('#loadingModal').modal('show');

    // Recupera los datos iniciales
    getUsers(data => {
        users = data;
        fillDataTable();

        // Cerrar el modal de espera después de que los datos se hayan cargado
        setTimeout(() => {
            $('#loadingModal').modal('hide');
        }, 500);
    });

    // Actualiza la tabla automáticamente al cambiar la opción del selector de roles
    $('#roleSelector').on('change', function () {
        // Mostrar modal de espera
        $('#loadingModal').modal('show');

        // Recuperar datos para el tipo de usuario seleccionado
        getUsers(data => {
            users = data;
            fillDataTable();

            // Cerrar modal de espera
            setTimeout(() => {
                $('#loadingModal').modal('hide');
            }, 500);
        }, error => {
            console.error("Error al obtener usuarios:", error);
            // Cerrar modal de espera si hay error
            $('#loadingModal').modal('hide');
        });
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
    getUsers(data => {
        users = data;
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
const $table = $('#UserTabla');

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

    return `<div class="btn-group btn-group-sm">${statusButton}</div>`;
}

function createStatusButton(type, id, count, tooltip, icon) {
    return `<button type="button" class="btn btn-${type}" onclick="${type === 'success' ? 'setActive' : 'setInactive'}(${id}, ${count})" data-bs-toggle="tooltip" data-bs-title="${tooltip}"><i class="fa-solid ${icon}"></i></button>`;
}



// Mostrar/ocultar el filtro de estatus según el checkbox
$('#filterCheckbox').on('change', function () {
    if ($(this).is(':checked')) {
        $('#statusFilterContainer').show();
    } else {
        $('#statusFilterContainer').hide();
        fillDataTable(); // Mostrar todos los usuarios si se desactiva el checkbox
    }
});

// Monitorear cambios en el switch de estatus
$('#statusSwitch').on('change', function () {
    const isSwitchActive = $(this).is(':checked');

    if (isSwitchActive) {
        const $statusFilter = $('#statusFilter');
        $statusFilter.prop('selectedIndex', 0); // Selecciona la primera opción
        const selectedStatus = $statusFilter.val();
        applyFilters(selectedStatus, getLastNameQuery()); // Aplica filtros combinados
    } else {
        fillDataTable(); // Mostrar todos los usuarios si el switch se desactiva
    }
});

// Filtrar datos cuando se cambia el select de estatus
$('#statusFilter').on('change', function () {
    const selectedStatus = $(this).val();
    applyFilters(selectedStatus, getLastNameQuery());
});

// Filtrar por apellidos al escribir
$('input[type="text"]').on('input', function () {
    const lastNameQuery = $(this).val().toLowerCase().trim();
    applyFilters(getSelectedStatus(), lastNameQuery);
});

// Obtener el estatus seleccionado
function getSelectedStatus() {
    return $('#filterCheckbox').is(':checked') ? $('#statusFilter').val() : null;
}

// Obtener la consulta de apellidos
function getLastNameQuery() {
    return $('input[type="text"]').val().toLowerCase().trim();
}

// Aplicar filtros combinados
function applyFilters(status, lastName) {
    let filteredData = users;

    // Verificar si el switch de estatus está activo antes de aplicar el filtro
    const isStatusSwitchActive = $('#statusSwitch').is(':checked');

    if (isStatusSwitchActive && status) {
        filteredData = filteredData.filter(user => user.status === status);
    }

    if (lastName) {
        filteredData = filteredData.filter(user => 
            user.last_name && user.last_name.toLowerCase().includes(lastName)
        );
    }

    fillDataTable(filteredData);
}

// Monitorear cambios en el switch de estatus y en el select
$('#statusSwitch, #statusFilter').on('change', function () {
    const isStatusSwitchActive = $('#statusSwitch').is(':checked');
    const selectedStatus = isStatusSwitchActive ? $('#statusFilter').val() : null; // Solo aplica si el switch está activo
    const lastName = $('#lastNameInput').val().trim().toLowerCase();
    applyFilters(selectedStatus, lastName);
});

// Monitorear cambios en el campo de apellidos
$('#lastNameInput').on('input', function () {
    const lastName = $(this).val().trim().toLowerCase();
    const isStatusSwitchActive = $('#statusSwitch').is(':checked');
    const selectedStatus = isStatusSwitchActive ? $('#statusFilter').val() : null; // Solo aplica si el switch está activo
    applyFilters(selectedStatus, lastName);
});





function fillDataTable(data = users) {
    $table.bootstrapTable('showLoading');
    
    // Reiniciar el contador de filas
    count = 0; 

    // Generar los datos para la tabla
    dataDatable = data.map(val => {
        count++; 
        return {
            count: count,  
            name: val.name,
            last_name: val.last_name,
            email: val.email,
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
function setActive(userID, rowID) {
    setUser(userID);
    setUserActive(data => {
        updateTableRow(rowID, data.user);
    });
}

// Desactivar
function setInactive(userID, rowID) {
    setUser(userID);
    setUserInactive(data => {
        updateTableRow(rowID, data.user);
    });
}

// REGISTRAR
const registerFormUser = document.getElementById("registerFormUser");
const registerFields = {
    name: $("#UserName"),
    last_name: $("#UserLastName"),
    email: $("#UserEmail"),
    password: $("#UserPassword")
};

function checkDuplicateEmail(email) {
    return users.some(user => user.email === email);
}

registerFormUser.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
        name: registerFields.name.val(),
        last_name: registerFields.last_name.val(),
        email: registerFields.email.val(),
        password: registerFields.password.val(),

    };

    if (checkDuplicateEmail(data.key)) {
        $('#errorModal').modal('show');
        return;
    }

    registerUser(data, response => {
        count++;
        $table.bootstrapTable('insertRow', {
            index: 0,
            row: {
                count: count,
                name: response.user.name,
                last_name: response.user.last_name,
                email: response.user.email,
                password: response.user.password,
                status: createStatusBadge(response.user.status),
                actions: createActionButtons(response.user, count)
            }
        });

        users.push(data);
        resetModalRegisterUser();

        showSuccessModal("Registro creado con éxito");

    }, error => {
        console.log("error", error);
    });
});

function resetModalRegisterUser() {
    registerFormUser.reset();
    $('#registerModalUser').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}


// Función para mostrar el modal de éxito
function showSuccessModal(message) {
    const successModal = new bootstrap.Modal(document.getElementById('successModalUser'));
    document.getElementById('successModalMessage').innerText = message;

    // Escuchar el evento de cierre del modal
    const modalElement = document.getElementById('successModalUser');
    modalElement.addEventListener('hidden.bs.modal', () => {
        location.reload(); // Recargar la página al cerrar el modal
    });

    successModal.show();
}


document.getElementById('refreshButton').addEventListener('click', function () {
    location.reload();
});
