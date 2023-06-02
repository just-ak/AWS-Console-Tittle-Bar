export interface AWSRegion {
  shortName: string;
  name: string;
  code: string;
}

export interface AWSRegionSettings {
  account?: string;
  code: string;
  nameBoxBackgroundColor?: string;
  titleBarBackgroundColor?: string;
  warning?: boolean;
}

export class AWSRegionManager {

  private awsRegions: AWSRegion[] = [
    { shortName: 'Ohio', name: 'US East (Ohio)', code: 'us-east-2' },
    { shortName: 'N. Virginia', name: 'US East (N. Virginia)', code: 'us-east-1' },
    { shortName: 'N. California', name: 'US West (N. California)', code: 'us-west-1' },
    { shortName: 'Oregon', name: 'US West (Oregon)', code: 'us-west-2' },
    { shortName: 'Cpe Town', name: 'Africa (Cape Town)', code: 'af-south-1' },
    { shortName: 'Hone Kong', name: 'Asia Pacific (Hong Kong)', code: 'ap-east-1' },
    { shortName: 'Mumbai', name: 'Asia Pacific (Mumbai)', code: 'ap-south-1' },
    { shortName: 'Osaka-Local', name: 'Asia Pacific (Osaka-Local)', code: 'ap-northeast-3' },
    { shortName: 'Seoul', name: 'Asia Pacific (Seoul)', code: 'ap-northeast-2' },
    { shortName: 'Singapore', name: 'Asia Pacific (Singapore)', code: 'ap-southeast-1' },
    { shortName: 'Sydney', name: 'Asia Pacific (Sydney)', code: 'ap-southeast-2' },
    { shortName: 'Tokyo', name: 'Asia Pacific (Tokyo)', code: 'ap-northeast-1' },
    { shortName: 'Central', name: 'Canada (Central)', code: 'ca-central-1' },
    { shortName: 'Beijing', name: 'China (Beijing)', code: 'cn-north-1' },
    { shortName: 'Ningxia', name: 'China (Ningxia)', code: 'cn-northwest-1' },
    { shortName: 'Frankfurt', name: 'Europe (Frankfurt)', code: 'eu-central-1' },
    { shortName: 'Ireland', name: 'Europe (Ireland)', code: 'eu-west-1' },
    { shortName: 'London', name: 'Europe (London)', code: 'eu-west-2' },
    { shortName: 'Milan', name: 'Europe (Milan)', code: 'eu-south-1' },
    { shortName: 'Paris', name: 'Europe (Paris)', code: 'eu-west-3' },
    { shortName: 'Stockholm', name: 'Europe (Stockholm)', code: 'eu-north-1' },
    { shortName: 'Bahrain', name: 'Middle East (Bahrain)', code: 'me-south-1' },
    { shortName: 'São Paulo', name: 'South America (São Paulo)', code: 'sa-east-1' },
    { shortName: 'US-East', name: 'AWS GovCloud (US-East)', code: 'us-gov-east-1' },
    { shortName: 'US', name: 'AWS GovCloud (US)', code: 'us-gov-west-1' },
  ];
  
  private awsRegionSettings: AWSRegionSettings[];
  private regionStates: Record<string, Record<string, AWSRegion>> = {};

  constructor(bannerElement: HTMLDivElement, regionElement: HTMLDivElement, accountNameElement: HTMLDivElement) {
    this.getRegionSettings()
      .then((response) => {
        this.awsRegionSettings = response;
      })
      .catch((e) => {
        console.error(e);
        this.awsRegionSettings = [];
      });
  }

  async getRegionSettings(): Promise<AWSRegionSettings[]> {
    return new Promise<AWSRegionSettings[] | undefined>((resolve, reject) => {
      try {
        chrome.storage.local.get('regionStates', (response) => {
          resolve(response as AWSRegionSettings[]);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async saveRegionStates() {
    return await new Promise((resolve, reject) => {
      try {
        chrome.storage.local.set({
          regionStates: JSON.stringify(this.awsRegions),
        });
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }



  findByKey(key: keyof AWSRegion, value: string): AWSRegion | undefined {
    return this.awsRegions.find((region) => region[key] === value);
  }

  findByShortName(shortName: string): AWSRegion | undefined {
    return this.findByKey('shortName', shortName);
  }

  findByName(name: string): AWSRegion | undefined {
    return this.findByKey('name', name);
  }

  findByCode(code: string): AWSRegion | undefined {
    return this.findByKey('code', code);
  }
}

// // Example usage:
// const regionByShortName = regionManager.findByShortName('Ireland');
// console.log(regionByShortName);

// const regionByName = regionManager.findByName('Asia Pacific (Tokyo)');
// console.log(regionByName);

// const regionByCode = regionManager.findByCode('eu-west-1');
// console.log(regionByCode);
