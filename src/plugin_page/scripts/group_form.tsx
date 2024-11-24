
import {
    cogIcon,
    urlList,
    groupForm,
    sortUrlsSwitch,
    groupTitle,
    useContainerSwitch,
} from './dom';
// 
import { updatePopupUrls } from './plugin_page';

import { getAdditionalLinks, saveAdditionalLinks } from '../../common/reference';
import { updateGroupListInUrlsSetting } from './url_form';
// import { updateGroupListInUrlsSetting } from './url_form';

export function initializeGroupForm() {
    document.addEventListener('DOMContentLoaded', function () {

        urlList.addEventListener('click', async function (e) {
            if ((e.target as HTMLElement).classList.contains('group-title')) {
                const sortUrlsSwitchData = (e.target as HTMLElement).dataset.sortUrlsSwitch;
                const useContainerSwitchData = (e.target as HTMLElement).dataset.useContainerSwitch;
                const recordIdData = (e.target as HTMLElement).dataset.recordId;
                const groupTitleData = (e.target as HTMLElement).innerText;
                sortUrlsSwitch.value = sortUrlsSwitchData;
                groupTitle.value = groupTitleData;
                groupTitle.dataset.recordId = recordIdData;
                useContainerSwitch.value = useContainerSwitchData;

                console.log(`Group to Edit: ${groupTitleData} ${sortUrlsSwitchData} ${useContainerSwitchData} ${recordIdData}`);
            }
        });

        groupForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const commitType = (event.submitter as HTMLButtonElement).dataset.commitType;
            console.log('commitType:', commitType);
            const dataSortUrlsSwitch = sortUrlsSwitch.value;
            const dataGroupTitle = groupTitle.value;
            const dataRecordId = groupTitle.dataset.recordId;
            const dataUseContainerSwitch = useContainerSwitch.value;
            console.log('sortUrlsSwitch:', sortUrlsSwitch);
            getAdditionalLinks().then((accountDetails) => {
                console.log('accountDetails:', accountDetails);
                console.log('recordId:', dataRecordId);
                if (!accountDetails['groups']) {
                    accountDetails['groups'] = [];
                }
                if (commitType === 'save-as-new') {
                    const maxId = Math.max(...accountDetails['groups'].map((item) => parseInt(item.id, 10)));
                    accountDetails['groups'].push({ id: (maxId + 1).toString(), sortUrlsSwitch: dataSortUrlsSwitch, title: dataGroupTitle, useContainerSwitch: dataUseContainerSwitch });
                } else if (commitType === 'save') {
                    const index = accountDetails['groups'].findIndex((item) => item.id === dataRecordId);
                    if (index !== -1) {
                        accountDetails['groups'][index] = { id: dataRecordId, title: dataGroupTitle, sortUrlsSwitch: dataSortUrlsSwitch, useContainerSwitch: dataUseContainerSwitch };
                    }
                } else if (commitType === 'delete') {
                    accountDetails['groups'] = accountDetails['groups'].filter((item) => item.id !== dataRecordId);
                }
                console.log('accountDetails:', accountDetails);
                saveAdditionalLinks(accountDetails);
                updatePopupUrls();
                console.log('Group Form Submitted');
                updateGroupListInUrlsSetting();

                sortUrlsSwitch.value = '';
                groupTitle.value = '';
                useContainerSwitch.value = '';
                delete groupTitle.dataset.recordId;
            });
        });
    });
};
