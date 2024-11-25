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

initializeHeader();
initializeBody();
initializeTabs();
initializeurlForm();
initializeGroupForm();

declare const InstallTrigger: any;

import {
  getAllAccounts,
  saveAdditionalLinks,
  getAdditionalLinks,
  saveAllAccounts,
  isChrome,
  debugLog,

} from '../../common/reference';

interface IGroupRecord {
  id: string;
  title: string;
  sortUrlsSwitch: string;
  useContainerSwitch: string;
}

import {
  accountConfigDiv,
  urlAddDiv,
  cogIcon,
  urlList,
  groupSelect,
  // hiddenBox,
} from './dom';

debugLog('start:');


document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, 'popupcomms', (response) => {
      if (response) {
        if (response.accountId) {
          showSingleAccount(response.accountId);
        } else {
          console.error('accountId is undefined in response:', response);
        }
      }
    });
  });

  const isFirefox = typeof InstallTrigger !== 'undefined';
  if (!isFirefox) {
    (document.querySelector('label[for="use-container"]') as HTMLElement).style.display = 'none';
    document.getElementById('use-container').style.display = 'none';
  }

  // Populate group dropdown
  getAdditionalLinks().then((accountDetails) => {
    const groups = new Set(accountDetails['urls'].map((url) => url.group || 'Default'));
    groups.forEach((group) => {
      const option = document.createElement('option') as HTMLOptionElement;
      option.value = group as string;
      option.text = group as string;
      option.dataset.useContainer =
        accountDetails['groups'] && accountDetails['groups'][group as string]
          ? accountDetails['groups'][group as string].useContainer
          : 'false';
      groupSelect.add(option);
    });
  });

  updatePopupUrls();

  const urlForm = document.getElementById('url-form');
  let sequenceNumber = 0;

  getAdditionalLinks().then((accountDetails) => {
    if (accountDetails['urls'] && accountDetails['urls'].length > 0) {
      accountDetails['urls'].forEach((item, index) => {
        item.id = index.toString();
      });
      saveAdditionalLinks(accountDetails).then(() => {
        const maxId = Math.max(...accountDetails['urls'].map((item) => parseInt(item.id, 10)));
        sequenceNumber = isNaN(maxId) ? 0 : maxId + 1;
        updatePopupUrls();
      });
    }
  });
});

export const updatePopupUrls = () => {
  debugLog('Updating popup urls');
  getAdditionalLinks().then((accountDetails) => {
    let updateRquired = false;
    let oldSystem = false;
    urlList.innerHTML = '';

    // Check if any old system urls contains the old group value
    if (accountDetails['urls']) {
      accountDetails['urls'].forEach((urlItem) => {
        if (urlItem.group) {
          oldSystem = true;
        }
      });
    }



    if (accountDetails['urls']) {

      // Check for old system grouped urls.
      if (accountDetails['groups'] === undefined) {
        accountDetails['groups'] = [];
      } else {
        //make sure all groups have an id that already exist
        accountDetails['groups'].forEach((group) => {
          if (!group.id) {
            group.id = (Math.max(...accountDetails['groups'].map((item) => parseInt(item.id, 10))) + 1).toString();
            updateRquired = true;
          }
        });
      }

      const uniqueValuesArray = [...new Set(accountDetails['urls'].map(obj => obj.group))];
      if (uniqueValuesArray.length > 0) {
        let maxGroupIndex = accountDetails['groups'].length === 0 ? 0 : Math.max(...accountDetails['groups'].map((item: IGroupRecord) => parseInt(item.id, 10))) + 1;
        uniqueValuesArray.forEach((group) => {
          const groupIndex = accountDetails['groups'].findIndex((item) => item.title === group);
          if (groupIndex === -1) {
            accountDetails['groups'].push({ id: maxGroupIndex++, title: group, sortUrlsSwitch: 'false', useContainerSwitch: 'false' });
            updateRquired = true;
          }

        });
      }

      if (!accountDetails['groups'] || (accountDetails['groups'] && accountDetails['groups'].length === 0)) {
        console.log('Adding default group to accountDetails');
        accountDetails['groups'].push({ id: 0, title: 'Default', sortUrlsSwitch: 'false', useContainerSwitch: 'false' });
        updateRquired = true;
      }


      // find first group
      const firstGroup = accountDetails['groups'][0]
      // check all urls have a group id
      accountDetails['urls'].map((urlItem) => {
        if (!urlItem.groupId) {
          const groupIndex = accountDetails['groups'].findIndex((item) => item.title === urlItem.group);
          if (groupIndex !== -1) {
            urlItem.groupId = accountDetails['groups'][groupIndex].id;
          } else {
            urlItem.groupId = firstGroup.id;
          }
          updateRquired = true;
        }
      });

      // remove all url group values that are now our of date
      accountDetails['urls'].map((urlItem) => {
        if (urlItem.group) {
          delete urlItem.group;
          updateRquired = true;
        }
        if (urlItem.useContainer || urlItem.useContainer === false) {
          delete urlItem.useContainer;
          updateRquired = true;
        }
        if (urlItem.sortUrlsSwitch || urlItem.sortUrlsSwitch === false) {
          delete urlItem.sortUrlsSwitch;
          updateRquired = true;
        }
      });

      if (updateRquired && oldSystem) {
        saveAdditionalLinks(accountDetails);
      }

      let sortedGroups = accountDetails['groups'];
      if (sortedGroups.length > 2) {
        sortedGroups = sortedGroups.sort((a: IGroupRecord, b: IGroupRecord) => {
          const comparison = a.title.localeCompare(b.title, 'en');
          if (comparison === 0) return 0;
          if (a.title === a.title.toUpperCase() && b.title === b.title.toLowerCase()) return 1;
          if (a.title === a.title.toLowerCase() && b.title === b.title.toUpperCase()) return -1;
          return comparison;
        });
      }

      for (const group of sortedGroups) {
        console.log('-->>>>>>>>group:', JSON.stringify(group, null, 2));
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
          urls = urls.sort((a, b) => {
            const comparison = a.title.localeCompare(b.title, 'en');
            if (comparison === 0) return 0;
            if (a.title[0] === a.title[0].toUpperCase() && b.title[0] === b.title[0].toLowerCase()) return 1;
            if (a.title[0] === a.title[0].toLowerCase() && b.title[0] === b.title[0].toUpperCase()) return -1;
            return comparison;
          });
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
  });
};


const showSingleAccount = (accountId) => {
  const container = document.getElementById('accountConfig');
  getAllAccounts().then((jsonData) => {
    const form = document.createElement('form');
    const account = jsonData[accountId];
    const accountDiv = document.createElement('div');
    const nameLabel = document.createElement('label');
    nameLabel.textContent = account.id + ': ' + accountId;
    accountDiv.appendChild(nameLabel);
    const colorInput = document.createElement('input');
    colorInput.classList.add('color-input'); // Add class for styling
    colorInput.value = account.color;

    // colorInput.addEventListener('focus', function () {
    //   hiddenBox.style.height = '150px';
    // });

    colorInput.addEventListener('change', function (event) {
      const selectedColor = (event.target as HTMLInputElement).value;
      const accountId = (event.target as HTMLInputElement).parentNode
        .querySelector('label')
        .textContent.split(':')[1]
        .trim();
      getAllAccounts().then((data) => {
        data[accountId].color = selectedColor;
        colorInput.style.color = selectedColor;
        colorInput.style.backgroundColor = selectedColor;
        saveAllAccounts(data).finally(() => {
          // console.log('update:', update);
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id, `updateColour:${selectedColor}`, (response) => {
              return true;
            });
          });
        });
      });
    });

    accountDiv.appendChild(colorInput);
    form.appendChild(accountDiv);
    container.appendChild(form);
  });
};
