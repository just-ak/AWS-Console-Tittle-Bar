import { AccountDetails } from './reference';

interface AccountDescriptionParams {
  accountNameColorId: string;
  sampleBannerId: string;
}

export class AccountDescription {
  private accountNameColorId: HTMLFormElement;
  private sampleBannerId: HTMLElement;
  private accountNameColorTabId: HTMLFormElement;
  accountValid = false;
  constructor(params: AccountDescriptionParams) {
    this.accountNameColorId = document.getElementById(params.accountNameColorId) as HTMLFormElement;
    this.accountNameColorTabId = document.getElementById(params.accountNameColorId + '-color') as HTMLFormElement;
    this.sampleBannerId = document.getElementById(params.sampleBannerId);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, 'popupcomms', (response) => {
        if (!chrome.runtime.lastError) {
          if (response) {
            // console.log(JSON.stringify(response));
            if (response.accountId) {
              this.showSingleAccount(response.accountId);
              this.accountValid = true;
            }
          }
        } else {
          this.accountValid = false;
          console.info('AccountDescription error ' + chrome.runtime.lastError.message);
        }
      });
    });
  }
  private showSingleAccount = (accountId: string) => {
    AccountDescription.getAllAccounts()
      .then((jsonData) => {
        const account = jsonData[accountId];
        this.accountNameColorTabId.style.color = account.color;
        this.accountNameColorId.value = account.color;

        this.accountNameColorId.addEventListener('change', (event) => {
          const selectedColor = (event.target as HTMLInputElement).value;

          AccountDescription.getAllAccounts()
            .then((data) => {
              data[accountId].color = selectedColor;
              this.sampleBannerId.style.color = selectedColor;
              this.accountNameColorTabId.style.color = selectedColor;
              AccountDescription.saveAllAccounts(data)
                .then(() => {
                  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, `updateColour:${selectedColor}`, (response) => {
                      if (!chrome.runtime.lastError) {
                        return true;
                      } else {
                        console.info('AccountDescription error #31' + chrome.runtime.lastError.message);
                      }
                    });
                  });
                })
                .catch((e) => {
                  console.error(' showSingleAccount Inner error ' + e);
                });
            })
            .catch((e) => {
              console.error(' showSingleAccount Inner error ' + e);
            });
        });
      })
      .catch((e) => {
        console.error(' showSingleAccount Outer error ' + e);
      });
  };

  static async getAllAccounts() {
    return await new Promise((resolve, reject) =>
      chrome.storage.local.get('jsonaccounts', (response) => {
        if (response) {
          try {
            resolve(JSON.parse(response.jsonaccounts));
          } catch (e) {
            resolve({});
          }
        } else {
          resolve({});
        }
        reject();
      })
    );
  }

  static async saveAllAccounts(data) {
    return await new Promise((resolve, reject) => {
      try {
        chrome.storage.local.set({
          jsonaccounts: JSON.stringify(data),
        });
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }
  static async getAccount(accountId) {
    return await new Promise((resolve, reject) =>
      chrome.storage.local.get('jsonaccounts', (response) => {
        try {
          const accountDetails: AccountDetails = JSON.parse(response.jsonaccounts);
          if (accountDetails && accountDetails[accountId] !== undefined) {
            resolve(accountDetails[accountId]);
          } else {
            reject(`Unknown Account Id: ${accountId}`);
          }
        } catch (e) {
          reject(e);
        }
      })
    );
  }
}
