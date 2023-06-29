import { RegionColor } from './regionColor';
import { RegionWarnings } from './regionalWarnings';
import { SettingsManagement } from './settingsManagement';
import { UrlManagement } from './urlManagement';
import { AccountDescription } from './accountDescription';

new SettingsManagement({
  settingsBlock: 'settingsBlock',
  settingsToggleItem: 'awsso-footer',
  settingsToggleItemClass: 'remove-url',
});

try {
  document.addEventListener('DOMContentLoaded', function () {
    new RegionColor({
      toggleAllRegionsOn: 'toggleAllRegionsOn',
      toggleAllRegionsOff: 'toggleAllRegionsOff',
      toggleBannerOn: 'toggleBannerOn',
      toggleBannerOff: 'toggleBannerOff',
      toggleAllAccountsOn: 'toggleAllAccountOn',
      toggleAllAccountsOff: 'toggleAllAccountOff',
    });
    new RegionWarnings({
      regionsContainerId: 'regionWarnings',
      allAccountToggleId: 'hazardAllAccounts',
      thisAccountToggleId: 'hazardThisAccount',
    });

    new UrlManagement({
      urlListingId: 'accurl',
      formId: 'url-form',
      urlInputId: 'url-input',
      titleInputId: 'title-input',
    });
    Array.from(document.getElementsByClassName('pill-label')).forEach((pillLabel) => {
      pillLabel.addEventListener('click', function (e) {
        RegionColor.navigateToInput(e.target as HTMLElement);
      });
      const element = document.getElementById((pillLabel as HTMLElement).id + '-color') as HTMLElement;
      RegionColor.observer.observe(element, { attributes: true });
    });
  });
} catch (err) {
  console.error(`Error: plugin_page.ts:  ${err}`);
}
