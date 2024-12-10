<!doctype html>
<html lang="es-MX">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Usuarios</title>
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
                    <button class="btn btn-sm btn-success" type="button" data-bs-toggle="modal" data-bs-target="#registerModalUser"><i class="fa-solid fa-plus"></i> Nuevo Usuario</button>
                </div>
                <h5>Usuarios/List</h5>
                
                <hr>
            </div>
        </div>

        <div class="row">
    <div class="col">
        <div class="d-flex align-items-center mb-2">
            <div class="col-lg-3 col-md-6 mt-3 mb-2">
                <label class="form-label">Tipo de Usuario <span class="text-danger">*</span></label>
                <select id="roleSelector" class="form-select">
                    <option value="coordinator">Coordinadores</option>
                    <option value="professor">Profesores</option>
                </select>
            </div>
            <button class="btn btn-sm btn-success ms-auto" type="button" id="refreshButton">Actualizar</button>
        </div>

        <!-- Filtro de estatus debajo del tipo de usuario -->
        <div class="d-flex align-items-center mt-3">
            <div class="form-check me-auto">
                <input type="checkbox" class="form-check-input" id="filterCheckbox">
                <label for="filterCheckbox" class="form-check-label"> Activar Filtro </label>
            </div>
        </div>

        <!-- Filtro de estatus (oculto por defecto) -->
    <div id="statusFilterContainer" style="display:none;">
        <div class="d-flex align-items-center mt-3">
            <div class="col-lg-3 col-md-6 mt-3 mb-2">
                <div class="d-flex align-items-center">
                    <div class="form-check form-switch me-2">
                        <input class="form-check-input" type="checkbox" id="statusSwitch">
                    </div>

                        <label class="form-label mb-0">Buscar por Estatus</label>
                </div>
                <select id="statusFilter" class="form-select mt-2">
                    <option value="created">Creados</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                </select>
            </div>

            <!-- Apellidos a la derecha del label -->
            <div class="col-lg-3 col-md-6 mt-3 mb-2 ms-3">
                <label class="form-label">Apellidos <span class="text-danger">*</span></label>
                <input type="text" class="form-control form-control-sm" id="lastNameInput">
            </div>
        </div>
    </div>
</div>

<div class="row">
    <div class="col">
        <div class="table-responsive">
            <table class="table" id="UserTabla" data-height="720" data-show-export="true" data-show-fullscreen="true" data-unique-id="count">
                <thead class="table-dark">
                    <tr>
                        <th data-field="count" data-sortable="true">#</th>
                        <th data-field="name" data-sortable="true">Nombre</th>
                        <th data-field="last_name" data-sortable="true">Apellido</th>
                        <th data-field="email" data-sortable="true">Correo</th>
                        <th data-field="status" data-sortable="true">Estado</th>
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
<div class="modal fade" id="registerModalUser" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="registerModalUserLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="registerFormUser">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="registerModalUserLabel">Nuevo Usuario</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row mt-2">
                            <div class="col">
                                <label class="form-label">Tipo de Usuario<span class="text-danger">*</span></label>
                                    <select id="userSelector" class="form-select">
                                        <option value="coordinator">Coordinador</option>
                                        <option value="professor">Profesor</option>
                                    </select>                            
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <label for="UserName" class="form-label">Nombre<span class="text-danger">*</span></label>
                                <input type="text" class="form-control form-control-sm" id="UserName" required>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <label for="UserLastName" class="form-label">Apellidos<span class="text-danger">*</span></label>
                                <input type="text" class="form-control form-control-sm" id="UserLastName" required>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <label for="UserEmail" class="form-label">Correo<span class="text-danger">*</span></label>
                                <input type="text" class="form-control form-control-sm" id="UserEmail" required>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <label for="UserPassword" class="form-label">Contraseña<span class="text-danger">*</span></label>
                                <input type="text" class="form-control form-control-sm" id="UserPassword" required>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <label for="UserPasswordRepeat" class="form-label">Repita la Contraseña<span class="text-danger">*</span></label>
                                <input type="text" class="form-control form-control-sm" id="UserPasswordRepeat" required>
                            </div>
                        </div>
                        
                    </div>
                <div class="modal-footer">
                    <div class="d-flex justify-content-end">
                        <button type="reset" class="btn btn-secondary me-2" data-bs-dismiss="modal" onclick="resetModalRegisterUser()">Cancelar</button>
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
                <p>El correo ingresado ya se encuentra registrado</p>
                <div class="d-flex justify-content-center">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</div>



<!-- Modal de registro exitoso -->

<div class="modal fade" id="successModalUser" tabindex="-1" aria-labelledby="successModalUserLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="successModalUserLabel">¡Registro Exitoso!</h5>
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
    <script src="../admin/models/UsuariosModel.js"></script>
    <script src="../admin/controllers/UsuariosController.js"></script>

    
</body>

</html>