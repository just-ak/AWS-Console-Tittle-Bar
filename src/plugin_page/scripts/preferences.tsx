
import { getAdditionalLinks, saveAdditionalLinks, debugLog, IAdditionalLinks } from '../../common/reference';


export function initializePreferencesForm() {
    document.addEventListener('DOMContentLoaded', function () {
        const preferencesForm = document.getElementById('preferences-form') as HTMLFormElement;
        const awsConsoleCompress = document.getElementById('aws-console-compress') as HTMLInputElement;

        // Load existing preferences
        getAdditionalLinks().then((accountDetails: IAdditionalLinks) => {
            if (accountDetails.preferences && accountDetails.preferences.awsConsole.compressMode) {
                awsConsoleCompress.checked = accountDetails.preferences.awsConsole.compressMode;   
            }
        });

        preferencesForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const settingValue = awsConsoleCompress.checked ? 'true' : 'false';
            getAdditionalLinks().then((accountDetails: IAdditionalLinks) => {
                if (!accountDetails.preferences) {
                    accountDetails.preferences = {
                        awsConsole: {
                            compressMode: false,
                        }
                    };
                }
                accountDetails.preferences.awsConsole.compressMode = settingValue.toLowerCase() === 'true'? true : false;   

                saveAdditionalLinks(accountDetails).then(() => {
                    debugLog('Preferences saved:',  JSON.stringify(accountDetails.preferences, null, 2));
                });
            });
        });
    });
};