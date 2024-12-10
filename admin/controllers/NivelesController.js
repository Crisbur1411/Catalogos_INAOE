$(document).ready(function () {
    // Mostrar el modal de espera al cargar la página
    $('#loadingModal').modal('show');

    // Recupera los datos cuando la página esté lista
    getLevels(data => {
        levels = data;
        fillDataTable();

        // Cerrar el modal de espera después de que los datos se hayan cargado
        setTimeout(() => {
            $('#loadingModal').modal('hide');
        }, 500); // Retraso de 500ms
    });
});

// Usar window.onload para asegurar que la página completa haya cargado
window.onload = function () {
    setTimeout(() => {
        $('#loadingModal').modal('hide');
    }, 500); // Retraso de 500ms
};

// Detectar navegación de regreso a la página y recargar los datos
$(window).on('pageshow', function () {
    $('#loadingModal').modal('show');

    // Volver a cargar los niveles y cerrar el modal
    getLevels(data => {
        levels = data;
        fillDataTable();

        setTimeout(() => {
            $('#loadingModal').modal('hide');
        }, 500); // Añadimos un pequeño retraso de 500ms
    });
});


/**
 * Rellena de información la tabla principal
 */
let dataDatable = [];
let count = 0;
const $table = $('#NivelesTabla');

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

    const editButton = `<button type="button" class="btn btn-warning" onclick="updateModalNivel(${val.id}, ${count})" data-bs-toggle="tooltip" data-bs-title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>`;

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
        // Si desactivan el checkbox, se muestran todos los niveles
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
    const filteredData = levels.filter(level => level.status === status);
    fillDataTable(filteredData);
}

function fillDataTable(data = levels) {
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
            order: val.order,
            type: val.type,
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
function setActive(levelID, rowID) {
    setLevel(levelID);
    setLevelActive(data => {
        updateTableRow(rowID, data.level);
    });
}

// Desactivar
function setInactive(levelID, rowID) {
    setLevel(levelID);
    setLevelInactive(data => {
        updateTableRow(rowID, data.level);
    });
}

// REGISTRAR
const registerFormNivel = document.getElementById("registerFormNivel");
const registerFields = {
    key: $("#NivelClave"),
    name: $("#NivelName"),
    order: $("#NivelOrdenamiento"),
    type: $("#NivelTipo")
};

// Función para verificar si ya existe un nivel con la misma clave
function checkDuplicateKey(key) {
    return levels.some(level => level.key === key);
}

// Manejador del evento submit para registrar un nivel
registerFormNivel.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
        key: registerFields.key.val(),
        name: registerFields.name.val(),
        order: registerFields.order.val(),
        type: registerFields.type.val() // Aquí se toma el valor seleccionado
    };

    // Verificar si ya existe un nivel con la misma clave
    if (checkDuplicateKey(data.key)) {
        // Mostrar el modal de error si hay una clave duplicada
        $('#errorModal').modal('show');
        return; // Detener el registro
    }

    // Si no hay duplicados, proceder con el registro
    registerLevel(data, response => {
        count++;
        $table.bootstrapTable('insertRow', {
            index: 0,
            row: {
                count: count,
                name: response.shift.name,
                key: response.shift.key,
                order: response.shift.order,
                type: response.shift.type, 
                status: createStatusBadge(response.shift.status),
                actions: createActionButtons(response.shift, count)
            }
        });

        // Actualizar el array de levels
        levels.push(data);
        resetModalRegisterNivel();

        showSuccessModal("Registro creado con éxito");

    }, error => {
        console.log("error", error);
    });
});


function resetModalRegisterNivel() {
    registerFormNivel.reset();
    $('#registerModalNivel').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}


// Función para mostrar el modal de éxito
function showSuccessModal(message) {
    const successModal = new bootstrap.Modal(document.getElementById('successModalNivel'));
    document.getElementById('successModalMessage').innerText = message;

    // Escuchar el evento de cierre del modal
    const modalElement = document.getElementById('successModalNivel');
    modalElement.addEventListener('hidden.bs.modal', () => {
        location.reload(); // Recargar la página al cerrar el modal
    });

    successModal.show();
}

//EDITAR

// Función para manejar la edición de un nivel
let rowGlobal = null;
function updateModalNivel(id, rowID) {
    resetModalUpdateNivel();

    rowGlobal = rowID;
    setLevel(id);

    $("#NivelNameUpdate").val(level.name);
    $("#NivelClaveUpdate").val(level.key);
    $("#NivelOrdenamientoUpdate").val(level.order);
    $("#NivelTipoUpdate").val(level.type);

    var myModal = createBootstrapModal("updateModalNivel");
    myModal.show();
}

const updateForm = document.getElementById("updateFormNivel");
const updateFields = {
    name: $("#NivelNameUpdate"),
    key: $("#NivelClaveUpdate"),
    order: $("#NivelOrdenamientoUpdate"),
    type: $("#NivelTipoUpdate")
};

// Función para verificar si ya existe un nivel con la misma clave, excluyendo el nivel actual
function checkDuplicateKeyOnEdit(key, currentLevelID) {
    return levels.some(level => level.key === key && level.id !== currentLevelID);
}

// Función para verificar duplicados de order y type, excluyendo el nivel actual
function checkDuplicateOrderTypeOnEdit(order, type, currentLevelID) {
    return levels.some(level => 
        (level.order === order && level.type === type) && 
        level.id !== currentLevelID
    );
}

updateForm.addEventListener("submit", (e) => { 
    e.preventDefault();

    const data = {
        level_id: level.id,
        data: {
            name: updateFields.name.val(),
            key: updateFields.key.val(),
            order: updateFields.order.val(),
            type: updateFields.type.val()
        }
    };

    console.log("Datos enviados a la API para actualizar el nivel:", data);

    // Verificar si ya existe un nivel con el mismo order y type, excluyendo el nivel actual
    if (checkDuplicateOrderTypeOnEdit(data.data.order, data.data.type, data.level_id)) {
        $('#errorModalOrderType').modal('show');
        return; 
    }

    if (checkDuplicateKeyOnEdit(data.data.key, data.level_id)) {
        $('#errorModalClave').modal('show');
        return; 
    }

    updateLevel(data, response => {
        $table.bootstrapTable('updateByUniqueId', {
            id: rowGlobal,
            row: {
                name: response.level.name,
                key: response.level.key,
                order: response.level.order,
                type: response.level.type,
                status: createStatusBadge(response.level.status),
                actions: createActionButtons(response.level, count)
            }
        });
        resetModalUpdateNivel();
        // Mostrar modal de éxito
        const successModal = new bootstrap.Modal(document.getElementById('successEditModalNivel'));
        successModal.show();

        // Recargar la página al cerrar el modal
        document.getElementById('successEditModalNivel').addEventListener('hidden.bs.modal', function () {
            location.reload();
        });
    
    }, error => {
        console.error("Error al actualizar el nivel:", error.responseJSON);
        
        // Muestra la modal con el mensaje de error detallado
        const errorMessage = error.responseJSON?.errors?.[0]?.[0] || "Hubo un error al actualizar el nivel. Verifique los datos e intente de nuevo.";
        document.getElementById("updateErrorMessage").innerText = errorMessage;
        $('#updateErrorModal').modal('show');
    });
});


function resetModalUpdateNivel() {
    updateForm.reset();
    $('#updateModalNivel').modal('hide');  // Cierra la modal
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();  // Elimina el fondo oscuro de la modal
}


// Recargar la página al hacer clic en el botón "Actualizar"
document.getElementById('refreshButton').addEventListener('click', function() {
    location.reload();
});




