/**
 * @param mixed modal_id
 * 
 * @return crea un modal para bootstrap
 */
function createBootstrapModal(modal_id) {
    const modal_settings = { backdrop: 'static', keyboard: false, show: true };
    return new bootstrap.Modal(document.getElementById(modal_id), modal_settings);
}