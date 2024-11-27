import { IAdditionalLinks, IGroupRecord, saveAdditionalLinks } from "../../common/reference";

export function upgradeManagement(accountDetails) {
    let newAccountDetails: IAdditionalLinks; // = accountDetails;
    switch (accountDetails['version']) {
        case undefined:
            // Upgrade to version 5.5.5.1
            newAccountDetails = upgradeToVersion5_5_5_1(accountDetails);
            break;
        default:
            newAccountDetails = accountDetails;
            break;
    }
    return newAccountDetails;
};

function upgradeToVersion5_5_5_1(accountDetails) {
    console.log('Upgrading to version: 5.5.5.1');
    if (accountDetails['groups'] === undefined) {
        accountDetails['groups'] = [];
    }
    // identify if groups contains an array or objects, if objects then convert to array
    if (!Array.isArray(accountDetails['groups'])) {
        accountDetails['groups'] = [];
    }
    console.log('Upgraded to version - A');

    let maxUrls = (Math.max(...accountDetails['urls'].map((item) => parseInt(item.id, 10))) + 1) || 0;
    accountDetails['urls'].forEach((url) => {
        if (!url.id) {
            url.id = (maxUrls++).toString();
        }
    });
    console.log('Upgraded to version - B');

    accountDetails['groups'].forEach((group) => {
        if (!group.id) {
            group.id = (Math.max(...accountDetails['groups'].map((item) => parseInt(item.id, 10))) + 1).toString();
        }
    });
    console.log('Upgraded to version - C');
    const uniqueValuesArray = [...new Set(accountDetails['urls'].map(obj => obj.group))];
    if (uniqueValuesArray.length > 0) {
        let maxGroupIndex = accountDetails['groups'].length === 0 ? 0 : Math.max(...accountDetails['groups'].map((item: IGroupRecord) => parseInt(item.id, 10))) + 1;
        uniqueValuesArray.forEach((group) => {
            const tempGroup = group.toString().trim().length === 0 ? 'Default' : group;
            const groupIndex = accountDetails['groups'].findIndex((item) => item.title === tempGroup);
            if (groupIndex === -1) {
                accountDetails['groups'].push({ id: maxGroupIndex++, title: tempGroup, sortUrlsSwitch: 'false', useContainerSwitch: 'false' });
            }
        });
    }
    console.log('Upgraded to version - D');

    if (!accountDetails['groups'] ||
        (accountDetails['groups'] && accountDetails['groups'].length === 0)) {
        accountDetails['groups'].push({ id: 0, title: 'Default', sortUrlsSwitch: 'false', useContainerSwitch: 'false' });
    }
    console.log('Upgraded to version - E');

    accountDetails['urls'].map((urlItem) => {
        if (!urlItem.groupId) {
            const groupIndex = accountDetails['groups'].findIndex((item) => item.title === urlItem.group);
            if (groupIndex !== -1) {
                urlItem.groupId = accountDetails['groups'][groupIndex].id;
            } else {
                urlItem.groupId = '0';
            }
        }
    });
    accountDetails['version'] = '5.5.5.1';
    accountDetails['preferences'] = {
        awsConsole: {
            compressMode: false,
        }
    };
    saveAdditionalLinks(accountDetails);
    return accountDetails;
}

