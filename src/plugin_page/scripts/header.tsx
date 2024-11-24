
import {
    cogIcon,
    accountConfigDiv,
    urlAddDiv,
    // hiddenBox,
    urlForm,
    firefoxViewport,
    editMode,
    helpButton,
   
} from './dom';

import { debugLog, onError,
  onUpdated } from '../../common/reference';
import { resizeBody } from './body';

export function initializeHeader() {
    editMode.style.display = 'none';
    cogIcon.addEventListener('click', function () {
        if (cogIcon.dataset.action === 'runMode' || cogIcon.dataset.action === undefined) {
            // accountConfigDiv.style.visibility = 'unset';
            // urlAddDiv.style.visibility = 'unset';
            // urlAddDiv.style.backgroundColor = 'orange';
            urlForm.dataset.action = 'new';
            // urlAddDiv.style.height = '900px';
            cogIcon.dataset.action = 'editMode';
            editMode.style.display = 'block';
            debugLog('Edit Mode');
        } else {
            // accountConfigDiv.style.visibility = 'hidden';
            // urlAddDiv.style.visibility = 'hidden';
            // urlAddDiv.style.height = '0px';
            // hiddenBox.style.height = '0px';
            cogIcon.dataset.action = 'runMode';
            editMode.style.display = 'none';
            // body.style.height = '250px';
            // urlAddDiv.style.height = '280px';
            debugLog('Run Mode');

        }
        resizeBody();
    });


    function openHelpPage() {
    const helpUrl = 'https://aws-console-title-bar.akfdev.com/';
    if (typeof browser !== 'undefined') {
      browser.tabs.create({ url: helpUrl }).then(onUpdated, onError);
    } else if (typeof chrome !== 'undefined') {
      chrome.tabs.create({ url: helpUrl }, onUpdated);
    } else {
      console.error('Browser API not supported');
    }
  }


  helpButton.addEventListener('click', openHelpPage);

}

