<!doctype html>
<html lang="es-MX">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Residentes Programas</title>
    <link rel="stylesheet" href="../vendor/boostrap/bootstrap.min.css">

    <!-- Icons -->
    <script src="https://kit.fontawesome.com/1e996f8cdc.js" crossorigin="anonymous"></script>

    <!-- BS Tables -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-table@1.23.5/dist/bootstrap-table.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.1/font/bootstrap-icons.min.css">

    <style>
        body {
            padding-top: 65px;
        }

    </style>

</head>

<body>

    <?php include_once 'navigation.html' ?>

    <main>
    <div class="container-fluid">
        <div class="row">
            <div class="col">
            <div class="btn-group float-end">
                    <button class="btn btn-sm btn-success" type="button" data-bs-toggle="modal" data-bs-target="#registerModalProgram"><i class="fa-solid fa-plus"></i> Nuevo Programa</button>
                </div>
                <h5>Programas/List</h5>
                
                <hr>
            </div>
        </div>

        <div class="row">
    <div class="col">
        <div class="d-flex align-items-center mb-2">
            <div class="form-check me-auto">
                <input type="checkbox" class="form-check-input" id="filterCheckbox">
                <label for="filterCheckbox" class="form-check-label"> Activar Filtro </label>
            </div>
            <button class="btn btn-sm btn-success" type="button" id="refreshButton">Actualizar</button>
        </div>
        <div class="col-lg-3 col-md-6 mt-3 mb-2" id="statusFilterContainer" style="display:none;">
            <label class="form-label">Estatus de los niveles <span class="text-danger">*</span></label>
            <select id="statusFilter" class="form-select">
                <option value="created">Creados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
            </select>
        </div>
        <hr>
    </div>
</div>
<div class="row">
    <div class="col">
    <p>Notas</p>
    <p>1. Para activar un programa es necesario configurar los documentos necesarios.</p>
        <div class="table-responsive">
            <table class="table" id="ProgramTabla" data-height="720" data-show-export="true" data-show-fullscreen="true" data-unique-id="count">
                <thead class="table-dark">
                    <tr>
                        <th data-field="count" data-sortable="true">#</th>
                        <th data-field="name" data-sortable="true">Nombre</th>
                        <th data-field="abbreviation" data-sortable="true">Abreviación</th>
                        <th data-field="key" data-sortable="true">Clave</th>
                        <th data-field="description" data-sortable="true">Descripción</th>
                        <th data-field="status" data-sortable="true">Estatus</th>
                        <th data-field="actions">Opciones</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
    
</script>

    
</main>

    <!--  ################ Modals ###################### -->

<!-- Modal Register -->
<div class="modal fade" id="registerModalProgram" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="registerModalProgramLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="registerFormProgram">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="registerModalProgramLabel">Nuevo Programa</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row mt-2">
                            <div class="col">
                                <label for="ProgramName" class="form-label">Nombre del Programa <span class="text-danger">*</span></label>
                                <input type="text" class="form-control form-control-sm" id="ProgramName" required>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <label for="ProgramClave" class="form-label">Clave del Programa <span class="text-danger">*</span></label>
                                <input type="text" class="form-control form-control-sm" id="ProgramClave" required >
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <label for="ProgramAbbreviation" class="form-label">Abreviación<span class="text-danger">*</span></label>
                                <input type="text" class="form-control form-control-sm" id="ProgramAbbreviation" required oninput="this.value = this.value.toUpperCase()">
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <label for="ProgramDescription" class="form-label">Descripción</label>
                                <textarea class="form-control form-control-sm" id="ProgramDescription" rows="4"></textarea>                            </div>
                        </div>
                    </div>
                <div class="modal-footer">
                    <div class="d-flex justify-content-end">
                        <button type="reset" class="btn btn-secondary me-2" data-bs-dismiss="modal" onclick="resetModalRegisterProgram()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Crear</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

    <!-- Modal update -->
    <div class="modal fade" id="updateModalProgram" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="updateModalProgramLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="updateFormProgram">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="updateModalProgramLabel">Actualizar Programa</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row mt-2">
                            <div class="col">
                                <label for="ProgramNameUpdate" class="form-label">Nombre del Programa <span class="text-danger">*</span></label>
                                <input type="text" class="form-control form-control-sm" id="ProgramNameUpdate" required>
                            </div>
                        </div>
                    <div class="row mt-2">
                            <div class="col">
                                <label for="ProgramClaveUpdate" class="form-label">Clave del Programa <span class="text-danger">*</span></label>
                                <input type="text" class="form-control form-control-sm" id="ProgramClaveUpdate" required oninput="this.value = this.value.toUpperCase()">
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <label for="ProgramAbbreviationUpdate" class="form-label">Abreviación <span class="text-danger">*</span></label>
                                <input type="text" class="form-control form-control-sm" id="ProgramAbbreviationUpdate" required oninput="this.value = this.value.toUpperCase()">
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <label for="ProgramDescriptionUpdate" class="form-label">Descripción </label>
                                <input type="text" class="form-control form-control-sm" id="ProgramDescriptionUpdate">
                            </div>
                        </div>
                        </div>
                <div class="modal-footer">
                    <div class="d-flex justify-content-end">
                        <button type="reset" class="btn btn-secondary me-2" data-bs-dismiss="modal" onclick="resetModalUpdateProgram()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Actualizar</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>


  <!-- Modal de Confirmación -->

<!-- Modal de Confirmación -->
<div class="modal fade" id="confirmModal" tabindex="-1" aria-labelledby="confirmModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-body text-center">
                <div class="mb-3">
                    <i class="bi bi-exclamation-circle" style="font-size: 3rem; color: #007bff;"></i>
                </div>
                <h5 class="modal-title mb-3" id="confirmModalLabel">Desactivar nivel</h5>
                <p id="confirmModalText">¿Estás seguro de Desactivar el nivel?</p>
                <div class="d-flex justify-content-center">
                    <button type="button" class="btn btn-primary me-2" id="confirmActionBtn">Confirmar</button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal de espera -->
<div class="modal fade" id="loadingModal" tabindex="-1" aria-labelledby="loadingModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-body text-center">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Cargando...</span>
                </div>
                <p>Cargando, por favor espere...</p>
            </div>
        </div>
    </div>
</div>
<!-- Modal de Error en registro por clave duplicada-->
<div class="modal fade" id="errorModal" tabindex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-body text-center">
                <!-- Ícono de advertencia -->
                <div class="mb-3">
                    <i class="bi bi-exclamation-circle" style="font-size: 3rem; color: #dc3545;"></i> <!-- Ícono en color rojo -->
                </div>
                <h5 class="modal-title mb-3" id="errorModalLabel">Error al registrar</h5>
                <p>Ya existe un Nivel con la misma clave. Por favor, ingresa una clave diferente.</p>
                <div class="d-flex justify-content-center">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Modal de Error en edición por clave duplicada-->
<div class="modal fade" id="errorModalClave" tabindex="-1" aria-labelledby="errorModalClaveLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-body text-center">
                <!-- Ícono de advertencia -->
                <div class="mb-3">
                    <i class="bi bi-exclamation-circle" style="font-size: 3rem; color: #dc3545;"></i> <!-- Ícono en color rojo -->
                </div>
                <h5 class="modal-title mb-3" id="errorModalClaveLabel">Error al editar</h5>
                <p>La clave ingresada ya existe en otro Nivel.</p>
                <div class="d-flex justify-content-center">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal de Error de Actualización de Ordenamiento y Tipo -->
<div class="modal fade" id="updateErrorModal" tabindex="-1" aria-labelledby="updateErrorModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-body text-center">
                <!-- Ícono de advertencia -->
                <div class="mb-3">
                    <i class="bi bi-exclamation-circle" style="font-size: 3rem; color: #dc3545;"></i> <!-- Ícono en color rojo -->
                </div>
                <h5 class="modal-title mb-3" id="updateErrorModalLabel">Error al editar</h5>
                <p id="updateErrorMessage">Aquí se mostrará el mensaje de error.</p>
                <div class="d-flex justify-content-center">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</div>




<!-- Modal de obtencion de informacion -->
 
<div class="modal" id="filterWaitModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-body">
                <div class="d-flex justify-content-center">
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Aplicando filtro...</span>
                    </div>
                </div>
                <p class="text-center mt-3">Aplicando filtro, por favor espera...</p>
            </div>
        </div>
    </div>
</div>


<!-- Modal para seleccionar Documento -->
<div class="modal fade" id="DocumentSelectModal" tabindex="-1" aria-labelledby="DocumentSelectModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="DocumentSelectModalLabel">Edita los documentos para este programa</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <!-- Mostrar nombre e ID del programa seleccionado -->
                <p><strong>Programa:</strong> <br><br>
                <span id="selectedProgramName"></span></p>
                <p><span id="selectedProgramId"></span></p>
                <hr>
                <label for="DocumentSelect">Documentos disponibles<span class="text-danger">*</span></label>
                <select id="DocumentSelect" class="form-select">
                    <!-- Aquí se llenarán los métodos de ingreso -->
                </select>
                <div id="selectedDocumentsContainer" class="mt-3" style="display: none;">
                    <label id="documentCountLabel">Documentos Agregados:</label>
                    <ul id="selectedDocumentsList" class="list-group">
                        <!-- Los documentos seleccionados aparecerán aquí -->
                    </ul>
                    <p class="mt-2 text-muted">
                        NOTA: Si uno de los documentos es obligatorio para el programa, haz click sobre el switch para hacerlo obligatorio. Caso contrario se asignará como opcional.
                    </p>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button id="confirmButton" class="btn btn-primary">Confirmar</button>
            </div>
        </div>
    </div>
</div>






<!-- Modal para seleccionar Requisitos -->
<div class="modal fade" id="RequisitoSelectModal" tabindex="-1" aria-labelledby="RequisitoSelectModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="RequisitoSelectModalLabel">Edita los Requisitos de Graduación para este programa</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <!-- Mostrar nombre del programa seleccionado -->
                <p><strong>Programa:</strong><br><br> 
                <span id="selectedProgramNameReq"></span></p>
                <p><span id="selectedProgramId2"></span></p>
                <hr>
                <label for="RequisitoSelect">Requisitos de Graduación disponibles<span class="text-danger">*</span></label>
                <select id="RequisitoSelect" class="form-select">
                    <!-- Aquí se llenarán los Requisitos -->
                </select>

                <!-- Lista de Requisitos seleccionados (oculta hasta seleccionar un Requisito) -->
                <!-- Lista de Requisitos seleccionados (oculta hasta seleccionar un Requisito) -->
            <div id="selectedRequisitoContainer" class="mt-3" style="display: none;">
                <label id="RequisitoCountLabel">Requisitos de Graduación Agregados:</label>
                <ul id="selectedRequisitoList" class="list-group">
        <!-- Los documentos seleccionados aparecerán aquí -->
                </ul>
            </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" id="confirmRequisitoButton">Confirmar</button>
                </div>
        </div>
    </div>
</div>


    <!-- Fin Modals -->
     

    <!-- REQUIRED SCRIPTS -->
    <script src="../vendor/jquery/jquery.js"></script>
    <script src="../vendor/boostrap/popper.min.js"></script>
    <script src="../vendor/boostrap/bootstrap.min.js"></script>

    <!-- Plugins Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap-table@1.23.5/dist/bootstrap-table.min.js"></script>
        
    <!-- Additional scripts -->
    <script src="../controllers/GlobalController.js"></script>
    <script src="../controllers/Tools.js"></script>
    <script src="../admin/models/ProgramasModel.js"></script>
    <script src="../admin/controllers/ProgramasController.js"></script>


    
</body>

</html>