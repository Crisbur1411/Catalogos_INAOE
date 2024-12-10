<!doctype html>
<html lang="es-MX">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Residentes Aulas</title>
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
                    <button class="btn btn-sm btn-success" type="button" data-bs-toggle="modal" data-bs-target="#registerModalClassroom"><i class="fa-solid fa-plus"></i> Nueva Aula</button>
                </div>
                <h5>Aulas/List</h5>
                
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
            <label class="form-label">Estatus de las Aulas <span class="text-danger">*</span></label>
            <select id="statusFilter" class="form-select">
                <option value="created">Creadas</option>
                <option value="active">Activas</option>
                <option value="inactive">Inactivas</option>
            </select>
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="table-responsive">
            <table class="table" id="ClassroomTabla" data-height="720" data-show-export="true" data-show-fullscreen="true" data-unique-id="count">
                <thead class="table-dark">
                    <tr>
                        <th data-field="count" data-sortable="true">#</th>
                        <th data-field="campus" data-sortable="true">Campus</th>
                        <th data-field="name" data-sortable="true">Nombre</th>
                        <th data-field="size" data-sortable="true">Cupo</th>
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

    
</main>

    <!--  ################ Modals ###################### -->

<!-- Modal Register -->
<div class="modal fade" id="registerModalClassroom" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="registerModalClassroomLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="registerFormClassroom">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="registerModalClassroomLabel">Nueva Aula</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row mt-2">
                            <div class="col">
                            <label for="CampusSelect" class="form-label">Seleccione el Campus<span class="text-danger">*</span></label>
                        <select id="CampusSelect" class="form-select form-select-sm">
                        <!-- Aquí se llenarán los campus -->
                        </select>                            
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <label for="ClassroomName" class="form-label">Nombre del Campus <span class="text-danger">*</span></label>
                                <input type="text" class="form-control form-control-sm" id="ClassroomName" required>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <label for="ClassroomCupo" class="form-label">Cupo<span class="text-danger">*</span></label>
                                <input type="number" class="form-control form-control-sm" id="ClassroomCupo" required>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <label for="ClassroomDescription" class="form-label">Descripción del Aula <span class="text-danger">*</span></label>
                                <input type="text" class="form-control form-control-sm" id="ClassroomDescription" required>
                            </div>
                        </div>
                    </div>
                <div class="modal-footer">
                    <div class="d-flex justify-content-end">
                        <button type="reset" class="btn btn-secondary me-2" data-bs-dismiss="modal" onclick="resetModalRegisterClassroom()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Modal update -->
<div class="modal fade" id="updateModalClassroom" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="updateModalClassroomLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="updateFormClassroom">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="updateModalClassroomLabel">Editar Aula</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row mt-2">
                        <div class="col">
                            <label for="CampusSelectUpdate" class="form-label">Campus <span class="text-danger">*</span></label>
                            <select id="CampusSelectUpdate" class="form-select form-select-sm" disabled >
                                <!-- Aquí se llenará el campus actual -->
                            </select>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col">
                            <label for="ClassroomNameUpdate" class="form-label">Nombre del Aula <span class="text-danger">*</span></label>
                            <input type="text" class="form-control form-control-sm" id="ClassroomNameUpdate" required>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col">
                            <label for="ClassroomCupoUpdate" class="form-label">Cupo <span class="text-danger">*</span></label>
                            <input type="number" class="form-control form-control-sm" id="ClassroomCupoUpdate" required>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col">
                            <label for="ClassroomDescriptionUpdate" class="form-label">Descripción <span class="text-danger">*</span></label>
                            <input type="text" class="form-control form-control-sm" id="ClassroomDescriptionUpdate" required>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="d-flex justify-content-end">
                        <button type="reset" class="btn btn-secondary me-2" data-bs-dismiss="modal" onclick="resetModalUpdateClassroom()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar</button>
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
                <h5 class="modal-title mb-3" id="confirmModalLabel"></h5>
                <p id="confirmModalText"></p>
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




<!-- Modal de registro exitoso -->

<div class="modal fade" id="successModalAula" tabindex="-1" aria-labelledby="successModalAulaLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="successModalAulaLabel">¡Registro Exitoso!</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center"> <!-- Centra el contenido -->
                <div class="mb-3">
                    <i class="bi bi-check-circle" style="font-size: 3rem; color: #007bff;"></i> 
                </div>
                <p id="successModalMessage"></p> <!-- Texto debajo del ícono -->
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
            </div>
        </div>
    </div>
</div>


<!-- Modal de edicion exitosa -->

<div class="modal fade" id="successEditModalAula" tabindex="-1" aria-labelledby="successEditModalAulaLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="successEditModalAulaLabel">¡Edición Exitosa!</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body text-center"> <!-- Centrar contenido -->
                <div class="mb-3">
                    <i class="bi bi-check-circle" style="font-size: 3rem; color: #007bff;"></i> 
                </div>
                <p>El registro ha sido actualizado con éxito.</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
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
    <script src="../admin/models/AulasModel.js"></script>
    <script src="../admin/controllers/AulasController.js"></script>

    
</body>

</html>