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
                sortUrlsSwitch.checked = sortUrlsSwitchData === 'true';
                groupTitle.value = groupTitleData;
                groupTitle.dataset.recordId = recordIdData;
                useContainerSwitch.checked = useContainerSwitchData === 'true';

                console.log(`Group to Edit: ${groupTitleData} ${sortUrlsSwitchData} ${useContainerSwitchData} ${recordIdData}`);
            }
        });

        groupForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const commitType = (event.submitter as HTMLButtonElement).dataset.commitType;
            console.log('commitType:', commitType);
            const dataSortUrlsSwitch = sortUrlsSwitch.checked ? 'true' : 'false';
            const dataGroupTitle = groupTitle.value;

            if (dataGroupTitle === '') {
                // alert('Group Title is required');
                return;
            }
            const dataRecordId = groupTitle.dataset.recordId;
            const dataUseContainerSwitch = useContainerSwitch.checked ? 'true' : 'false';
            console.log(`` + dataGroupTitle + ` ` + dataSortUrlsSwitch + ` ` + dataUseContainerSwitch + ` ` + dataRecordId);

            getAdditionalLinks().then((accountDetails) => {

                console.log('accountDetails:', JSON.stringify( accountDetails['groups'], null, 2));
                console.log('recordId:', dataRecordId);

                if (!accountDetails['groups']) {
                    accountDetails['groups'] = [];
                }
                if (commitType === 'save-as-new') {
                    const maxId = Math.max(...accountDetails['groups'].map((item) => parseInt(item.id, 10)));
                    console.log('Creating New Group:', maxId);
                    accountDetails['groups'].push({ id: (maxId + 1).toString(), sortUrlsSwitch: dataSortUrlsSwitch, title: dataGroupTitle, useContainerSwitch: dataUseContainerSwitch });
                } else if (commitType === 'save') {
                    const index = accountDetails['groups'].findIndex((item) => `${item.id}` === `${dataRecordId}`);
                    if (index !== -1) {
                        console.log('Updating Index:', index);
                        accountDetails['groups'][index] = { id: dataRecordId, title: dataGroupTitle, sortUrlsSwitch: dataSortUrlsSwitch, useContainerSwitch: dataUseContainerSwitch };
                    }
                } else if (commitType === 'delete') {
                    console.log('Deleting Group:', dataRecordId);
                    accountDetails['groups'] = accountDetails['groups'].filter((item) =>  `${item.id}` !== `${dataRecordId}`);
                }
                console.log('accountDetails:', JSON.stringify(accountDetails['groups'], null, 2));
                saveAdditionalLinks(accountDetails);
                updatePopupUrls();
                console.log('Group Form Submitted');
                updateGroupListInUrlsSetting();

                // sortUrlsSwitch.checked = false;
                // groupTitle.value = '';
                // useContainerSwitch.checked = false;
                // delete groupTitle.dataset.recordId;
            });
        });
    });
};
