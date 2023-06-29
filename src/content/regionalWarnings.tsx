import { AWSConsoleTitleBar } from './reference';

interface RegionalWarningsParams {
  regionsContainerId: string;
  allAccountToggleId: string;
  thisAccountToggleId: string;
}

export class RegionWarnings extends AWSConsoleTitleBar {
  private regionsContainerId: HTMLElement;
  private allAccountToggleId: HTMLElement;
  private thisAccountToggleId: HTMLElement;

  constructor(params: RegionalWarningsParams) {
    super();
    // console.log('RegionWarnings constructor');
    AWSConsoleTitleBar.get()
      .then(() => {
        this.regionsContainerId = document.getElementById(params.regionsContainerId);
        this.allAccountToggleId = document.getElementById(params.allAccountToggleId);
        this.thisAccountToggleId = document.getElementById(params.thisAccountToggleId);
        AWSConsoleTitleBar.instance.config.RegionWarnings.forEach((element) => {
          if (element.onOff) {
            const regionwarning = document.querySelector(`[data-regionwarning="${element.regionWarning}"]`) as HTMLDivElement;
            if (regionwarning) {
              regionwarning.style.animation = 'blinkingBackground 2s infinite';
            }
          }
        });
        this.regionsContainerId.addEventListener('click', (event) => {
          const target = event.target as HTMLDivElement;
          const regionwarning = target.dataset.regionwarning;
          if (regionwarning) {
            this.toggleAnimation(target);
          }
        });
        if (RegionWarnings.accountDescription.accountValid === true) {
          this.allAccountToggleId.addEventListener('click', () => {
            this.toggleElement(this.allAccountToggleId, this.thisAccountToggleId);
          });
          this.thisAccountToggleId.addEventListener('click', () => {
            this.toggleElement(this.thisAccountToggleId, this.allAccountToggleId);
          });
          this.allAccountToggleId.style.backgroundColor = RegionWarnings.onColor;
          this.thisAccountToggleId.style.backgroundColor = RegionWarnings.offColor;
        }
      })
      .catch((error) => {
        console.log('RegionWarnings constructor error' + error);
      });
  }

  private toggleElement(elementOn: HTMLElement, elementOff: HTMLElement) {
    if (elementOn.style.backgroundColor === RegionWarnings.onColor) {
      elementOn.style.backgroundColor = RegionWarnings.offColor;
      elementOff.style.backgroundColor = RegionWarnings.onColor;
    } else {
      elementOn.style.backgroundColor = RegionWarnings.onColor;
      elementOff.style.backgroundColor = RegionWarnings.offColor;
    }
  }

  private toggleAnimation(target: HTMLSpanElement): void {
    let setAnimation = false;

    const found = RegionWarnings.instance.config.RegionWarnings.find((element) => {
      return element.regionWarning === target.dataset.regionwarning;
    });
    if (found) {
      found.onOff = !found.onOff;
      setAnimation = found.onOff;
    } else {
      setAnimation = true;
      RegionWarnings.instance.config.RegionWarnings.push({
        regionWarning: target.dataset.regionwarning,
        onOff: true,
      });
    }

    if (setAnimation === true) {
      target.style.animation = 'blinkingBackground 2s infinite';
    } else {
      target.style.animation = '';
    }
    RegionWarnings.save().catch((error) => {
      console.log('RegionWarnings save error' + error);
    });
  }
}
