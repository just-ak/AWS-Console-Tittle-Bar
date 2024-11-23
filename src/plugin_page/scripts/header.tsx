const {
    ph_cogIcon,
    ph_accountConfigDiv,
    ph_urlAddDiv,
    ph_hiddenBox,
    ph_urlForm
} = require('./dom');

export function initializeHeader() {
    ph_cogIcon.addEventListener('click', function () {
        if (ph_accountConfigDiv.style.visibility === 'hidden') {
            ph_accountConfigDiv.style.visibility = 'unset';
            ph_urlAddDiv.style.visibility = 'unset';
            ph_urlAddDiv.style.height = '290px';
            ph_urlAddDiv.style.backgroundColor = 'orange';
            ph_urlForm.dataset.action = 'new';
        } else {
            ph_accountConfigDiv.style.visibility = 'hidden';
            ph_urlAddDiv.style.visibility = 'hidden';
            ph_urlAddDiv.style.height = '0px';
            ph_hiddenBox.style.height = '0px';
        }
    });
}