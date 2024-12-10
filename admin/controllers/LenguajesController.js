$(document).ready(function () {
    // Mostrar el modal de espera al cargar la página
    $('#loadingModal').modal('show');

    // Recupera los datos cuando la página esté lista
    getLanguages(data => {
        languages = data;
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
    getLanguages(data => {
        languages = data;
        fillDataTable();
        setTimeout(() => {
            $('#loadingModal').modal('hide');
        }, 500);
    });
});

/**
 * Función ajustar fecha
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Intl.DateTimeFormat('es-ES', options).format(date);
}

/**
 * Rellena de información la tabla principal
 */
let dataDatable = [];
let count = 0;
const $table = $('#LanguageTabla');

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

    const editButton = `<button type="button" class="btn btn-warning" onclick="updateModalLanguage(${val.id}, ${count})" data-bs-toggle="tooltip" data-bs-title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>`;

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
        // Si desactivan el checkbox, se muestran todos los languages
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
    const filteredData = languages.filter(language => language.status === status);
    fillDataTable(filteredData);
}

function fillDataTable(data = languages) {
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
            created_at: formatDate(val.created_at), // Formatear la fecha aquí
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
function setActive(languageID, rowID) {
    setLanguage(languageID);
    setLanguageActive(data => {
        updateTableRow(rowID, data.language);
    });
}

// Desactivar
function setInactive(languageID, rowID) {
    setLanguage(languageID);
    setLanguageInactive(data => {
        updateTableRow(rowID, data.language);
    });
}

// REGISTRAR
const registerFormLanguage = document.getElementById("registerFormLanguage");
const registerFields = {
    abbreviation: $("#LanguageAbbreviation"),
    name: $("#LanguageName"),
};

// Función para verificar si ya existe un language con la misma clave
function checkDuplicateKey(key) {
    return languages.some(language => language.key === key);
}

// Manejador del evento submit para registrar un language
registerFormLanguage.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
        name: registerFields.name.val(),
        abbreviation: registerFields.abbreviation.val(),
    };


    registerLanguage(data, response => {
        count++;
        $table.bootstrapTable('insertRow', {
            index: 0,
            row: {
                count: count,
                name: response.language.name,
                abbreviation: response.language.abbreviation,
                status: createStatusBadge(response.language.status),
                actions: createActionButtons(response.language, count)
            }
        });

        languages.push(data);
        resetModalRegisterLanguage();
        showSuccessModal("Registro creado con éxito");


    }, error => {
        console.log("error", error);
    });
});

function resetModalRegisterLanguage() {
    registerFormLanguage.reset();
    $('#registerModalLanguage').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}



// Función para mostrar el modal de éxito
function showSuccessModal(message) {
    const successModal = new bootstrap.Modal(document.getElementById('successModalLenguaje'));
    document.getElementById('successModalMessage').innerText = message;

    // Escuchar el evento de cierre del modal
    const modalElement = document.getElementById('successModalLenguaje');
    modalElement.addEventListener('hidden.bs.modal', () => {
        location.reload(); // Recargar la página al cerrar el modal
    });

    successModal.show();
}



// EDITAR
let rowGlobal = null;
function updateModalLanguage(id, rowID) {
    resetModalUpdateLanguage();

    rowGlobal = rowID;
    setLanguage(id);

    $("#LanguageNameUpdate").val(language.name);
    $("#LanguageAbbreviationUpdate").val(language.abbreviation);

    var myModal = createBootstrapModal("updateModalLanguage");
    myModal.show();
}

const updateForm = document.getElementById("updateFormLanguage");
const updateFields = {
    name: $("#LanguageNameUpdate"),
    abbreviation: $("#LanguageAbbreviationUpdate"),
};

updateForm.addEventListener("submit", (e) => { 
    e.preventDefault();

    const data = {
        language_id: language.id,
        data: {
            name: updateFields.name.val(),
            abbreviation: updateFields.abbreviation.val(),
        }
    };

    updateLanguage(data, response => {
        $table.bootstrapTable('updateByUniqueId', {
            id: rowGlobal,
            row: {
                name: response.language.name,
                abbreviation: response.language.abbreviation,
                status: createStatusBadge(response.language.status),
                actions: createActionButtons(response.language, count)
            }
        });
        resetModalUpdateLanguage();

         // Mostrar modal de éxito
         const successModal = new bootstrap.Modal(document.getElementById('successEditModalLenguaje'));
         successModal.show();
 
         // Recargar la página al cerrar el modal
         document.getElementById('successEditModalLenguaje').addEventListener('hidden.bs.modal', function () {
             location.reload();
         });

        
    },error =>  {
        console.log("error",error);
    });
});

function resetModalUpdateLanguage() {
    updateForm.reset();
    $('#updateModalLanguage').modal('hide');  // Cierra la modal
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();  // Elimina el fondo oscuro de la modal
}

// Recargar la página al hacer clic en el botón "Actualizar"
document.getElementById('refreshButton').addEventListener('click', function() {
    location.reload();
});
