
import {
  cogIcon,
  editMode,
  githubButton,
  helpButton,
  urlForm
} from './dom';

import {
  debugLog, onError,
  onUpdated
} from '../../common/reference';
import { resizeBody } from './body';

export function initializeHeader() {
  editMode.style.display = 'none';
  cogIcon.addEventListener('click', function () {
    if (cogIcon.dataset.action === 'runMode' || cogIcon.dataset.action === undefined) {
      urlForm.dataset.action = 'new';
      cogIcon.dataset.action = 'editMode';
      editMode.style.display = 'block';
      debugLog('Edit Mode');
    } else {
      cogIcon.dataset.action = 'runMode';
      editMode.style.display = 'none';
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

  function openGitHubPage() {
    const helpUrl = 'https://github.com/just-ak/AWS-Console-Tittle-Bar';
    if (typeof browser !== 'undefined') {
      browser.tabs.create({ url: helpUrl }).then(onUpdated, onError);
    } else if (typeof chrome !== 'undefined') {
      chrome.tabs.create({ url: helpUrl }, onUpdated);
    } else {
      console.error('Browser API not supported');
    }
  }
  githubButton.addEventListener('click', openGitHubPage);
  helpButton.addEventListener('click', openHelpPage);
}
