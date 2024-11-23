
const {
    ph_cogIcon,
    ph_accountConfigDiv,
    ph_urlAddDiv,
    ph_hiddenBox,
    ph_urlForm,
    ph_firefoxViewport,
    ph_editMode
} = require('./dom');

const { pp_debugLog } = require('../../common/reference');
const { pb_resizeBody } = require('./body');

export function initializeHeader() {
    ph_editMode.style.display = 'none';
    ph_cogIcon.addEventListener('click', function () {
        if (ph_cogIcon.dataset.action === 'runMode' || ph_cogIcon.dataset.action === undefined) {
            // ph_accountConfigDiv.style.visibility = 'unset';
            // ph_urlAddDiv.style.visibility = 'unset';
            // ph_urlAddDiv.style.backgroundColor = 'orange';
            ph_urlForm.dataset.action = 'new';
            // ph_urlAddDiv.style.height = '900px';
            ph_cogIcon.dataset.action = 'editMode';
            ph_editMode.style.display = 'block';
            pp_debugLog('Edit Mode');
        } else {
            // ph_accountConfigDiv.style.visibility = 'hidden';
            // ph_urlAddDiv.style.visibility = 'hidden';
            // ph_urlAddDiv.style.height = '0px';
            // ph_hiddenBox.style.height = '0px';
            ph_cogIcon.dataset.action = 'runMode';
            ph_editMode.style.display = 'none';
            // ph_body.style.height = '250px';
            // ph_urlAddDiv.style.height = '280px';
            pp_debugLog('Run Mode');

        }
        pb_resizeBody();
    });
}