
const {
    pg_cogIcon,
} = require('./dom');

const { pg_updatePopupUrls } = require('./plugin_page');
const { pg_getAdditionalLinks, pg_saveAdditionalLinks } = require('../../common/reference');
const { pg_updateGroupList } = require('./url_form');

export function initializeGroupForm() {
    document.addEventListener('DOMContentLoaded', function () {
        const urlList = document.getElementById('urlList');
        urlList.addEventListener('click', async function (e) {
            if ((e.target as HTMLElement).classList.contains('group-title')) {
                const sortUrlsSwitch = (e.target as HTMLElement).dataset.url;
                const useContainerSwitch = (e.target as HTMLElement).dataset.recordId;
                const groupTitle = (e.target as HTMLElement).innerText;

                (document.getElementById('sort-urls') as HTMLSelectElement).value = sortUrlsSwitch;
                (document.getElementById('url-input') as HTMLSelectElement).value = groupTitle;
                (document.getElementById('use-container') as HTMLSelectElement).value = useContainerSwitch;
            }
        });
    });


    const sortUrlsSwitch = document.getElementById('sort-urls') as HTMLInputElement;
    const useContainerSwitch = document.getElementById('use-container') as HTMLInputElement;
    sortUrlsSwitch.addEventListener('change', function () {
        const selectedGroup = (document.getElementById('group-select') as HTMLSelectElement).value;
        pg_getAdditionalLinks().then((accountDetails) => {
            if (!accountDetails['groups']) {
                accountDetails['groups'] = {};
            }
            if (!accountDetails['groups'][selectedGroup]) {
                accountDetails['groups'][selectedGroup] = {};
            }
            accountDetails['groups'][selectedGroup].sortUrls = sortUrlsSwitch.checked;
            accountDetails['groups'][selectedGroup].useContainer = useContainerSwitch.checked;
            pg_saveAdditionalLinks(accountDetails).then(pg_updatePopupUrls);
        });
    });

    useContainerSwitch.addEventListener('change', function () {
        const selectedGroup = (document.getElementById('group-select') as HTMLSelectElement).value;
        pg_getAdditionalLinks().then((accountDetails) => {
            if (!accountDetails['groups']) {
                accountDetails['groups'] = {};
            }
            if (!accountDetails['groups'][selectedGroup]) {
                accountDetails['groups'][selectedGroup] = {};
            }
            accountDetails['groups'][selectedGroup].sortUrls = sortUrlsSwitch.checked;
            accountDetails['groups'][selectedGroup].useContainer = useContainerSwitch.checked;
            pg_saveAdditionalLinks(accountDetails).then(pg_updatePopupUrls);
        });
    });

    sortUrlsSwitch.addEventListener('change', function () {
        pg_updatePopupUrls();
    });

    const groupForm = document.getElementById('group-form') as HTMLFormElement;

    groupForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const newGroupInput = document.getElementById('new-group-input') as HTMLInputElement;
        const groupName = newGroupInput.value;

        pg_getAdditionalLinks().then((accountDetails) => {
            if (!accountDetails['groups']) {
                accountDetails['groups'] = {};
            }
            if (!accountDetails['groups'][groupName]) {
                accountDetails['groups'][groupName] = { sortUrls: false, useContainer: false };
            }

            pg_saveAdditionalLinks(accountDetails).then(() => {
                pg_updatePopupUrls();
                pg_updateGroupList();
                newGroupInput.value = '';
            });
        });
    });

    document.getElementById('delete-group-button').addEventListener('click', function () {
        const groupSelect = document.getElementById('group-select') as HTMLSelectElement;
        const selectedGroup = groupSelect.value;

        pg_getAdditionalLinks().then((accountDetails) => {
            if (accountDetails['groups'] && accountDetails['groups'][selectedGroup]) {
                delete accountDetails['groups'][selectedGroup];
                accountDetails['urls'] = accountDetails['urls'].filter((url) => url.group !== selectedGroup);

                pg_saveAdditionalLinks(accountDetails).then(() => {
                    pg_updatePopupUrls();
                    pg_updateGroupList();
                });
            }
        });
    });

    document.getElementById('save-group-button').addEventListener('click', function () {
        const groupSelect = document.getElementById('group-select') as HTMLSelectElement;
        const selectedGroup = groupSelect.value;
        const sortUrlsSwitch = document.getElementById('sort-urls') as HTMLInputElement;
        const useContainerSwitch = document.getElementById('use-container') as HTMLInputElement;

        pg_getAdditionalLinks().then((accountDetails) => {
            if (!accountDetails['groups']) {
                accountDetails['groups'] = {};
            }
            if (!accountDetails['groups'][selectedGroup]) {
                accountDetails['groups'][selectedGroup] = {};
            }
            accountDetails['groups'][selectedGroup].sortUrls = sortUrlsSwitch.checked;
            accountDetails['groups'][selectedGroup].useContainer = useContainerSwitch.checked;

            pg_saveAdditionalLinks(accountDetails).then(() => {
                pg_updatePopupUrls();
                pg_updateGroupList();
            });
        });
    });

    pg_updateGroupList();
};
