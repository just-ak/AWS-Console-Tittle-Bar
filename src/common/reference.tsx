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


export interface IGroupRecord {
  id: string;
  title: string;
  sortUrlsSwitch: string;
  useContainerSwitch: string;
}


export function onUpdated(tab) {
  console.log(`Updated tab: ${tab.id}`);
}

export function onError(error) {
  console.log(`Error: ${error}`);
}



export const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);



const DEBUG = false; // Set this to false to disable debug logs

export function debugLog(message: string, ...optionalParams: any[]) {
  if (DEBUG) {
    console.log(message, ...optionalParams);
  }
}


export const isElementLoaded = async (selector) => {
  while (document.querySelector(selector) === null) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return document.querySelector(selector);
};


export async function putPopupComms(data: PopupComms) {
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

export async function getPopupComms() {
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

export async function getAdditionalLinks() {
  return await new Promise(function (resolve, reject) {
    chrome.storage.local.get('jsoninfo', function (response) {
      try {
        const accountDetails = JSON.parse(response.jsoninfo);
        resolve(accountDetails);
      } catch (e) {
        console.error(`Error in getAdditionalLinks: ${e}`);
        const accountDetails ={urls:[]};
        resolve(accountDetails);
      }
    });
  });
}



export async function saveAdditionalLinks(data) {
  return await new Promise((resolve, reject) => {
    try {
      data.version = '5.5.1.1';
      chrome.storage.local.set({
        jsoninfo: JSON.stringify(data),
      });
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });
}

export async function saveAllAccounts(data) {
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
export async function getAccount(accountId) {
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


export async function getAllAccounts() {
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
