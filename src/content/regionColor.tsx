import { AWSConsoleTitleBar } from './reference';

interface RegionColorParams {
  toggleAllRegionsOn: string;
  toggleAllRegionsOff: string;
  toggleBannerOn: string;
  toggleBannerOff: string;
  toggleAllAccountsOn: string;
  toggleAllAccountsOff: string;
}

export class RegionColor extends AWSConsoleTitleBar {
  private toggleAllRegionsOn: HTMLElement;
  private toggleAllRegionsOff: HTMLElement;
  private toggleBannerOn: HTMLElement;
  private toggleBannerOff: HTMLElement;
  private toggleAllAccountsOn: HTMLElement;
  private toggleAllAccountsOff: HTMLElement;
  private singleRegion: HTMLElement;
  private allRegions: HTMLElement;

  constructor(params: RegionColorParams) {
    super();
    this.singleRegion = document.getElementById('singleRegion');
    this.allRegions = document.getElementById('allRegions');
    RegionColor.get()
      .then(() => {
        this.toggleAllRegionsOn = document.getElementById(params.toggleAllRegionsOn);
        this.toggleBannerOn = document.getElementById(params.toggleBannerOn);
        this.toggleAllAccountsOn = document.getElementById(params.toggleAllAccountsOn);

        this.toggleAllRegionsOff = document.getElementById(params.toggleAllRegionsOff);
        this.toggleBannerOff = document.getElementById(params.toggleBannerOff);
        this.toggleAllAccountsOff = document.getElementById(params.toggleAllAccountsOff);

        this.toggleAllRegionsOn.addEventListener('click', () => {
          RegionColor.instance.config.RegionColors.allRegions = true;
          this.toggleElement(this.toggleAllRegionsOn, this.toggleAllRegionsOff);
          RegionColor.save().catch((error) => {
            console.error('RegionColors.allRegions.save error', error);
          });
        });

        this.toggleAllRegionsOff.addEventListener('click', () => {
          RegionColor.instance.config.RegionColors.allRegions = false;
          this.toggleElement(this.toggleAllRegionsOff, this.toggleAllRegionsOn);
          RegionColor.save().catch((error) => {
            console.error('RegionColor.save error', error);
          });
        });

        this.toggleBannerOn.addEventListener('click', () => {
          RegionColor.instance.config.RegionColors.banner = true;
          this.toggleElement(this.toggleBannerOn, this.toggleBannerOff);
          RegionColor.save().catch((error) => {
            console.error('RegionColor.save error', error);
          });
        });

        this.toggleBannerOff.addEventListener('click', () => {
          RegionColor.instance.config.RegionColors.banner = false;
          this.toggleElement(this.toggleBannerOff, this.toggleBannerOn);
          RegionColor.save().catch((error) => {
            console.error('RegionColor.save error', error);
          });
        });

        if (RegionColor.accountDescription.accountValid == true) {

          this.toggleAllAccountsOn.addEventListener('click', () => {
            RegionColor.instance.config.RegionColors.allAccounts = true;
            this.toggleElement(this.toggleAllAccountsOn, this.toggleAllAccountsOff);
            RegionColor.save().catch((error) => {
              console.error('RegionColor.save error', error);
            });
          });

          this.toggleAllAccountsOff.addEventListener('click', () => {
            RegionColor.instance.config.RegionColors.allAccounts = false;
            this.toggleElement(this.toggleAllAccountsOff, this.toggleAllAccountsOn);
            RegionColor.save().catch((error) => {
              console.error('RegionColor.save error', error);
            });
          });

        } else {
          RegionColor.instance.config.RegionColors.allAccounts = true;
          this.toggleAllAccountsOn.style.backgroundColor = RegionColor.onColor;
          this.toggleAllAccountsOff.style.visibility = 'hidden';
          RegionColor.save().catch((error) => {
            console.error('RegionColor.save error', error);
          });
        }

        if (RegionColor.instance.config.RegionColors.banner === true) {
          this.toggleElement(this.toggleBannerOn, this.toggleBannerOff);
        } else {
          this.toggleElement(this.toggleBannerOff, this.toggleBannerOn);
        }

        if (RegionColor.instance.config.RegionColors.allAccounts === true) {
          this.toggleElement(this.toggleAllAccountsOn, this.toggleAllAccountsOff);
        } else {
          this.toggleElement(this.toggleAllAccountsOff, this.toggleAllAccountsOn);
        }

        if (RegionColor.instance.config.RegionColors.allRegions === true) {
          this.toggleElement(this.toggleAllRegionsOn, this.toggleAllRegionsOff);
          console.log('allRegions on');
        } else {
          this.toggleElement(this.toggleAllRegionsOff, this.toggleAllRegionsOn);
          console.log('allRegions off');
        }
      })
      .catch((error) => {
        console.error('RegionColor error', error);
      });
  }
  toggleElement(elementOn: HTMLElement, elementOff: HTMLElement): void {
    elementOn.style.backgroundColor = RegionColor.offColor;
    elementOff.style.backgroundColor = RegionColor.onColor;
    if (RegionColor.instance.config.RegionColors.allRegions === true) {
      this.singleRegion.style.display = 'none';
      this.allRegions.style.display = 'block';
    } else {
      this.singleRegion.style.display = 'block';
      this.allRegions.style.display = 'none';
    }
  }

  static navigateToInput(target: HTMLElement) {
    const inputElement = document.getElementById((target as HTMLElement).id + '-input');
    if (inputElement) {
      inputElement.click();
    }
  }

  static observer = new MutationObserver(function (mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        const element = mutation.target as HTMLElement;
        const bgColor = window.getComputedStyle(element).getPropertyValue('color');
        const awsBannerAccountName = document.getElementById('awsBannerAccountName');
        if (element.id === 'cbr-100-color') {
          awsBannerAccountName.style.color = bgColor;
        } else {
          awsBannerAccountName.style.background = bgColor;
        }
        document.getElementById(element.id.replace('-color', '')).style.color = RegionColor.calculateInverseColor(bgColor);
      }
    }
  });

  private static calculateInverseColor(bgColor) {
    const rgbArr = bgColor.replace('rgb(', '').replace(')', '').split(',');
    const r = parseInt(rgbArr[0], 16);
    const g = parseInt(rgbArr[1], 16);
    const b = parseInt(rgbArr[2], 16);

    const inverseR = 255 - r;
    const inverseG = 255 - g;
    const inverseB = 255 - b;

    if (
      Math.abs(r - inverseR) < RegionColor.colorThreshold &&
      Math.abs(g - inverseG) < RegionColor.colorThreshold &&
      Math.abs(b - inverseB) < RegionColor.colorThreshold
    ) {
      const adjustedInverseR = Math.min(255, Math.round(RegionColor.popFactor * inverseR));
      const adjustedInverseG = Math.min(255, Math.round(RegionColor.popFactor * inverseG));
      const adjustedInverseB = Math.min(255, Math.round(RegionColor.popFactor * inverseB));
      return `rgb(${adjustedInverseR},${adjustedInverseG},${adjustedInverseB})`;
    } else {
      return `rgb(${inverseR},${inverseG},${inverseB})`;
    }
  }
}
