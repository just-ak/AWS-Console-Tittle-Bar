import { debugLog } from "../../common/reference";
import { clearContainersButton } from "./dom"

export function initializeurlContainers() {
    document.addEventListener('DOMContentLoaded', async function (e) {
        clearContainersButton.addEventListener('click', function () {
        browser.contextualIdentities.query({})
            .then((identities) => {
                if (!identities.length) {
                    console.log('No identities found');
                } else {
                    identities.forEach((identity) => {
                        browser.contextualIdentities.remove(identity.cookieStoreId);
                    });
                }
            }).catch((error) => {
                debugLog('Error querying containers:', error);
            });
        });
    });
}

