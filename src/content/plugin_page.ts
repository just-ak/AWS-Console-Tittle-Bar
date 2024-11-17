const {
  pp_getAllAccounts,
  pp_saveAdditionalLinks,
  pp_getAdditionalLinks,
  pp_saveAllAccounts,
  pp_isChrome,
} = require('./reference');


const cogIcon = document.getElementById('awsso-footer');
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

document.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log('Send');
    chrome.tabs.sendMessage(tabs[0].id, 'popupcomms', (response) => {
      console.log(JSON.stringify(response));
      if (response && response.accountId) {
        showSingleAccount(response.accountId);
      } else {
        console.error('accountId is undefined in response:', response);
      }
    });
  });

  const accurl = document.getElementById('accurl');

  accurl.addEventListener('click', async function (e) {
    if ((e.target as HTMLElement).classList.contains('page-choice-urls')) {
      const chosenPage = (e.target as HTMLElement).dataset.url;
      // console.log('Chosen page:', (e.target as HTMLElement).innerText);
      const containerTitle =  (e.target as HTMLElement).innerText;
      const useContainer = (e.target as HTMLElement).dataset.useContainer; //(document.getElementById('data-use-container') as HTMLInputElement).checked;
      if (accountColorsDiv.style.visibility === 'hidden') {
        console.log('Open new tab');
        try {
          let containerId = null;
          if (useContainer) {
            containerId = await createContainer(containerTitle);
          }
          const updating = browser.tabs.create({ url: chosenPage, cookieStoreId: containerId });
          updating.then(onUpdated, onError);
        } catch (error) {
          console.error('Failed to create container and open tab:', error);
        }
      } else {
        console.log('Edit item');
        (document.getElementById('url-form') as HTMLFormElement).dataset.action = 'edit';
        (document.getElementById('url-input') as HTMLInputElement).value = chosenPage;
        (document.getElementById('title-input') as HTMLInputElement).value = containerTitle;    
        (document.getElementById('use-container') as HTMLInputElement).checked = useContainer==='true'?true:false;
      }
    }
  });

  updatePopupUrls();

  const urlForm = document.getElementById('url-form');
  urlForm.addEventListener('submit', function (event) {
    // console.log(`Event Details ${JSON.stringify(event, null, 2)}`);
    event.preventDefault();

    const urlInput = document.getElementById('url-input') as HTMLInputElement;
    const titleInput = document.getElementById('title-input') as HTMLInputElement;
    const useContainer = (document.getElementById('use-container') as HTMLInputElement).checked;
    const commitType = (event.submitter as HTMLButtonElement).dataset.commitType;

    const url = urlInput.value;
    const title = titleInput.value;

    pp_getAdditionalLinks().then((accountDetails) => {
      if (!accountDetails['urls']) {
        accountDetails['urls'] = [];
      }

      if (commitType === 'new') {
        accountDetails['urls'].push({ url: url, title: title, useContainer: useContainer });
        console.log('New URL:', url);
      } else if (commitType === 'update') {
        console.log('Update URL:', url);
        const index = accountDetails['urls'].findIndex(item => item.title === title);
        
        if (index !== -1) {
          accountDetails['urls'][index] = { url: url, title: title, useContainer: useContainer };
        }
      } else if (commitType === 'delete') {
        console.log('Delete URL:', url);
        accountDetails['urls'] = accountDetails['urls'].filter(item => item.title !== title);
      }

      pp_saveAdditionalLinks(accountDetails);
      updatePopupUrls();
      console.log('URL:', url);
      console.log('Title:', title);
      console.log('Use Container:', useContainer);
      urlInput.value = '';
      titleInput.value = '';
      (document.getElementById('use-container') as HTMLInputElement).checked = false;
    });
  });
});

const updatePopupUrls = () => {
  pp_getAdditionalLinks().then((accountDetails) => {
    const accurl = document.getElementById('accurl');
    accurl.innerHTML = '';
    if (accountDetails['urls']) {
      for (const i in accountDetails['urls']) {
        const urlItem = accountDetails['urls'][i];
        const elementAccountDiv = document.createElement('div');
        elementAccountDiv.style.display = 'flex';
        const elementAccountName = document.createElement('span');
        elementAccountName.classList.add('page-choice-urls');
        elementAccountName.innerText = `${urlItem.title}`;// (${urlItem.useContainer ? 'Container' : 'No Container'})`;
        elementAccountName.dataset.url = urlItem.url;
        elementAccountName.dataset.useContainer = urlItem.useContainer;

        const elementRemoveAccountName = document.createElement('span');
        elementRemoveAccountName.classList.add('remove-url');
        elementRemoveAccountName.setAttribute('data-key', urlItem.title);
        elementRemoveAccountName.innerText = 'X';
        elementRemoveAccountName.addEventListener('click', function (event) {
          const title = (event.target as HTMLElement).dataset.key;
          pp_getAdditionalLinks().then((data) => {
            const urls = data['urls'];
            const newUrls = urls.filter((item) => item.title !== title);
            data['urls'] = newUrls;
            pp_saveAdditionalLinks(data);
            updatePopupUrls();
          });
        });
        elementRemoveAccountName.style.visibility = 'hidden';
        elementAccountDiv.appendChild(elementAccountName);
        //elementAccountDiv.appendChild(elementRemoveAccountName);
        accurl.appendChild(elementAccountDiv);
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
      console.log('Creating container:', name);
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
      // Check if the hidden box is currently hidden
      // if (hiddenBox.style.height === '0px') {
      hiddenBox.style.height = '150px';
    });
    // colorInput.addEventListener('blur', function () {
    //     hiddenBox.style.height = '0px';

    // });

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
