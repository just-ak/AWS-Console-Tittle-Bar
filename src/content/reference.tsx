import { AccountDescription } from './accountDescription';
export interface PopupComms {
  accountId: string;
}

export const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

interface RegionalWarningConfig {
  regionWarning: string;
  onOff: boolean;
}

interface RegionColorConfig {
  regionWarning: string;
  color: string;
}
interface AccountRegionColors {
  accountId: string;
  regionColors: RegionColorConfig[];
}
export interface AccountDetails {
  id: string;
  color: string;
  background: string;
  headerBackground: string;
  headerColor: string;
}

export interface Account {
  id: string;
  color: string;
}

export interface AccountNumbers {
  [accountId: string]: Account;
}

export interface linkDetail {
  url: string;
  title: string;
  currentTab: boolean;
}

export interface Config {
  RegionWarnings: RegionalWarningConfig[];
  AccountDetails: AccountDetails[];
  RegionColors: {
    allRegions: boolean;
    allAccounts: boolean;
    banner: boolean;
    regionColors: RegionColorConfig[];
  };
  AccountRegionColors: AccountRegionColors[];
  Links: {
    linkDetails: linkDetail[];
  };
}

export class AWSConsoleTitleBar {
  static colorThreshold = 40;
  static popFactor = 1.5;
  static onColor = 'white';
  static offColor = 'lightgreen';
  static emptyConfig: Config = {
    RegionWarnings: [],
    AccountDetails: [],
    RegionColors: {
      allRegions: false,
      allAccounts: false,
      banner: false,
      regionColors: [],
    },
    AccountRegionColors: [],
    Links: {
      linkDetails: [],
    },
  };
  // This is a singleton
  // config should always be accessed via instance
  // e.g.
  //   AWSConsoleTitleBar.instance.config
  //
  static instance: AWSConsoleTitleBar;
  static accountDescription: AccountDescription;
  config: Config = AWSConsoleTitleBar.emptyConfig;

  static async get(): Promise<boolean> {
    if (!AWSConsoleTitleBar.instance) {
      //chrome.storage.local.clear();
      AWSConsoleTitleBar.instance = new AWSConsoleTitleBar();
      AWSConsoleTitleBar.accountDescription = new AccountDescription({
        accountNameColorId: 'cbr-100',
        sampleBannerId: 'awsBannerAccountName',
      });
    }

    return await new Promise(function (resolve) {
      chrome.storage.local.get('awsConsoleTitleBar', function (response) {
        try {
          AWSConsoleTitleBar.instance.config = JSON.parse(response.awsConsoleTitleBar);
          resolve(true);
        } catch (e) {
          resolve(true);
        }
      });
    });
  }

  static async save() {
    console.log('Saving');
    console.log(JSON.stringify(AWSConsoleTitleBar.instance.config));
    return await new Promise((resolve, reject) => {
      try {
        chrome.storage.local.set({
          awsConsoleTitleBar: JSON.stringify(AWSConsoleTitleBar.instance.config),
        });
        // console.log('Saved');
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
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
