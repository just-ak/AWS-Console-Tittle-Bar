import { AccountDescription } from './accountDescription';

const jsonElementID = 'jsoninfo';
// const jsonAccElementID = 'jsonaccounts';

function save_options() {
  const jsonTextArea = document.getElementById(jsonElementID) as HTMLTextAreaElement;
  const jsoninfo = jsonTextArea.value;
  chrome.storage.local.set(
    {
      jsoninfo: jsoninfo,
    },
    function () {
      const status = document.getElementById('status');
      status.textContent = 'Options Extras saved.';
      setTimeout(function () {
        status.textContent = '';
      }, 750);
    }
  );
}

function restore_options() {
  chrome.storage.local.get(
    {
      jsoninfo: '{"urls":[{"url":"https://example.com","title":"Example.con"}]}',
    },
    function (options) {
      const jsonTextArea = document.getElementById(jsonElementID) as HTMLTextAreaElement;
      jsonTextArea.value = options.jsoninfo;
    }
  );

  AccountDescription.getAllAccounts()
    .then((data) => {
      showAccounts(data);
      return data;
    })
    .catch((err) => {
      console.log(`Error: AccountDescription #3 ${err}`);
    });
}

// Retrieve JSON data from chrome.storage.local
const showAccounts = (jsonData) => {
  const container = document.getElementById('accountColors');
  const form = document.createElement('form');
  for (const accountId in jsonData) {
    if (jsonData[accountId] !== undefined) {
      console.log(accountId);
      const account = jsonData[accountId];
      console.log(JSON.stringify(account));
      const accountDiv = document.createElement('div');
      const nameLabel = document.createElement('label');
      nameLabel.textContent = account.id + ': ' + accountId;

      accountDiv.appendChild(nameLabel);
      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.value = account.color;
      colorInput.addEventListener('change', function (event) {
        const selectedColor = (event.target as HTMLInputElement).value;
        console.log(`Color : ${selectedColor}`);
        const accountId = (event.target as HTMLInputElement).parentNode.querySelector('label').textContent.split(':')[1].trim();
        console.log(`Acc : ${accountId}`);
        AccountDescription.getAllAccounts()
          .then((data) => {
            data[accountId].color = selectedColor;
            AccountDescription.saveAllAccounts(data);
          })
          .catch((err) => {
            console.log(`Error: AccountDescription #4 ${err}`);
          });
      });

      accountDiv.appendChild(colorInput);
      form.appendChild(accountDiv);
    }
  }
  container.appendChild(form);
};

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
