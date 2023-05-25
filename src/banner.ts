interface AccountDetails {
  id: string;
  color: string;
  background: string;
  headerBackground: string;
  headerColor: string;
}

const isElementLoaded = async (selector) => {
  while (document.querySelector(selector) === null) {
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return document.querySelector(selector);
};
isElementLoaded('[data-testid="account-detail-menu"]').then((selector) => {
  const baseElement = document.querySelector('[data-testid="account-detail-menu"]');
  let accountId;
  if (baseElement) {
    const spanElement = baseElement.querySelectorAll("span")[1];

    if (spanElement) {
      accountId = spanElement.innerText.replace(/-/g, "");
    }
  }
  if (accountId) {
    getAccountName(accountId)
      .then((accountDetails: AccountDetails) => {
        //console.log("accountId");
        let elementAWSConsoleTables: HTMLElement;
        if (document.getElementById("awsconsolelables")) {
          elementAWSConsoleTables = document.getElementById("awsconsolelables");
        } else if (document.getElementById("nav-usernameMenu")) {
          elementAWSConsoleTables = document.getElementById("nav-usernameMenu");
        } else {
          elementAWSConsoleTables = document.createElement("div") as HTMLDivElement;
          elementAWSConsoleTables.id = "awsconsolelables";
          elementAWSConsoleTables.classList.add("awsconsolelables");
          document.querySelectorAll("header")[0].querySelectorAll("nav")[0].prepend(elementAWSConsoleTables);
        }
        let elementAccountName: HTMLElement;
        if (document.getElementById("awsconsolelables_name")) {
          elementAccountName = document.getElementById("awsconsolelables_name");
        } else {
          elementAccountName = document.createElement("div") as HTMLDivElement;
          elementAccountName.id = "awsconsolelables_name";
          elementAccountName.classList.add("name");
          elementAWSConsoleTables.appendChild(elementAccountName);
        }

        if (accountDetails.id) {
          elementAccountName.innerText = accountDetails.id;
        } else {
          elementAccountName.innerText = "UnKnown";
        }

        if (accountDetails.color) {
          elementAccountName.style.setProperty("color", (accountDetails as AccountDetails).color, "important");
        }

        if (accountDetails.background) {
          elementAccountName.style.background = (accountDetails as AccountDetails).background;
        }

        if (accountDetails.headerBackground) {
          document.querySelectorAll("header")[0].style.background = (accountDetails as AccountDetails).headerBackground;
        }

        if (accountDetails.headerColor) {
          (document.querySelectorAll('[data-testid="awsc-nav-account-menu-button"]')[0] as HTMLDivElement).style.setProperty("color", accountDetails.headerColor, "important");
          (document.querySelectorAll('[data-testid="awsc-nav-regions-menu-button"]')[0] as HTMLDivElement).style.setProperty("color", accountDetails.headerColor, "important");
          (document.querySelectorAll('[data-testid="awsc-nav-support-menu-button"]')[0] as HTMLDivElement).style.setProperty("color", accountDetails.headerColor, "important");
          (document.querySelectorAll('[data-testid="aws-services-list-button"]')[0] as HTMLDivElement).style.setProperty("color", accountDetails.headerColor, "important");
        }
      })
      .catch((e) => console.error(e));
  } else {
    console.warn("Unable to find Account Id");
  }
});

async function getAccountName(accountId) {
  return await new Promise((resolve, reject) =>
    chrome.storage.local.get("jsonaccounts", (response) => {
      //console.log(`accountDetails: ${JSON.stringify(response)}`)
      const accountDetails: AccountDetails = JSON.parse(response.jsonaccounts);
      if (accountDetails && accountDetails.hasOwnProperty(accountId)) {
        resolve(accountDetails[accountId]);
      } else {
        reject(`Unknown Account Id: ${accountId}`);
      }
    })
  );
}

async function getAccountList() {
  return await new Promise((resolve, reject) =>
    chrome.storage.local.get("jsonaccounts", (response) => {
      //console.log(`getAccountList: ${JSON.stringify(response)}`);
      if (response) {
        resolve(JSON.parse(response.jsonaccounts));
      } else {
        resolve({});
      }
      reject();
    })
  );
}

// Update Account List
if (window.location.href.includes("awsapps.com/start")) {
  const handleMutations = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      // Check if new nodes are added
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        // Iterate over the added nodes and check if any match the desired section
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement && node.matches("sso-expander")) {
            extractAccountData();
            break; // Stop iterating if a match is found
          }
        }
      }
    }
  };

  // Create a new MutationObserver instance
  const observer = new MutationObserver(handleMutations);

  // Options for the observer (specify which mutations to observe)
  const observerOptions = {
    childList: true,
    subtree: true,
  };

  // Start observing mutations on the document
  observer.observe(document, observerOptions);
}

const extractAccountData = () => {
  //console.log("Yeah on the right page");
  isElementLoaded(".portal-instance-section").then((selector) => {
    let jsonData = {}; 
    try {
    jsonData =  getAccountList();
    } catch (e) {
      jsonData = {}
    }

    // Assuming you have access to the DOM elements containing the account names and numbers
    const accountElements = document.querySelectorAll(".name");
    const accountIdElements = document.querySelectorAll(".accountId");

    // Iterate over the elements and update the JSON data
    for (let i = 0; i < accountElements.length; i++) {
      const accountName = accountElements[i].textContent;
      const accountId = accountIdElements[i].textContent.slice(1); // Remove the '#' symbol

      // Check if the account number exists in the JSON data
      if (jsonData.hasOwnProperty(accountId)) {
        // Update the "id" property with the account name
        jsonData[accountId].id = accountName;
      } else {
        // Add a new entry to the JSON data with default values
        jsonData[accountId] = {
          id: accountName,
          color: "#57f104",
        };
      }
    }
    //console.log(jsonData);
    // Convert the updated JSON data to a string
    //const updatedJsonData = JSON.stringify(jsonData, null, 4);
    //console.log(updatedJsonData);
    saveAccountList(jsonData)
    getAccountList();
    // chrome.storage.local.set(
    //   {
    //     jsonaccounts: jsonData,
    //   },
    //   function () {
    //     // Update status to let user know options were saved.
    //     console.log(`Updated: ${JSON.stringify(jsonData)}`);

       
    //     console.log('Did it Update');
    //   }
    // );
  });
};

async function saveAccountList(data) {
  return await new Promise((resolve, reject) =>
  chrome.storage.local.set(
    {
      jsonaccounts: JSON.stringify(data),
    },
    function () {
      // Update status to let user know options were saved.
      //console.log(`Updated #1: ${JSON.stringify(data)}`);
    }
  ));
}
