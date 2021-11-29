const baseElement = document.querySelector('[data-testid="account-detail-menu"]');

let accountId;

if (baseElement) {
    const spanElement = baseElement.querySelectorAll('span')[1];

    if (spanElement) {
        accountId = spanElement.innerText.replace(/-/g, '');
    }
}
if (accountId) {
    getAccountName(accountId)
        .then(accountDetails => {
          console.log('accountId')
            if (document.getElementById('awsconsolelables')) {
                el = document.getElementById('awsconsolelables');
            } else {
                el = document.createElement('div');
                el.id = 'awsconsolelables';
                el.classList.add('awsconsolelables');
                document.querySelectorAll('header')[0].querySelectorAll('nav')[0].prepend(el);
                
            }

            if (document.getElementById('awsconsolelables_name')) {
                elaccname = document.getElementById('awsconsolelables_name');
            } else {
                elaccname = document.createElement('div');
                elaccname.id = 'awsconsolelables_name';
                elaccname.classList.add('name');
                el.appendChild(elaccname);
                
            }

            if (accountDetails.id) {
                elaccname.innerText = accountDetails.id;
            } else {
                elaccname.innerText = 'UnKnown';
            }

            if (accountDetails.color) {
                elaccname.style.setProperty('color', accountDetails.color, 'important');
            }

            if (accountDetails.background) {
                elaccname.style.background = accountDetails.background;
            }

            if (accountDetails.headerBackground) {
                document.querySelectorAll('header')[0].style.background = accountDetails.headerBackground;
            }

            if (accountDetails.headerColor) {
                document.querySelectorAll('[data-testid="awsc-nav-account-menu-button"]')[0].style.setProperty('color', accountDetails.headerColor, 'important');
                document.querySelectorAll('[data-testid="awsc-nav-regions-menu-button"]')[0].style.setProperty('color', accountDetails.headerColor, 'important');
                document.querySelectorAll('[data-testid="awsc-nav-support-menu-button"]')[0].style.setProperty('color', accountDetails.headerColor, 'important');
                document.querySelectorAll('[data-testid="aws-services-list-button"]')[0].style.setProperty('color', accountDetails.headerColor, 'important');
            }
        })
        .catch(e => console.error(e));
} else {
    console.warn('Unable to find Account Id');
}

async function getAccountName(accountId) {
    return await new Promise((resolve, reject) =>
        chrome.storage.local.get('jsoninfo', response => {
            const accountDetails = JSON.parse(response.jsoninfo);

            if (accountDetails && accountDetails.hasOwnProperty(accountId)) {
                resolve(accountDetails[accountId]);
            } else {
                reject(`Unknown Account Id: ${accountId}`);
            }
        })
    );
}
