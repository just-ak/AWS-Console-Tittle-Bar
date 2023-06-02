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
        reject(false);
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

export interface AWSRegion {
  shortName: string;
  name: string;
  code: string;
}

export class AWSRegionManager {
  private awsRegions: AWSRegion[];

  constructor(awsRegions: AWSRegion[]) {
    this.awsRegions = awsRegions;
  }

  findByKey(key: keyof AWSRegion, value: string): AWSRegion | undefined {
    return this.awsRegions.find((region) => region[key] === value);
  }

  findByShortName(shortName: string): AWSRegion | undefined {
    return this.findByKey('shortName', shortName);
  }

  findByName(name: string): AWSRegion | undefined {
    return this.findByKey('name', name);
  }

  findByCode(code: string): AWSRegion | undefined {
    return this.findByKey('code', code);
  }
}

const awsRegions: AWSRegion[] = [
  { shortName: 'Ohio', name: 'US East (Ohio)', code: 'us-east-2' },
  { shortName: 'N. Virginia', name: 'US East (N. Virginia)', code: 'us-east-1' },
  { shortName: 'N. California', name: 'US West (N. California)', code: 'us-west-1' },
  { shortName: 'Oregon', name: 'US West (Oregon)', code: 'us-west-2' },
  { shortName: 'Cpe Town', name: 'Africa (Cape Town)', code: 'af-south-1' },
  { shortName: 'Hone Kong', name: 'Asia Pacific (Hong Kong)', code: 'ap-east-1' },
  { shortName: 'Mumbai', name: 'Asia Pacific (Mumbai)', code: 'ap-south-1' },
  { shortName: 'Osaka-Local', name: 'Asia Pacific (Osaka-Local)', code: 'ap-northeast-3' },
  { shortName: 'Seoul', name: 'Asia Pacific (Seoul)', code: 'ap-northeast-2' },
  { shortName: 'Singapore', name: 'Asia Pacific (Singapore)', code: 'ap-southeast-1' },
  { shortName: 'Sydney', name: 'Asia Pacific (Sydney)', code: 'ap-southeast-2' },
  { shortName: 'Tokyo', name: 'Asia Pacific (Tokyo)', code: 'ap-northeast-1' },
  { shortName: 'Central', name: 'Canada (Central)', code: 'ca-central-1' },
  { shortName: 'Beijing', name: 'China (Beijing)', code: 'cn-north-1' },
  { shortName: 'Ningxia', name: 'China (Ningxia)', code: 'cn-northwest-1' },
  { shortName: 'Frankfurt', name: 'Europe (Frankfurt)', code: 'eu-central-1' },
  { shortName: 'Ireland', name: 'Europe (Ireland)', code: 'eu-west-1' },
  { shortName: 'London', name: 'Europe (London)', code: 'eu-west-2' },
  { shortName: 'Milan', name: 'Europe (Milan)', code: 'eu-south-1' },
  { shortName: 'Paris', name: 'Europe (Paris)', code: 'eu-west-3' },
  { shortName: 'Stockholm', name: 'Europe (Stockholm)', code: 'eu-north-1' },
  { shortName: 'Bahrain', name: 'Middle East (Bahrain)', code: 'me-south-1' },
  { shortName: 'São Paulo', name: 'South America (São Paulo)', code: 'sa-east-1' },
  { shortName: 'US-East', name: 'AWS GovCloud (US-East)', code: 'us-gov-east-1' },
  { shortName: 'US', name: 'AWS GovCloud (US)', code: 'us-gov-west-1' },
];

export const regionManager = new AWSRegionManager(awsRegions);

// // Example usage:
// const regionByShortName = regionManager.findByShortName('Ireland');
// console.log(regionByShortName);

// const regionByName = regionManager.findByName('Asia Pacific (Tokyo)');
// console.log(regionByName);

// const regionByCode = regionManager.findByCode('eu-west-1');
// console.log(regionByCode);
