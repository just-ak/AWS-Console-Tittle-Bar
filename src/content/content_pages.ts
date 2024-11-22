const {
  cp_getAccount,
  cp_putPopupComms,
  cp_isElementLoaded,
  cp_saveAllAccounts,
  cp_AccountDetails,
  cp_getAllAccounts,
} = require('./reference');


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // console.log(`Message : ${JSON.stringify(message)}`);
  // console.log(`Message : ${JSON.stringify(sender)}`);
  if (message == 'popupcomms') {
    // console.log(`Popup Comms  A1`);
    const accountNumber = getAWSUserInfoAccountNumber();
    if (accountNumber) {
      sendResponse({ title: document.title, accountId: accountNumber });
    }
  }
  if ((message as string).startsWith('updateColour')) {
    let elementAccountName: HTMLElement;
    if (document.getElementById('awsconsolelables_name')) {
      elementAccountName = document.getElementById('awsconsolelables_name');
      elementAccountName.style.setProperty('color', (message as string).split(':')[1], 'important');
    }
  }
  //return { title: document.title , accountId: accountId};
});

//   /$$$$$$  /$$      /$$  /$$$$$$        /$$   /$$                                             /$$       /$$$$$$$
//  /$$__  $$| $$  /$ | $$ /$$__  $$      | $$$ | $$                                            | $$      | $$__  $$
// | $$  \ $$| $$ /$$$| $$| $$  \__/      | $$$$| $$  /$$$$$$   /$$$$$$  /$$$$$$/$$$$   /$$$$$$ | $$      | $$  \ $$ /$$$$$$   /$$$$$$   /$$$$$$
// | $$$$$$$$| $$/$$ $$ $$|  $$$$$$       | $$ $$ $$ /$$__  $$ /$$__  $$| $$_  $$_  $$ |____  $$| $$      | $$$$$$$/|____  $$ /$$__  $$ /$$__  $$
// | $$__  $$| $$$$_  $$$$ \____  $$      | $$  $$$$| $$  \ $$| $$  \__/| $$ \ $$ \ $$  /$$$$$$$| $$      | $$____/  /$$$$$$$| $$  \ $$| $$$$$$$$
// | $$  | $$| $$$/ \  $$$ /$$  \ $$      | $$\  $$$| $$  | $$| $$      | $$ | $$ | $$ /$$__  $$| $$      | $$      /$$__  $$| $$  | $$| $$_____/
// | $$  | $$| $$/   \  $$|  $$$$$$/      | $$ \  $$|  $$$$$$/| $$      | $$ | $$ | $$|  $$$$$$$| $$      | $$     |  $$$$$$$|  $$$$$$$|  $$$$$$$
// |__/  |__/|__/     \__/ \______/       |__/  \__/ \______/ |__/      |__/ |__/ |__/ \_______/|__/      |__/      \_______/ \____  $$ \_______/
//                                                                                                                            /$$  \ $$
//                                                                                                                           |  $$$$$$/
//                                                                                                                            \______/
//       

function addAccountDetailsToPage(accountId: string) {
  if (accountId) {
    console.log(`Account No Found on New Page ${accountId}`);
    cp_getAccount(accountId)
      .then((accountDetails: AccountDetails) => {
        let elementAWSConsoleTables: HTMLElement;
        if (document.getElementById('awsconsolelables')) {
          elementAWSConsoleTables = document.getElementById('awsconsolelables');
        } else if (document.getElementById('nav-usernameMenu')) {
          elementAWSConsoleTables = document.getElementById('nav-usernameMenu');
        } else {
          elementAWSConsoleTables = document.createElement('div') as HTMLDivElement;
          elementAWSConsoleTables.id = 'awsconsolelables';
          elementAWSConsoleTables.classList.add('awsconsolelables');
          document.querySelectorAll('header')[0].querySelectorAll('nav')[0].prepend(elementAWSConsoleTables);
        }
        let elementAccountName: HTMLElement;
        if (document.getElementById('awsconsolelables_name')) {
          elementAccountName = document.getElementById('awsconsolelables_name');
        } else {
          elementAccountName = document.createElement('div') as HTMLDivElement;
          elementAccountName.id = 'awsconsolelables_name';
          elementAccountName.classList.add('name');
          elementAWSConsoleTables.appendChild(elementAccountName);
        }

        if (accountDetails.id) {
          elementAccountName.innerText = accountDetails.id;
        } else {
          elementAccountName.innerText = 'UnKnown';
        }

        if (accountDetails.color) {
          elementAccountName.style.setProperty('color', (accountDetails as AccountDetails).color, 'important');
        }

        if (accountDetails.background) {
          elementAccountName.style.background = (accountDetails as AccountDetails).background;
        }

        if (accountDetails.headerBackground) {
          document.querySelectorAll('header')[0].style.background = (accountDetails as AccountDetails).headerBackground;
        }

        if (accountDetails.headerColor) {
          (document.querySelectorAll('[data-testid="awsc-nav-account-menu-button"]')[0] as HTMLDivElement).style.setProperty(
            'color',
            accountDetails.headerColor,
            'important'
          );
          (document.querySelectorAll('[data-testid="awsc-nav-regions-menu-button"]')[0] as HTMLDivElement).style.setProperty(
            'color',
            accountDetails.headerColor,
            'important'
          );
          (document.querySelectorAll('[data-testid="awsc-nav-support-menu-button"]')[0] as HTMLDivElement).style.setProperty(
            'color',
            accountDetails.headerColor,
            'important'
          );
          (document.querySelectorAll('[data-testid="aws-services-list-button"]')[0] as HTMLDivElement).style.setProperty(
            'color',
            accountDetails.headerColor,
            'important'
          );
        }
      })
      .catch((e) => console.error(e));
  } else {
    console.warn('Unable to find Account Id');
  }

}
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

function getAWSUserInfoAccountNumber(): string | null {
  const cookieValue = getCookie('aws-userInfo');
  if (cookieValue) {
    try {
      const userInfo = JSON.parse(decodeURIComponent(cookieValue));
      const arn = userInfo.arn;
      if (arn) {
        const match = arn.match(/arn:aws:sts::(\d+):/);
        return match ? match[1] : null;
      }
    } catch (error) {
      console.error('Error parsing aws-userInfo cookie:', error);
      return null;
    }
  }
  return null;
}

if (!window.location.href.includes('awsapps.com/start')) {
  cp_isElementLoaded('[data-testid="awsc-nav-regions-menu-button"]').then((selector) => {
    const accountNumber = getAWSUserInfoAccountNumber();
    addAccountDetailsToPage(accountNumber);
  });
}

//   /$$$$$$  /$$      /$$  /$$$$$$         /$$$$$$                                          /$$                  /$$$$$$   /$$$$$$   /$$$$$$        /$$$$$$$
//  /$$__  $$| $$  /$ | $$ /$$__  $$       /$$__  $$                                        | $$                 /$$__  $$ /$$__  $$ /$$__  $$      | $$__  $$
// | $$  \ $$| $$ /$$$| $$| $$  \__/      | $$  \__/  /$$$$$$  /$$$$$$$   /$$$$$$$  /$$$$$$ | $$  /$$$$$$       | $$  \__/| $$  \__/| $$  \ $$      | $$  \ $$ /$$$$$$   /$$$$$$   /$$$$$$
// | $$$$$$$$| $$/$$ $$ $$|  $$$$$$       | $$       /$$__  $$| $$__  $$ /$$_____/ /$$__  $$| $$ /$$__  $$      |  $$$$$$ |  $$$$$$ | $$  | $$      | $$$$$$$/|____  $$ /$$__  $$ /$$__  $$
// | $$__  $$| $$$$_  $$$$ \____  $$      | $$      | $$  \ $$| $$  \ $$|  $$$$$$ | $$  \ $$| $$| $$$$$$$$       \____  $$ \____  $$| $$  | $$      | $$____/  /$$$$$$$| $$  \ $$| $$$$$$$$
// | $$  | $$| $$$/ \  $$$ /$$  \ $$      | $$    $$| $$  | $$| $$  | $$ \____  $$| $$  | $$| $$| $$_____/       /$$  \ $$ /$$  \ $$| $$  | $$      | $$      /$$__  $$| $$  | $$| $$_____/
// | $$  | $$| $$/   \  $$|  $$$$$$/      |  $$$$$$/|  $$$$$$/| $$  | $$ /$$$$$$$/|  $$$$$$/| $$|  $$$$$$$      |  $$$$$$/|  $$$$$$/|  $$$$$$/      | $$     |  $$$$$$$|  $$$$$$$|  $$$$$$$
// |__/  |__/|__/     \__/ \______/        \______/  \______/ |__/  |__/|_______/  \______/ |__/ \_______/       \______/  \______/  \______/       |__/      \_______/ \____  $$ \_______/
//                                                                                                                                                                      /$$  \ $$
//                                                                                                                                                                     |  $$$$$$/
//                                                                                                                                                                      \______/

if (window.location.href.includes('awsapps.com/start')) {
  const handleAccountList = (dataBlock: Element) => {
    let newJsonData = {};
    Array.from(dataBlock.children).forEach((element) => {
      const accountNameElement = element.querySelector('strong').querySelector('div').innerHTML;
      const accountName = accountNameElement ? accountNameElement : 'Unknown Account Name';

      let accountNumber = 'Unknown Account Number';
      element.querySelectorAll('div').forEach((divElement) => {
        if (divElement.textContent.includes(' | ')) {
          // console.log(`Found div with " | ": ${divElement.textContent}`);
          const accountInfoParts = divElement.textContent.split(' | ');
          accountNumber = accountInfoParts.length > 0 ? accountInfoParts[0] : 'Unknown Account Number';
          accountNumber = accountNumber.trim();
        }
      });
      console.log(`Account Name: ${accountName}, Account Number: ${accountNumber}`);
      newJsonData[accountNumber] = {
        id: accountName,
        color: '#57f104',
      };
    });
    cp_getAllAccounts().then((jsonData) => {
      cp_saveAllAccounts({ ...jsonData, ...newJsonData });
      cp_getAllAccounts();
    });
  }

  // Create a MutationObserver to watch for changes in the DOM
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        const accountListElement = document.querySelector('div[data-testid="account-list"]');
        if (accountListElement) {
          observer.disconnect();
          handleAccountList(accountListElement);
        }
      }
    }
  });
  // Start observing the document body for child list changes
  observer.observe(document.body, { childList: true, subtree: true });
}

