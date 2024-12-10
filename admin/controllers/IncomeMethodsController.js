$(function () {
    /**
     * Recupera datos y rellena la tabla con información.
     */
    getIncomeMethods(data => {
        methods = data;
        fillDataTable();
    });
});

/**
 * Rellena de información la tabla principal
 */
let dataDatable = [];
let count = 0;
const $table = $('#mainTable');

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

    const editButton = `<button type="button" class="btn btn-warning" onclick="updateModal(${val.id}, ${count})" data-bs-toggle="tooltip" data-bs-title="Editar"><i class="fa-solid fa-pen-to-square"></i></button>`;

    return `<div class="btn-group btn-group-sm">${statusButton}${editButton}</div>`;
}

function createStatusButton(type, id, count, tooltip, icon) {
    return `<button type="button" class="btn btn-${type}" onclick="${type === 'success' ? 'setActive' : 'setInactive'}(${id}, ${count})" data-bs-toggle="tooltip" data-bs-title="${tooltip}"><i class="fa-solid ${icon}"></i></button>`;
}

function fillDataTable() {
    $table.bootstrapTable('showLoading');
    dataDatable = methods.map(val => {
        count++;
        return {
            count: count,
            name: val.name,
            description: val.description,
            createdAt: val.created_at,
            status: createStatusBadge(val.status),
            actions: createActionButtons(val, count)
        };
    });

    $table.bootstrapTable('load', dataDatable);
    $table.bootstrapTable('hideLoading');

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
}

// Función auxiliar para actualizar el estado y las acciones ----------------------->
function updateTableRow(rowID, data) {
    $table.bootstrapTable('updateByUniqueId', {
        id: rowID,
        row: {
            status: createStatusBadge(data.status),
            actions: createActionButtons(data, rowID)
        }
    });
}

// Activar ----------------------->
function setActive(methodID, rowID) {
    setIncomeMethod(methodID);
    setIncomeMethodActive(data => {
        updateTableRow(rowID, data.method);
    })
}

// Desactivar ----------------------->
function setInactive(methodID, rowID) {
    setIncomeMethod(methodID);
    setIncomeMethodInactive(data => {
        updateTableRow(rowID, data.method);
    })
}

// REGISTRAR ------------------------->
const registerForm = document.getElementById("registerForm");
const registerFields = {
    name: $("#methodName"),
    description: $("#methodDescription")
};

// Manejador del evento submit
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
        name:registerFields.name.val(),
        description: registerFields.description.val(),
    }

    registerIncomeMethod(data, response => {

        count++;
        $table.bootstrapTable('insertRow', {
            index: 0,
            row: {
                count: count,
                name: response.income_methods.name,
                description: response.income_methods.description,
                status: createStatusBadge(response.income_methods.status),
                actions: createActionButtons(response.income_methods, count)
            }
        });

        //Se tiene que actualizar el array de routes
        methods.push(data);
        resetModalRegister();
    },error =>  {
        console.log("error",error);
    });
});

function resetModalRegister() {
    registerForm.reset();
    $('#registerModal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}


// EDITAR METODO ------------------------->
let rowGlobal = null;
function updateModal(id, rowID) {

    resetModalUpdate();

    rowGlobal = rowID;
    setIncomeMethod(id);

    $("#methodNameUpdate").val(method.name);
    $("#methodDescriptionUpdate").val(method.description);

    var myModal = createBootstrapModal("updateModal");
    myModal.show();
}

const updateForm = document.getElementById("updateForm");
const updateFields = {
    name: $("#methodNameUpdate"),
    description: $("#methodDescriptionUpdate")
};

// Manejador del evento submit
updateForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
        method_id : method.id,
        data : {
            name:updateFields.name.val(),
            description: updateFields.description.val()
        }
    }

    updateIncomeMethod(data, response => {

        $table.bootstrapTable('updateByUniqueId', {
            id: rowGlobal,
            row: {
                name: response.method.name,
                description: response.method.description,
                status: createStatusBadge(response.method.status),
                actions: createActionButtons(response.method, count)
            }
        });

    },error =>  {
        console.log("error",error);
    });
});

function resetModalUpdate() {
    updateForm.reset();
    $('#updateModal').modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
}
