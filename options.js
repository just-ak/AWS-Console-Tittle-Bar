// Saves options to chrome.storage
function save_options() {
    var jsoninfo = document.getElementById('jsoninfo').value;
    chrome.storage.local.set({
        jsoninfo: jsoninfo
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.local.get({
        // default value
        jsoninfo: "{\"0123456789\":\"Example\"}"
    }, function (options) {
        document.getElementById('jsoninfo').value = options.jsoninfo;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',save_options);