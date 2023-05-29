const {
  pp_getAllAccounts,
  pp_saveAdditionalLinks,
  pp_getAdditionalLinks,
  pp_saveAllAccounts,
  pp_isChrome,
} = require('./reference');

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
      showSingleAccount(response.accountId);
    });
  });

  const accurl = document.getElementById('accurl');

  accurl.addEventListener('click', function (e) {
    if ((e.target as HTMLElement).classList.contains('page-choice-https')) {
      const chosenPage = 'https://' + (e.target as HTMLElement).textContent;
      const updating = chrome.tabs.create({ url: chosenPage });
      updating.then(onUpdated, onError);
    }

    if ((e.target as HTMLElement).classList.contains('page-choice-http')) {
      const chosenPage = 'http://' + (e.target as HTMLElement).textContent;
      const updating = chrome.tabs.create({ url: chosenPage });
      updating.then(onUpdated, onError);
    }
    if ((e.target as HTMLElement).classList.contains('page-choice-urls')) {
      const chosenPage = (e.target as HTMLElement).dataset.url;
      const updating = chrome.tabs.create({ url: chosenPage });
      updating.then(onUpdated, onError);
    }
  });
  updatePopupUrls();

  const urlForm = document.getElementById('url-form');

  urlForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const urlInput = document.getElementById('url-input');
    const titleInput = document.getElementById('title-input');

    const url = (urlInput as HTMLFormElement).value;
    const title = (titleInput as HTMLFormElement).value;

    pp_getAdditionalLinks().then((accountDetails) => {
      if (!accountDetails['urls']) {
        accountDetails['urls'] = [];
      }
      accountDetails['urls'].push({ url: url, title: title });
      pp_saveAdditionalLinks(accountDetails);
      updatePopupUrls();
      console.log('URL:', url);
      console.log('Title:', title);
      (urlInput as HTMLFormElement).value = '';
      (titleInput as HTMLFormElement).value = '';
    });
  });
});

const updatePopupUrls = () => {
  pp_getAdditionalLinks().then((accountDetails) => {
    const innerText = '';
    document.getElementById('accurl').innerHTML = '';
    if (accountDetails['urls']) {
      for (const i in accountDetails['urls']) {
        const elementAccountDiv = document.createElement('div');
        elementAccountDiv.style.display = 'flex';
        const elementAccountName = document.createElement('span');
        elementAccountName.classList.add('page-choice-urls');
        elementAccountName.innerText = accountDetails['urls'][i]['title'];
        elementAccountName.dataset.url = accountDetails['urls'][i]['url'];
        const elementRemoveAccountName = document.createElement('span');
        elementRemoveAccountName.classList.add('remove-url');
        elementRemoveAccountName.setAttribute('data-key', accountDetails['urls'][i]['title']);
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
        elementAccountDiv.appendChild(elementAccountName);
        elementAccountDiv.appendChild(elementRemoveAccountName);
        document.getElementById('accurl').appendChild(elementAccountDiv);
        toggleVisibility(false);
      }
    }
  });
  
};

const cogIcon = document.getElementById('awsso-footer');
const accountColorsDiv = document.getElementById('accountColors');
const urlAddDiv = document.getElementById('add-url-container');

accountColorsDiv.style.visibility = 'hidden';
urlAddDiv.style.visibility = 'hidden';

cogIcon.addEventListener('click', function () {
  if (accountColorsDiv.style.visibility === 'hidden') {
    accountColorsDiv.style.visibility = 'unset';
    urlAddDiv.style.visibility = 'unset';
    toggleVisibility(true);
  } else {
    accountColorsDiv.style.visibility = 'hidden';
    urlAddDiv.style.visibility = 'hidden';
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
