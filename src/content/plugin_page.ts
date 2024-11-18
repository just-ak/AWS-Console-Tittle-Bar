declare const InstallTrigger: any;

const {
  pp_getAllAccounts,
  pp_saveAdditionalLinks,
  pp_getAdditionalLinks,
  pp_saveAllAccounts,
  pp_isChrome,
} = require('./reference');

const cogIcon = document.getElementById('awsso-header');
const accountColorsDiv = document.getElementById('accountColors');
const urlAddDiv = document.getElementById('add-url-container');
const hiddenBox = document.getElementById('hiddenBox');


accountColorsDiv.style.visibility = 'hidden';
hiddenBox.style.height = '0px';
urlAddDiv.style.height = '0px';
urlAddDiv.style.visibility = 'hidden';


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

  const accurl = document.getElementById('accurl');

  accurl.addEventListener('click', async function (e) {
    if ((e.target as HTMLElement).classList.contains('page-choice-urls')) {
      const chosenPage = (e.target as HTMLElement).dataset.url;
      const containerTitle = (e.target as HTMLElement).innerText;
      const useContainer = (e.target as HTMLElement).dataset.useContainer === 'true' ? true : false;
      if (accountColorsDiv.style.visibility === 'hidden') {
        try {
          let containerId = null;
          if (useContainer) {
            containerId = await createContainer(containerTitle);
            browser.tabs.create({ url: chosenPage, cookieStoreId: containerId }).then(onUpdated, onError);
          } else {
            chrome.tabs.create({ url: chosenPage }).then(onUpdated, onError);
          }
        } catch (error) {
          console.error('Failed to create container and open tab:', error);
        }
      }
      else {
        (document.getElementById('url-form') as HTMLFormElement).dataset.action = 'edit';
        (document.getElementById('url-input') as HTMLInputElement).value = chosenPage;
        (document.getElementById('title-input') as HTMLInputElement).value = containerTitle;
        (document.getElementById('use-container') as HTMLInputElement).checked = useContainer;
      }
    }
  });

  accurl.addEventListener('dragstart', function (e) {
    if ((e.target as HTMLElement).classList.contains('page-choice-urls')) {
      e.dataTransfer.setData('text/plain', (e.target as HTMLElement).dataset.url);
      e.dataTransfer.effectAllowed = 'move';
    }
  });

  accurl.addEventListener('dragover', function (e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  });

  accurl.addEventListener('drop', function (e) {
    e.preventDefault();
    const draggedUrl = e.dataTransfer.getData('text/plain');
    const target = e.target as HTMLElement;
    if (target.classList.contains('page-choice-urls')) {
      const targetUrl = target.dataset.url;
      pp_getAdditionalLinks().then((accountDetails) => {
        const urls = accountDetails['urls'];
        const draggedIndex = urls.findIndex(item => item.url === draggedUrl);
        const targetIndex = urls.findIndex(item => item.url === targetUrl);
        if (draggedIndex !== -1 && targetIndex !== -1) {
          const [draggedItem] = urls.splice(draggedIndex, 1);
          urls.splice(targetIndex, 0, draggedItem);
          pp_saveAdditionalLinks(accountDetails).then(updatePopupUrls);
        }
      });
    }
  });

  const groupSelect = document.getElementById('group-select') as HTMLSelectElement;
  const newGroupInput = document.getElementById('new-group-input') as HTMLInputElement;

  // Populate group dropdown
  pp_getAdditionalLinks().then((accountDetails) => {
    const groups = new Set(accountDetails['urls'].map(url => url.group || 'Default'));
    groups.forEach(group => {
      const option = (document.createElement('option') as HTMLOptionElement );
      option.value = group as string;
      option.text = group as string;
      groupSelect.add(option);
    });
  });

  updatePopupUrls();

  const urlForm = document.getElementById('url-form');
  urlForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const urlInput = document.getElementById('url-input') as HTMLInputElement;
    const titleInput = document.getElementById('title-input') as HTMLInputElement;
    const useContainer = (document.getElementById('use-container') as HTMLInputElement).checked;
    const commitType = (event.submitter as HTMLButtonElement).dataset.commitType;
    const url = urlInput.value;
    const title = titleInput.value;
    const group = newGroupInput.value || groupSelect.value;

    pp_getAdditionalLinks().then((accountDetails) => {
      if (!accountDetails['urls']) {
        accountDetails['urls'] = [];
      }
      if (commitType === 'new') {
        accountDetails['urls'].push({ url: url, title: title, useContainer: useContainer, group: group });
      } else if (commitType === 'update') {
        const index = accountDetails['urls'].findIndex(item => item.url === url);
        if (index !== -1) {
          accountDetails['urls'][index] = { url: url, title: title, useContainer: useContainer, group: group };
        } else {
          accountDetails['urls'].push({ url: url, title: title, useContainer: useContainer, group: group });
        }
      } else if (commitType === 'delete') {
        accountDetails['urls'] = accountDetails['urls'].filter(item => item.url !== url);
      }
      pp_saveAdditionalLinks(accountDetails);
      updatePopupUrls();
      urlInput.value = '';
      titleInput.value = '';
      newGroupInput.value = '';
      groupSelect.value = 'Default';
      (document.getElementById('use-container') as HTMLInputElement).checked = false;
    });
  });

  document.getElementById('help-button').addEventListener('click', openHelpPage);
});

const updatePopupUrls = () => {
  pp_getAdditionalLinks().then((accountDetails) => {
    const accurl = document.getElementById('accurl');
    accurl.innerHTML = '';
    if (accountDetails['urls']) {
      const groupedUrls = accountDetails['urls'].reduce((acc, urlItem) => {
        const group = urlItem.group || 'Default';
        if (!acc[group]) acc[group] = [];
        acc[group].push(urlItem);
        return acc;
      }, {});

      for (const group in groupedUrls) {
        const groupDiv = document.createElement('div');
        groupDiv.classList.add('group-title');
        groupDiv.innerText = group;
        accurl.appendChild(groupDiv);

        groupedUrls[group].forEach(urlItem => {
          const elementAccountDiv = document.createElement('div');
          elementAccountDiv.style.display = 'flex';
          const elementAccountName = document.createElement('span');
          elementAccountName.classList.add('page-choice-urls');
          elementAccountName.innerText = `${urlItem.title}`;
          elementAccountName.dataset.url = urlItem.url;
          elementAccountName.dataset.useContainer = urlItem.useContainer;
          elementAccountName.draggable = true;
          elementAccountDiv.appendChild(elementAccountName);
          accurl.appendChild(elementAccountDiv);
        });
      }
    }
  });
};

const getColorFromName = (name: string): string => {
  const colors = [
    "blue", "turquoise", "green", "yellow", "orange", "red", "pink", "purple", "toolbar"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const getIconFromName = (name: string): string => {
  const icons = [
    "fingerprint", "briefcase", "dollar", "cart", "circle", "gift", "vacation",
    "food", "fruit", "pet", "tree", "chill", "fence"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % icons.length;
  return icons[index];
};

const createContainer = (name: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (typeof browser !== 'undefined' && browser.contextualIdentities) {
      const color = getColorFromName(name);
      const icon = getIconFromName(name);
      browser.contextualIdentities.create({
        name: `${name} - AWS Console Titlebar`,
        color: color,
        icon: icon
      }).then((identity) => {
        resolve(identity.cookieStoreId);
      }).catch((error) => {
        console.error('Error creating container:', error);
        reject(error);
      });
    } else {
      // Fallback for browsers that do not support contextualIdentities API
      console.error('contextualIdentities API is not supported');
      reject('contextualIdentities API is not supported');
    }
  });
};

cogIcon.addEventListener('click', function () {
  if (accountColorsDiv.style.visibility === 'hidden') {
    accountColorsDiv.style.visibility = 'unset';
    urlAddDiv.style.visibility = 'unset';
    urlAddDiv.style.height = '150px';
    (document.getElementById('url-form') as HTMLFormElement).dataset.action = 'new';
    toggleVisibility(true);
  } else {
    accountColorsDiv.style.visibility = 'hidden';
    urlAddDiv.style.visibility = 'hidden';
    urlAddDiv.style.height = '0px';
    hiddenBox.style.height = '0px';
    toggleVisibility(false);
  }
});

function toggleVisibility(visibility: boolean) {
  const removeUrls = document.getElementsByClassName('remove-url');
  // Iterate through each remove-url element
  for (let i = 0; i < removeUrls.length; i++) {
    const removeUrl = removeUrls[i];
    // Toggle the visibility by changing the style.display property
    if (visibility) {
      (removeUrl as HTMLElement).style.visibility = 'visible';
    } else {
      (removeUrl as HTMLElement).style.visibility = 'hidden';
    }
  }
}

const showSingleAccount = (accountId) => {
  const container = document.getElementById('accountColors');
  pp_getAllAccounts().then((jsonData) => {
    const form = document.createElement('form');
    const account = jsonData[accountId];
    const accountDiv = document.createElement('div');
    const nameLabel = document.createElement('label');
    nameLabel.textContent = account.id + ': ' + accountId;
    accountDiv.appendChild(nameLabel);
    const colorInput = document.createElement('input');
    colorInput.style.color = account.color;
    colorInput.style.backgroundColor = account.color;
    colorInput.dataset.coloris = '';
    colorInput.value = account.color;

    colorInput.addEventListener('focus', function () {
      hiddenBox.style.height = '150px';
    });

    colorInput.addEventListener('change', function (event) {
      const selectedColor = (event.target as HTMLInputElement).value;
      const accountId = (event.target as HTMLInputElement).parentNode.querySelector('label').textContent.split(':')[1].trim();
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
