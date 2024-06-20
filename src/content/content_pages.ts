const {
  cp_getAccount,
  cp_putPopupComms,
  cp_isElementLoaded,
  cp_saveAllAccounts,
  cp_AccountDetails,
  cp_getAllAccounts,
} = require('./reference');


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(`Message : ${JSON.stringify(message)}`);
  console.log(`Message : ${JSON.stringify(sender)}`);
  if (message == 'popupcomms') {
    const baseElement = document.querySelector('[data-testid="account-detail-menu"]');
    let accountId;
    if (baseElement) {
      const spanElement = baseElement.querySelectorAll('span')[1];

      if (spanElement) {
        accountId = spanElement.innerText.replace(/-/g, '');
      }
    }
    if (accountId) {
      sendResponse({ title: document.title, accountId: accountId });
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

cp_isElementLoaded('[data-testid="account-detail-menu"]').then((selector) => {
  const baseElement = document.querySelector('[data-testid="account-detail-menu"]');
  let accountId;
  if (baseElement) {
    const spanElement = baseElement.querySelectorAll('span')[1];

    if (spanElement) {
      accountId = spanElement.innerText.replace(/-/g, '');
    }
  }

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
});

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
const accountListCells = document.querySelectorAll('[data-testid="account-list-cell"]');
let newJsonData = {};
accountListCells.forEach((element) => {
  // Query for the <strong> element within this element to get the account name
  const accountNameElement = element.querySelector('strong');
  const accountName = accountNameElement ? accountNameElement.textContent.trim() : 'Unknown Account Name';

  // Query for the div with class 'awsui_key-label-variant_18wu0_1iaas_317' to get the account number and email
  const accountInfoElement = element.querySelector('.awsui_key-label-variant_18wu0_1iaas_317');
  let accountNumber = 'Unknown Account Number';
  if (accountInfoElement) {
    const accountInfoParts = accountInfoElement.textContent.split(' | ');
    accountNumber = accountInfoParts.length > 0 ? accountInfoParts[0] : 'Unknown Account Number';
    // trim the account number to remove any leading or trailing whitespace
    accountNumber = accountNumber.trim();
  }
  console.log(`Account Name: ${accountName}, Account Number: ${accountNumber}`);
  newJsonData[accountNumber] = {
    id: accountName,
    color: '#57f104',
  };
  });
  cp_getAllAccounts().then((jsonData) => {
    cp_saveAllAccounts({...jsonData, ...newJsonData});
    cp_getAllAccounts();  
  });  
}
