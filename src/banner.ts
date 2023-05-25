const baseElement = document.querySelector('[data-testid="account-detail-menu"]');

let accountId;

interface AccountDetails {
    id: string;
    color: string;
    background: string;
    headerBackground: string;
    headerColor: string;
}

if (baseElement) {
    const spanElement = baseElement.querySelectorAll('span')[1];

    if (spanElement) {
        accountId = spanElement.innerText.replace(/-/g, '');
    }
}
if (accountId) {
    getAccountName(accountId)
        .then((accountDetails: AccountDetails) => {

          console.log('accountId')
            let elementAWSConsoleTables: HTMLElement;
            if (document.getElementById('awsconsolelables')) {
                elementAWSConsoleTables = document.getElementById('awsconsolelables');
            } else if (document.getElementById('nav-usernameMenu')) {
              elementAWSConsoleTables = document.getElementById('nav-usernameMenu');
            } else {
                elementAWSConsoleTables = document.createElement('div')  as HTMLDivElement;
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
                (document.querySelectorAll('[data-testid="awsc-nav-account-menu-button"]')[0] as HTMLDivElement).style.setProperty('color', accountDetails.headerColor, 'important');
                (document.querySelectorAll('[data-testid="awsc-nav-regions-menu-button"]')[0] as HTMLDivElement).style.setProperty('color', accountDetails.headerColor, 'important');
                (document.querySelectorAll('[data-testid="awsc-nav-support-menu-button"]')[0] as HTMLDivElement).style.setProperty('color', accountDetails.headerColor, 'important');
                (document.querySelectorAll('[data-testid="aws-services-list-button"]')[0] as HTMLDivElement).style.setProperty('color', accountDetails.headerColor, 'important');
            }
        })
        .catch(e => console.error(e));
} else {
    console.warn('Unable to find Account Id');
}

async function getAccountName(accountId) {
    return await new Promise((resolve, reject) =>
        chrome.storage.local.get('jsoninfo', response => {
            const accountDetails: AccountDetails = JSON.parse(response.jsoninfo);
            if (accountDetails && accountDetails.hasOwnProperty(accountId)) {
                resolve(accountDetails[accountId]);
            } else {
                reject(`Unknown Account Id: ${accountId}`);
            }
        })
    );
}
