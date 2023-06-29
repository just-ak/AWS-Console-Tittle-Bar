import { AWSConsoleTitleBar, linkDetail } from './reference';

interface UrlManagementParams {
  urlListingId: string;
  formId: string;
  urlInputId: string;
  titleInputId: string;
}

export class UrlManagement extends AWSConsoleTitleBar {
  private urlListingId: HTMLElement;
  private formId: HTMLElement;
  private urlInputId: HTMLFormElement;
  private titleInputId: HTMLFormElement;
  private switchNewTabs: HTMLElement;
  private switchCurrentTab: HTMLElement;

  constructor(params: UrlManagementParams) {
    super();
    // console.log(`urlListingId ${params.urlListingId}`);
    UrlManagement.get()
      .then((config) => {
        this.formId = document.getElementById(params.formId);
        this.urlInputId = document.getElementById(params.urlInputId) as HTMLFormElement;
        this.titleInputId = document.getElementById(params.titleInputId) as HTMLFormElement;
        this.urlListingId = document.getElementById(params.urlListingId) as HTMLFormElement;

        this.urlListingId.addEventListener('click', (e) => {
          if ((e.target as HTMLElement).classList.contains('page-choice-urls')) {
            const chosenPage = (e.target as HTMLElement).dataset.url;
            // console.log(`chosenPage ${JSON.stringify((e.target as HTMLElement).dataset)}`);
            if ((e.target as HTMLElement).dataset.currenttab === 'true') {
              const updating = chrome.tabs.update({ url: chosenPage });
              updating.then().catch((error) => {
                console.error(`Error #22 :  ${error}`);
              });
            } else {
              const updating = chrome.tabs.create({ url: chosenPage });
              updating.then().catch((error) => {
                console.error(`Error #23 :  ${error}`);
              });
            }
          }
        });

        this.formId.addEventListener('submit', (event) => {
          event.preventDefault();
          const url = this.urlInputId.value;
          const title = this.titleInputId.value;
          let found: linkDetail;
          if (
            UrlManagement.instance.config.Links &&
            UrlManagement.instance.config.Links.linkDetails &&
            UrlManagement.instance.config.Links.linkDetails.length > 0
          ) {
            found = UrlManagement.instance.config.Links.linkDetails.find((element) => {
              return element.title === title;
            });
          } else {
            if (UrlManagement.instance.config.Links === undefined) UrlManagement.instance.config.Links = { linkDetails: [] };
          }
          // console.log(`this.switchCurrentTab.style.backgroundColor ${this.switchCurrentTab.style.backgroundColor}`);

          if (found) {
            found.url = url;
            if (this.switchCurrentTab.style.backgroundColor === UrlManagement.onColor) {
              found.currentTab = true;
            } else {
              found.currentTab = false;
            }
          } else {
            if (this.switchCurrentTab.style.backgroundColor === UrlManagement.onColor) {
              UrlManagement.instance.config.Links.linkDetails.push({ url: url, title: title, currentTab: true });
            } else {
              UrlManagement.instance.config.Links.linkDetails.push({ url: url, title: title, currentTab: false });
            }
          }
          UrlManagement.save().catch((error) => {
            console.error(`Error #24 :  ${error}`);
          });
          this.updatePopupUrls();
        });

        this.updatePopupUrls();

        this.switchNewTabs = document.getElementById('newTabs');
        this.switchCurrentTab = document.getElementById('currentTab');

        this.switchNewTabs.addEventListener('click', () => {
          this.switchElements(false);
        });
        this.switchCurrentTab.addEventListener('click', () => {
          this.switchElements(true);
        });
      })
      .catch((error) => {
        console.error(`Error #25 :  ${error}`);
      });
  }

  private switchElements(toggle = true) {
    if (toggle) {
      this.switchNewTabs.style.backgroundColor = UrlManagement.offColor;
      this.switchCurrentTab.style.backgroundColor = UrlManagement.onColor;
    } else {
      this.switchNewTabs.style.backgroundColor = UrlManagement.onColor;
      this.switchCurrentTab.style.backgroundColor = UrlManagement.offColor;
    }
  }

  updatePopupUrls = () => {
    // console.log(`updatePopupUrls ${JSON.stringify(UrlManagement.instance.config.Links)}`);
    if (this.urlListingId != undefined) {
      this.urlListingId.innerHTML = '';
    }
    if (UrlManagement.instance.config.Links.linkDetails.length > 0) {
      for (const i in UrlManagement.instance.config.Links.linkDetails) {
        const switchNewTabsccountDiv = document.createElement('div');
        switchNewTabsccountDiv.style.display = 'flex';

        const switchNewTabsccountName = document.createElement('span');
        switchNewTabsccountName.classList.add('page-choice-urls');
        switchNewTabsccountName.innerText = UrlManagement.instance.config.Links.linkDetails[i]['title'];
        switchNewTabsccountName.dataset.url = UrlManagement.instance.config.Links.linkDetails[i]['url'];
        // console.log(
        //   `UrlManagement.instance.config.Links.linkDetails[i]['currentTab'] ${UrlManagement.instance.config.Links.linkDetails[i]['currentTab']}`
        // );
        switchNewTabsccountName.dataset.currenttab = UrlManagement.instance.config.Links.linkDetails[i]['currentTab'].toString();

        const elementRemoveAccountName = document.createElement('img');
        elementRemoveAccountName.classList.add('remove-url');
        elementRemoveAccountName.classList.add('svg-image');
        elementRemoveAccountName.src = '../icons/delete.svg';
        elementRemoveAccountName.alt = 'Delete';
        elementRemoveAccountName.setAttribute('data-key', UrlManagement.instance.config.Links.linkDetails[i]['title']);
        if (document.getElementById('settingsBlock').style.display === 'block') {
          elementRemoveAccountName.style.visibility = 'visible';
        } else {
          elementRemoveAccountName.style.visibility = 'hidden';
        }
        elementRemoveAccountName.addEventListener('click', (event) => {
          const title = (event.target as HTMLElement).dataset.key;
          UrlManagement.instance.config.Links.linkDetails = UrlManagement.instance.config.Links.linkDetails.filter(
            (item) => item.title !== title
          );

          UrlManagement.save().catch((error) => {
            console.error(`Error #26 :  ${error}`);
          });
          this.updatePopupUrls();
        });

        const elementAccountNameEdit = document.createElement('img');
        elementAccountNameEdit.classList.add('remove-url');
        elementAccountNameEdit.classList.add('svg-image');
        elementAccountNameEdit.src = '../icons/edit.svg';
        elementAccountNameEdit.alt = 'Edit';
        elementAccountNameEdit.setAttribute('data-key', UrlManagement.instance.config.Links.linkDetails[i]['title']);
        if (document.getElementById('settingsBlock').style.display === 'block') {
          elementAccountNameEdit.style.visibility = 'visible';
        } else {
          elementAccountNameEdit.style.visibility = 'hidden';
        }
        elementAccountNameEdit.addEventListener('click', (event) => {
          (document.getElementById('url-input') as HTMLInputElement).value =
            UrlManagement.instance.config.Links.linkDetails[i]['url'];
          (document.getElementById('title-input') as HTMLInputElement).value =
            UrlManagement.instance.config.Links.linkDetails[i]['title'];
          if (UrlManagement.instance.config.Links.linkDetails[i]['currentTab'] === true) {
            this.switchElements(true);
          } else {
            this.switchElements(false);
          }
        });
        switchNewTabsccountDiv.appendChild(switchNewTabsccountName);
        switchNewTabsccountDiv.appendChild(elementRemoveAccountName);
        switchNewTabsccountDiv.appendChild(elementAccountNameEdit);
        this.urlListingId.appendChild(switchNewTabsccountDiv);
      }
    }
  };
}
