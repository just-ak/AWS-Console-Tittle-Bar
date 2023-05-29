export interface AccountDetails {
  id: string;
  color: string;
  background: string;
  headerBackground: string;
  headerColor: string;
}

export interface PopupComms {
  accountId: string;
}

export interface cp_AccountDetails {
  id: string;
  color: string;
  background: string;
  headerBackground: string;
  headerColor: string;
}

const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

export const cp_isChrome = isChrome;
export const pp_isChrome = isChrome;

const isElementLoaded = async (selector) => {
  while (document.querySelector(selector) === null) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return document.querySelector(selector);
};

export const cp_isElementLoaded = isElementLoaded;
export const pp_isElementLoaded = isElementLoaded;

async function putPopupComms(data: PopupComms) {
  return await new Promise((resolve, reject) => {
    if (data.accountId) {
      return chrome.storage.local.set({
        popupcomms: JSON.stringify(data),
      });
    } else {
      reject('No Account Id');
    }
  });
}

export const cp_putPopupComms = putPopupComms;
export const pp_putPopupComms = putPopupComms;

async function getPopupComms() {
  return await new Promise((resolve, reject) =>
    chrome.storage.local.get('popupcomms', (response) => {
      try {
        const popupCom: PopupComms = JSON.parse(response.popupcomms);
        resolve(popupCom);
      } catch (e) {
        reject(e);
      }
    })
  );
}
export const cp_getPopupComms = getPopupComms;
export const pp_getPopupComms = getPopupComms;

async function getAdditionalLinks() {
  return await new Promise(function (resolve, reject) {
    chrome.storage.local.get('jsoninfo', function (response) {
      try {
        const accountDetails = JSON.parse(response.jsoninfo);
        resolve(accountDetails);
      } catch (e) {
        reject(e);
      }
    });
  });
}

export const cp_getAdditionalLinks = getAdditionalLinks;
export const pp_getAdditionalLinks = getAdditionalLinks;

async function saveAdditionalLinks(data) {
  return await new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set({
        jsoninfo: JSON.stringify(data),
      });
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
}

export const cp_saveAdditionalLinks = saveAdditionalLinks;
export const pp_saveAdditionalLinks = saveAdditionalLinks;

async function saveAllAccounts(data) {
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
export const cp_saveAllAccounts = saveAllAccounts;
export const pp_saveAllAccounts = saveAllAccounts;
export const pr_saveAllAccounts = saveAllAccounts;

async function getAccount(accountId) {
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
export const cp_getAccount = getAccount;
export const pp_getAccount = getAccount;

async function getAllAccounts() {
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
export const cp_getAllAccounts = getAllAccounts;
export const pp_getAllAccounts = getAllAccounts;
export const pr_getAllAccounts = getAllAccounts;
