class PopupCommsManager {
  static async putPopupComms(data) {
    return new Promise((resolve, reject) => {
      if (data.accountId) {
        chrome.storage.local.set(
          {
            popupcomms: JSON.stringify(data),
          },
          () => {
            resolve(true);
          }
        );
      } else {
        reject('No Account Id');
      }
    });
  }

  static async getPopupComms() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get('popupcomms', (response) => {
        try {
          const popupCom = JSON.parse(response.popupcomms);
          resolve(popupCom);
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}

export const cp_PopupCommsManager = PopupCommsManager;
export const pp_PopupCommsManager = PopupCommsManager;
