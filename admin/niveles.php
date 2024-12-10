<!doctype html>
<html lang="es-MX">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Residentes Nivel</title>
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
                    <button class="btn btn-sm btn-success" type="button" data-bs-toggle="modal" data-bs-target="#registerModalNivel"><i class="fa-solid fa-plus"></i> Nuevo Nivel</button>
                </div>
                <h5>Niveles/List</h5>
                
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
            <label class="form-label">Estatus de los Niveles <span class="text-danger">*</span></label>
            <select id="statusFilter" class="form-select">
                <option value="created">Creados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
            </select>
        </div>
    </div>
</div>
<div class="row">
    <div class="col">
        <div class="table-responsive">
            <table class="table" id="NivelesTabla" data-height="720" data-show-export="true" data-show-fullscreen="true" data-unique-id="count">
                <thead class="table-dark">
                    <tr>
                        <th data-field="count" data-sortable="true">#</th>
                        <th data-field="key" data-sortable="true">Clave</th>
                        <th data-field="name" data-sortable="true">Nombre</th>
                        <th data-field="order" data-sortable="true">Ordenamiento</th>
                        <th data-field="type" data-sortable="true">Tipo</th>
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
<div class="modal fade" id="registerModalNivel" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="registerModalNivelLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="registerFormNivel">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="registerModalNivelLabel">Nuevo Nivel</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row mt-2">
                            <div class="col">
                                <label for="NivelClave" class="form-label">Clave de Nivel <span class="text-danger">*</span></label>
                                <input type="text" class="form-control form-control-sm" id="NivelClave" required oninput="this.value = this.value.toUpperCase()">
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <label for="NivelName" class="form-label">Nombre de Nivel <span class="text-danger">*</span></label>
                                <input type="text" class="form-control form-control-sm" id="NivelName" required>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <label for="NivelOrdenamiento" class="form-label">Ordenamiento</label>
                                <input type="number" class="form-control form-control-sm" id="NivelOrdenamiento" >
                            </div>
                        </div>
                        <div class="mb-3">
                        <label for="NivelTipo" class="form-label">Tipo de Nivel</label>
                        <select class="form-select" id="NivelTipo" required>
                            <option value="semestre">Semestre</option>
                            <option value="cuatrimestre">Cuatrimestre</option>
                            <option value="trimestre">Trimestre</option>
                            <option value="anual">Anual</option>
                        </select>
                    </div>
                    </div>
                <div class="modal-footer">
                    <div class="d-flex justify-content-end">
                        <button type="reset" class="btn btn-secondary me-2" data-bs-dismiss="modal" onclick="resetModalRegisterNivel()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

    <!-- Modal update -->
    <div class="modal fade" id="updateModalNivel" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="updateModalNivelLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <form id="updateFormNivel">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="updateModalNivelLabel">Editar Nivel</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row mt-2">
                            <div class="col">
                                <label for="NivelClaveUpdate" class="form-label">Clave de Nivel <span class="text-danger">*</span></label>
                                <input type="text" class="form-control form-control-sm" id="NivelClaveUpdate"  oninput="this.value = this.value.toUpperCase()">
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <label for="NivelNameUpdate" class="form-label">Nombre del Nivel <span class="text-danger">*</span></label>
                                <input type="text" class="form-control form-control-sm" id="NivelNameUpdate" required>
                            </div>
                        </div>
                        <div class="row mt-2">
                            <div class="col">
                                <label for="NivelOrdenamientoUpdate" class="form-label">Ordenamiento </label>
                                <input type="number" class="form-control form-control-sm" id="NivelOrdenamientoUpdate">
                            </div>
                        </div>
                        <div class="mb-3">
                        <label for="NivelTipoUpdate" class="form-label">Tipo de Nivel</label>
                        <select class="form-select" id="NivelTipoUpdate" required>
                            <option value="semestre">Semestre</option>
                            <option value="cuatrimestre">Cuatrimestre</option>
                            <option value="trimestre">Trimestre</option>
                            <option value="anual">Anual</option>
                        </select>
                    </div>
                        </div>
                <div class="modal-footer">
                    <div class="d-flex justify-content-end">
                        <button type="reset" class="btn btn-secondary me-2" data-bs-dismiss="modal" onclick="resetModalUpdateNivel()">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>


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


<!-- Modal de registro exitoso -->

<div class="modal fade" id="successModalNivel" tabindex="-1" aria-labelledby="successModalNivelLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="successModalNivelLabel">¡Registro Exitoso!</h5>
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

<div class="modal fade" id="successEditModalNivel" tabindex="-1" aria-labelledby="successEditModalNivelLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="successEditModalNivelLabel">¡Edición Exitosa!</h5>
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
    <script src="../admin/models/NivelesModel.js"></script>
    <script src="../admin/controllers/NivelesController.js"></script>

    
</body>

</html>