import { getAllAccounts, saveAllAccounts } from "../../common/reference";

export function initializePopupComs() {

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
    });
};
