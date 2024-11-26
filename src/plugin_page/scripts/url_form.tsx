import { getAdditionalLinks, saveAdditionalLinks, onUpdated, onError,  } from '../../common/reference';
import { urlList, cogIcon, accountConfigDiv, urlForm, groupSelect,newGroupInput} from './dom';
import { createContainer } from './firefox';
import { updatePopupUrls } from './plugin_page';

export function initializeurlForm() {
    document.addEventListener('DOMContentLoaded', function () {
      updateGroupListInUrlsSetting();
        urlList.addEventListener('click', async function (e) {
            if ((e.target as HTMLElement).classList.contains('url-link')) {
                const chosenPage = (e.target as HTMLElement).dataset.url;
                const recordId = (e.target as HTMLElement).dataset.recordId;
                const containerTitle = (e.target as HTMLElement).innerText;
                const groupId = (e.target as HTMLElement).dataset.groupId;
                const groupDetails = await getAdditionalLinks().then((accountDetails) => {
                    const group = accountDetails['groups'].find((group) => `${group.id}` === `${groupId}`);
                    return group;
                });
                if (cogIcon.dataset.action === 'runMode' || cogIcon.dataset.action === undefined) {
                    try {
                        let containerId = null;
                        await createContainer(containerTitle).then((id) => {
                            containerId = id;
                        });
                        if (groupDetails.useContainerSwitch) {
                            browser.tabs.create({ url: chosenPage, cookieStoreId: containerId }).then(onUpdated, onError);
                        } else {
                            chrome.tabs.create({ url: chosenPage }).then(onUpdated, onError);
                        }
                    } catch (error) {
                        console.error('Failed to create container and open tab:', error);
                    }
                } else {
                    (document.getElementById('url-form') as HTMLFormElement).dataset.action = 'edit';
                    (document.getElementById('url-input') as HTMLInputElement).value = chosenPage;
                    (document.getElementById('url-input') as HTMLInputElement).dataset.recordId = recordId;
                    (document.getElementById('title-input') as HTMLInputElement).value = containerTitle;
                    (document.getElementById('group-select') as HTMLSelectElement).value = groupId;
                    (document.getElementById('new-group-input') as HTMLInputElement).value = '';
                }
            }
        });

        urlForm.addEventListener('submit', function (event) {
            event.preventDefault();
        
            const urlInput = document.getElementById('url-input') as HTMLInputElement;
            const titleInput = document.getElementById('title-input') as HTMLInputElement;
            const commitType = (event.submitter as HTMLButtonElement).dataset.commitType;
            const url = urlInput.value;
            const title = titleInput.value;
            const group = newGroupInput.value || groupSelect.value;
            const recordId = urlInput.dataset.recordId;
            if (title === '') {
              // alert('Group Title is required');
              return;
          }
            getAdditionalLinks().then((accountDetails) => {
              if (!accountDetails['urls']) {
                accountDetails['urls'] = [];
              }
              if (commitType === 'save-as-new') {
                const maxId = Math.max(...accountDetails['urls'].map((item) => parseInt(item.id, 10)));
                accountDetails['urls'].push({ id: (maxId + 1).toString(), url: url, title: title, group: group });
              } else if (commitType === 'save') {
                const index = accountDetails['urls'].findIndex((item) => item.id === recordId);
                if (index !== -1) {
                  accountDetails['urls'][index] = { id: recordId, url: url, title: title, group: group };
                }
              } else if (commitType === 'delete') {
                accountDetails['urls'] = accountDetails['urls'].filter((item) => item.id !== recordId);
              }
        
              // Update groups if a new group has been created
              if (newGroupInput.value && !accountDetails['groups'][newGroupInput.value]) {
                accountDetails['groups'][newGroupInput.value] = { sortUrls: false, useContainer: false };
              }
        
              saveAdditionalLinks(accountDetails);
              updatePopupUrls();
            });
          });

        urlList.addEventListener('dragstart', function (e) {
            if ((e.target as HTMLElement).classList.contains('url-link')) {
                e.dataTransfer.setData('text/plain', (e.target as HTMLElement).dataset.recordId);
                e.dataTransfer.effectAllowed = 'move';
            }
        });

        urlList.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        urlList.addEventListener('drop', function (e) {
            e.preventDefault();
            const draggedRecordId = e.dataTransfer.getData('text/plain');
            const target = e.target as HTMLElement;
            if (target.classList.contains('url-link')) {
                const targetRecordId = target.dataset.recordId;
                getAdditionalLinks().then((accountDetails) => {
                    const urls = accountDetails['urls'];
                    const draggedIndex = urls.findIndex(item => `${item.id}` === `${draggedRecordId}`);
                    const targetIndex = urls.findIndex(item => `${item.id}` === `${targetRecordId}`);
                    if (draggedIndex !== -1 && targetIndex !== -1) {
                        const [draggedItem] = urls.splice(draggedIndex, 1);
                        urls.splice(targetIndex, 0, draggedItem);
                        accountDetails['urls'] = urls;
                        saveAdditionalLinks(accountDetails).then(() => { updatePopupUrls()});
                    }
                });
            }
        });
    });
}

export function updateGroupListInUrlsSetting() {
    getAdditionalLinks().then((accountDetails) => {
        groupSelect.innerHTML = '';
        for (const group of accountDetails['groups']) {
            const option = document.createElement('option');
            option.value = group.id;
            option.textContent = group.title;
            groupSelect.appendChild(option);
        }
    });
};

