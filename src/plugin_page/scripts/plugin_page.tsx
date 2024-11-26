import '../css/account_colour.css';
import '../css/base.css';
import '../css/footer.css';
import '../css/form.css';
import '../css/groups.css';
import '../css/header.css';
import '../css/url_form.css';
import '../css/url_list.css';
import '../css/account_config.css';
import '../css/tabs.css';
import '../css/preferences_form.css';

import { initializeTabs } from './tabs';
import { initializeHeader } from './header';
import { initializeBody } from './body';
import { initializeurlForm } from './url_form';
import { initializeGroupForm } from './group_form';
import { initializePreferencesForm } from './preferences';

import {
  getAdditionalLinks,
  debugLog,
  IAdditionalLinks,

} from '../../common/reference';

import {
  urlList,
  // hiddenBox,
} from './dom';
import { upgradeManagement } from './upgrades';
import { initializePopupComs } from './popupcomms';
import { initializeUrlList } from './urlList';



initializePopupComs();
initializeUrlList();
initializeHeader();
initializeBody();
initializeTabs();
initializeurlForm();
initializeGroupForm();
initializePreferencesForm();

let isUpdating = false;

export const updatePopupUrls = () => {
  if (isUpdating) return;
  isUpdating = true;

  getAdditionalLinks().then((additionalLinks) => {
    const accountDetails: IAdditionalLinks = upgradeManagement(additionalLinks);
    const timestamp = new Date().getTime();
    urlList.innerHTML = '';
    if (accountDetails['urls']) {
      let sortedGroups = accountDetails['groups'];
      if (sortedGroups.length > 2) {
        sortedGroups = sortedGroups.sort((a, b) => a.title.localeCompare(b.title, 'en'));
      }
      for (const group of sortedGroups) {
        if (group.title) {
          const groupDiv = document.createElement('div');
          groupDiv.classList.add('group-title');
          groupDiv.innerText = group.title;
          groupDiv.dataset.recordId = group.id;
          groupDiv.dataset.sortUrlsSwitch = group.sortUrlsSwitch;
          groupDiv.dataset.useContainerSwitch = group.useContainerSwitch;

          urlList.appendChild(groupDiv);
        }
        let urls = accountDetails['urls'].filter((urlItem) => `${urlItem.groupId}` === `${group.id}`);
        if (group.sortUrlsSwitch === 'true') {
          urls = urls.sort((a, b) => a.title.localeCompare(b.title, 'en'));
        }

        urls.forEach((urlItem) => {
          const elementAccountDiv = document.createElement('div');
          elementAccountDiv.classList.add('url-item'); // Add class for styling
          const elementAccountName = document.createElement('span');
          elementAccountName.classList.add('url-link');
          elementAccountName.innerText = `${urlItem.title}`;
          elementAccountName.dataset.url = urlItem.url;
          elementAccountName.dataset.recordId = urlItem.id;
          elementAccountName.dataset.groupId = group.id;
          elementAccountName.dataset.useContainerSwitch = group.sortUrlsSwitch;
          elementAccountName.dataset.containerTitle = group.title;

          elementAccountName.draggable = true;
          elementAccountDiv.appendChild(elementAccountName);
          urlList.appendChild(elementAccountDiv);
          debugLog('elementAccountName:', elementAccountName);
        });
      }
    }
    isUpdating = false;
  }).catch((error) => {
    // console.error('Error updating popup URLs:', error);
    isUpdating = false;
  });
};
