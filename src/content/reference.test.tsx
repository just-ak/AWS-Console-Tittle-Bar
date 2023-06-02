const { AWSRegionManager, regionManager } = require('./reference');

interface AWSRegion {
  shortName: string;
  name: string;
  code: string;
}

describe('AWSRegionManager', () => {
  const awsRegions: AWSRegion[] = [
    { shortName: 'Ohio', name: 'US East (Ohio)', code: 'us-east-2' },
    { shortName: 'N. Virginia', name: 'US East (N. Virginia)', code: 'us-east-1' },
    // ... other AWS region data
  ];

  const regionManager = new AWSRegionManager(awsRegions);

  describe('findByShortName', () => {
    it('should return the correct region object when shortName exists', () => {
      const region = regionManager.findByShortName('N. Virginia');
      expect(region).toEqual({ shortName: 'N. Virginia', name: 'US East (N. Virginia)', code: 'us-east-1' });
    });

    it('should return undefined when shortName does not exist', () => {
      const region = regionManager.findByShortName('Non-existent');
      expect(region).toBeUndefined();
    });
  });

  describe('findByName', () => {
    it('should return the correct region object when name exists', () => {
      const region = regionManager.findByName('US East (Ohio)');
      expect(region).toEqual({ shortName: 'Ohio', name: 'US East (Ohio)', code: 'us-east-2' });
    });

    it('should return undefined when name does not exist', () => {
      const region = regionManager.findByName('Non-existent');
      expect(region).toBeUndefined();
    });
  });

  describe('findByCode', () => {
    it('should return the correct region object when code exists', () => {
      const region = regionManager.findByCode('us-east-1');
      expect(region).toEqual({ shortName: 'N. Virginia', name: 'US East (N. Virginia)', code: 'us-east-1' });
    });

    it('should return undefined when code does not exist', () => {
      const region = regionManager.findByCode('non-existent-code');
      expect(region).toBeUndefined();
    });
  });
});
