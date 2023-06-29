import { AWSConsoleTitleBar } from './reference';

interface SettingsManagementParams {
  settingsBlock: string;
  settingsToggleItem: string;
  settingsToggleItemClass: string;
}

export class SettingsManagement extends AWSConsoleTitleBar {
  private settingsBlock: HTMLElement;
  private settingsToggleItem: HTMLElement;
  private settingsToggleItemClass: string;

  constructor(params: SettingsManagementParams) {
    super();
    this.settingsBlock = document.getElementById(params.settingsBlock);
    this.settingsBlock.style.display = 'none';
    this.settingsToggleItem = document.getElementById(params.settingsToggleItem);
    this.settingsToggleItemClass = params.settingsToggleItemClass;

    this.settingsToggleItem.addEventListener('click', () => {
      if (this.settingsBlock.style.display === 'none') {
        this.settingsBlock.style.display = 'block';
        document.body.style.width = '520px';
        window.resizeTo(450, window.innerHeight);

        this.toggleVisibility(true);
      } else {
        this.settingsBlock.style.display = 'none';
        this.toggleVisibility(false);
        document.body.style.width = '280px';
        window.resizeTo(250, window.innerHeight);
      }
    });
  }
  toggleVisibility(visibility: boolean) {
    const removeUrls = document.getElementsByClassName(this.settingsToggleItemClass);
    for (let i = 0; i < removeUrls.length; i++) {
      const removeUrl = removeUrls[i];
      if (visibility) {
        (removeUrl as HTMLElement).style.visibility = 'visible';
      } else {
        (removeUrl as HTMLElement).style.visibility = 'hidden';
      }
    }
  }
}
