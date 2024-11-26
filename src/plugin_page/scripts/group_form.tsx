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
            }
        });

        groupForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const commitType = (event.submitter as HTMLButtonElement).dataset.commitType;
            const dataSortUrlsSwitch = sortUrlsSwitch.checked ? 'true' : 'false';
            const dataGroupTitle = groupTitle.value;
            if (dataGroupTitle === '') {
                return;
            }
            const dataRecordId = groupTitle.dataset.recordId;
            const dataUseContainerSwitch = useContainerSwitch.checked ? 'true' : 'false';

            getAdditionalLinks().then((accountDetails) => {
                if (!accountDetails['groups']) {
                    accountDetails['groups'] = [];
                }
                if (commitType === 'save-as-new') {
                    const maxId = Math.max(...accountDetails['groups'].map((item) => parseInt(item.id, 10)));
                    accountDetails['groups'].push({ id: (maxId + 1).toString(), sortUrlsSwitch: dataSortUrlsSwitch, title: dataGroupTitle, useContainerSwitch: dataUseContainerSwitch });
                } else if (commitType === 'save') {
                    const index = accountDetails['groups'].findIndex((item) => `${item.id}` === `${dataRecordId}`);
                    if (index !== -1) {
                        accountDetails['groups'][index] = { id: dataRecordId, title: dataGroupTitle, sortUrlsSwitch: dataSortUrlsSwitch, useContainerSwitch: dataUseContainerSwitch };
                    }
                } else if (commitType === 'delete') {
                    accountDetails['groups'] = accountDetails['groups'].filter((item) => `${item.id}` !== `${dataRecordId}`);
                }
                saveAdditionalLinks(accountDetails);
                updatePopupUrls();
                updateGroupListInUrlsSetting();
            });
        });
    });
};
