// Saves options to chrome.storage
const jsonElementID = 'jsoninfo';
function save_options() {
    const jsonTextArea = document.getElementById(jsonElementID) as HTMLTextAreaElement;
    const jsoninfo = jsonTextArea.value;
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
        jsoninfo: "{\"000000000000\":{\"id\":\"Main\",\"color\":\"red\"},\"urls\":[{\"url\":\"https://example.com\",\"title\":\"Example.con\"}]}"
    }, function (options) {
      const jsonTextArea = document.getElementById(jsonElementID) as HTMLTextAreaElement;
      jsonTextArea.value = options.jsoninfo;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',save_options);