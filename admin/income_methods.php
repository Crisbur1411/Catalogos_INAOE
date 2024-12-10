<!doctype html>
<html lang="es-MX">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Residentes</title>
    <link rel="stylesheet" href="../vendor/boostrap/bootstrap.min.css">

    <!-- Icons -->
    <script src="https://kit.fontawesome.com/1e996f8cdc.js" crossorigin="anonymous"></script>

    <!-- BS Tables -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-table@1.23.5/dist/bootstrap-table.min.css">

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
                    <h5>Métodos de ingreso</h5>
                    <hr>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <div class="btn-group float-end">
                        <button class="btn btn-sm btn-success" type="button" data-bs-toggle="modal" data-bs-target="#registerModal"><i class="fa-solid fa-plus"></i> Registrar</button>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <div class="table-responsive">
                        <table class="table" id="mainTable" data-height="720" data-show-export="true" data-show-fullscreen="true" data-unique-id="count">
                            <thead>
                                <tr>
                                    <th data-field="count" data-sortable="true">#</th>
                                    <th data-field="name" data-sortable="true">Nombre</th>
                                    <th data-field="description" data-sortable="true">Descripción</th>
                                    <th data-field="createdAt" data-sortable="true">Fecha de creacion</th>
                                    <th data-field="status" data-sortable="true">Estatus</th>
                                    <th data-field="actions">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!--  ################ Modals ###################### -->

    <!-- Modal Register -->
    <div class="modal fade" id="registerModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="registerModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                <form id="registerForm">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="registerModalLabel">Registrar método de ingreso</h1>
                    </div>
                    <div class="modal-body">
                        <div class="row mt-2">
                            <div class="col">
                                <label for="methodName" class="form-label">Nombre de método de ingreso <span class="text-danger">*</span></label>
                                <input type="text" class="form-control form-control-sm" id="methodName" required>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <label for="methodDescription" class="form-label">Descripción</label>
                                <textarea class="form-control form-control-sm" id="methodDescription" rows="4"></textarea>
                            </div>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <div class="btn-group btn-group-sm">
                            <button type="reset" class="btn btn-secondary" data-bs-dismiss="modal" onclick="resetModalRegister()">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Registrar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Modal update -->
    <div class="modal fade" id="updateModal" tabindex="-1" data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="updateModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">

                <form id="updateForm">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="updateModalLabel">Registrar método de ingreso</h1>
                    </div>
                    <div class="modal-body">
                        <div class="row mt-2">
                            <div class="col">
                                <label for="methodNameUpdate" class="form-label">Nombre de método de ingreso <span class="text-danger">*</span></label>
                                <input type="text" class="form-control form-control-sm" id="methodNameUpdate" required>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col">
                                <label for="methodDescriptionUpdate" class="form-label">Descripción</label>
                                <textarea class="form-control form-control-sm" id="methodDescriptionUpdate" rows="4"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="btn-group btn-group-sm">
                            <button type="reset" class="btn btn-secondary" data-bs-dismiss="modal" onclick="resetModalUpdate()">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Actualizar</button>
                        </div>
                    </div>
                </form>
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
    <script src="../admin/models/IncomeMethodModel.js"></script>
    <script src="../admin/controllers/IncomeMethodsController.js"></script>

</body>

</html>