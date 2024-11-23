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

const { initializeTabs } = require('./tabs');
const { initializeHeader } = require('./header');
const { initializeBody } = require('./body');
const { initializeUrlForm } = require('./group_form');

initializeHeader();
initializeBody();
initializeTabs();
// initializeUrlForm();

declare const InstallTrigger: any;

const {
  pp_getAllAccounts,
  pp_saveAdditionalLinks,
  pp_getAdditionalLinks,
  pp_saveAllAccounts,
  pp_isChrome,
  pp_debugLog,
} = require('../../common/reference');

const {
  pp_accountConfigDiv,
  pp_urlAddDiv,
  pp_cogIcon,
  // pp_hiddenBox,
} = require('./dom');

pp_debugLog('start:');

function onUpdated(tab) {
  console.log(`Updated tab: ${tab.id}`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

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

  const groupSelect = document.getElementById('group-select') as HTMLSelectElement;
  const newGroupInput = document.getElementById('new-group-input') as HTMLInputElement;

  // Populate group dropdown
  pp_getAdditionalLinks().then((accountDetails) => {
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

  pp_getAdditionalLinks().then((accountDetails) => {
    if (accountDetails['urls'] && accountDetails['urls'].length > 0) {
      accountDetails['urls'].forEach((item, index) => {
        item.id = index.toString();
      });
      pp_saveAdditionalLinks(accountDetails).then(() => {
        const maxId = Math.max(...accountDetails['urls'].map((item) => parseInt(item.id, 10)));
        sequenceNumber = isNaN(maxId) ? 0 : maxId + 1;
        updatePopupUrls();
      });
    }
  });

  urlForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const urlInput = document.getElementById('url-input') as HTMLInputElement;
    const titleInput = document.getElementById('title-input') as HTMLInputElement;
    const commitType = (event.submitter as HTMLButtonElement).dataset.commitType;
    const url = urlInput.value;
    const title = titleInput.value;
    const group = newGroupInput.value || groupSelect.value;
    const recordId = urlInput.dataset.recordId;

    pp_getAdditionalLinks().then((accountDetails) => {
      if (!accountDetails['urls']) {
        accountDetails['urls'] = [];
      }
      if (commitType === 'save-as-new') {
        const maxId = Math.max(...accountDetails['urls'].map((item) => parseInt(item.id, 10)));
        accountDetails['urls'].push({ id: (maxId + 1).toString(), url: url, title: title, group: group });
      } else if (commitType === 'save') {
        const index = accountDetails['urls'].findIndex((item) => item.id === recordId);
        if (index !== -1) {
          accountDetails['urls'][index] = { id: recordId, url: url, title: title, group: group };
        }
      } else if (commitType === 'delete') {
        accountDetails['urls'] = accountDetails['urls'].filter((item) => item.id !== recordId);
      }

      // Update groups if a new group has been created
      if (newGroupInput.value && !accountDetails['groups'][newGroupInput.value]) {
        accountDetails['groups'][newGroupInput.value] = { sortUrls: false, useContainer: false };
      }

      pp_saveAdditionalLinks(accountDetails);
      updatePopupUrls();
      urlInput.value = '';
      titleInput.value = '';
      newGroupInput.value = '';
      groupSelect.value = 'Default';
      delete urlInput.dataset.recordId;
    });
  });

  document.getElementById('help-button').addEventListener('click', openHelpPage);
});

const updatePopupUrls = () => {
  pp_debugLog('Updating popup urls');
  pp_getAdditionalLinks().then((accountDetails) => {
    const urlList = document.getElementById('urlList');
    urlList.innerHTML = '';
    if (accountDetails['urls']) {
      const sortUrlsSwitch = document.getElementById('sort-urls') as HTMLInputElement;
      const groupedUrls = accountDetails['urls'].reduce((acc, urlItem) => {
        const group = urlItem.group || 'Default';
        if (!acc[group as string]) acc[group as string] = [];
        acc[group as string].push(urlItem);
        return acc;
      }, {});

      const sortedGroups = Object.keys(groupedUrls).sort((a, b) => {
        const comparison = a.localeCompare(b, 'en');
        if (comparison === 0) return 0;
        if (a[0] === a[0].toUpperCase() && b[0] === b[0].toLowerCase()) return 1;
        if (a[0] === a[0].toLowerCase() && b[0] === b[0].toUpperCase()) return -1;
        return comparison;
      });

      for (const group of sortedGroups) {
        const groupDiv = document.createElement('div');
        groupDiv.classList.add('group-title');
        groupDiv.innerText = group;
        urlList.appendChild(groupDiv);

        let urls = groupedUrls[group as string];
        const sortUrls = accountDetails['groups'] && accountDetails['groups'][group as string] && accountDetails['groups'][group as string].sortUrls;
        if (sortUrls) {
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
          elementAccountName.dataset.group = group;
          elementAccountName.draggable = true;
          elementAccountDiv.appendChild(elementAccountName);
          urlList.appendChild(elementAccountDiv);
          pp_debugLog('elementAccountName:', elementAccountName);
        });
      }
    }
  });
};

export const pg_updatePopupUrls = updatePopupUrls;
// function toggleVisibility(visibility: boolean) {
//   const removeUrls = document.getElementsByClassName('remove-url');
//   // Iterate through each remove-url element
//   for (let i = 0; i < removeUrls.length; i++) {
//     const removeUrl = removeUrls[i];
//     // Toggle the visibility by changing the style.display property
//     if (visibility) {
//       (removeUrl as HTMLElement).style.visibility = 'visible';
//     } else {
//       (removeUrl as HTMLElement).style.visibility = 'hidden';
//     }
//   }
// }

const showSingleAccount = (accountId) => {
  const container = document.getElementById('accountConfig');
  pp_getAllAccounts().then((jsonData) => {
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
      pp_getAllAccounts().then((data) => {
        data[accountId].color = selectedColor;
        colorInput.style.color = selectedColor;
        colorInput.style.backgroundColor = selectedColor;
        pp_saveAllAccounts(data).finally((update) => {
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
