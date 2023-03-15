// Saves options to chrome.storage
const jsonElementID = 'jsonElementID';
function save_options() {
    const jsonTextArea = document.getElementById(jsonElementID) as HTMLTextAreaElement;
    const jsonInfo = jsonTextArea.value;
    chrome.storage.local.set({
        jsonInfo: jsonInfo
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
        jsonInfo: "{\"0123456789\":\"Example\"}"
    }, function (options) {
      const jsonTextArea = document.getElementById(jsonElementID) as HTMLTextAreaElement;
      jsonTextArea.value = options.jsonInfo;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',save_options);