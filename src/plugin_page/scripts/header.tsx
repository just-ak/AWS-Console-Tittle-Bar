const {
    ph_cogIcon,
    ph_accountConfigDiv,
    ph_urlAddDiv,
    ph_hiddenBox,
    ph_urlForm,
    ph_body
} = require('./dom');

export function initializeHeader() {
    ph_cogIcon.addEventListener('click', function () {
        if (ph_cogIcon.dataset.action === 'runMode') {
            ph_accountConfigDiv.style.visibility = 'unset';
            ph_urlAddDiv.style.visibility = 'unset';
            ph_urlAddDiv.style.height = '290px';
            ph_urlAddDiv.style.backgroundColor = 'orange';
            ph_urlForm.dataset.action = 'new';
            ph_body.style.height = '400px';
            ph_cogIcon.dataset.action = 'editMode';
        } else {
            ph_accountConfigDiv.style.visibility = 'hidden';
            ph_urlAddDiv.style.visibility = 'hidden';
            ph_urlAddDiv.style.height = '0px';
            ph_hiddenBox.style.height = '0px';
            ph_cogIcon.dataset.action = 'runMode';
        }
    });
}