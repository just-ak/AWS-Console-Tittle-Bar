// Saves options to chrome.storage
const jsonElementID = "jsoninfo";
const jsonAccElementID = "jsonaccounts";

interface AccountDetails {
  id: string;
  color: string;
  background: string;
  headerBackground: string;
  headerColor: string;
}

function save_options() {
  const jsonTextArea = document.getElementById(jsonElementID) as HTMLTextAreaElement;
  const jsoninfo = jsonTextArea.value;
  chrome.storage.local.set(
    {
      jsoninfo: jsoninfo,
    },
    function () {
      // Update status to let user know options were saved.
      var status = document.getElementById("status");
      status.textContent = "Options Extras saved.";
      setTimeout(function () {
        status.textContent = "";
      }, 750);
    }
  );
}
function save_accounts() {
  const jsonTextArea = document.getElementById(jsonAccElementID) as HTMLTextAreaElement;
  const jsoninfo = jsonTextArea.value;
  chrome.storage.local.set(
    {
      jsonaccounts: jsoninfo,
    },
    function () {
      // Update status to let user know options were saved.
      var status = document.getElementById("status");
      status.textContent = "Options Accounts saved.";
      setTimeout(function () {
        status.textContent = "";
      }, 750);
    }
  );
}
// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.local.get(
    {
      // default value
      jsoninfo: '{"000000000000":{"id":"Main","color":"red"},"urls":[{"url":"https://example.com","title":"Example.con"}]}',
    },
    function (options) {
      const jsonTextArea = document.getElementById(jsonElementID) as HTMLTextAreaElement;
      jsonTextArea.value = options.jsoninfo;
    }
  );
  chrome.storage.local.get(
    {
      // default value
      jsonaccounts: "{}",
    },
    function (options) {
      showAccounts(options);
    }
  );
}

// Retrieve JSON data from chrome.storage.local
const showAccounts = (data) => {
  // Access the JSON data
  var jsonData = data.jsonaccounts;
  console.log(JSON.stringify(jsonData));
  // Get the container element to hold the form
  var container = document.getElementById("accountColors");

  // Create a form element
  var form = document.createElement("form");

  // Loop through the JSON data
  for (var accountId in jsonData) {
    if (jsonData.hasOwnProperty(accountId)) {
      console.log(accountId);
      var account = jsonData[accountId];
      console.log(JSON.stringify(account));
      // Create a div to hold each account's details
      var accountDiv = document.createElement("div");

      // Create a label for the account name
      var nameLabel = document.createElement("label");
      nameLabel.textContent = account.id + ": " + accountId;

      accountDiv.appendChild(nameLabel);

      // Create a color input for the account color
      var colorInput = document.createElement("input");
      colorInput.type = "color";
      colorInput.value = account.color;

      // Attach an event listener to handle color changes
      colorInput.addEventListener("change", function (event) {
        var selectedColor = (event.target as HTMLInputElement).value;
        console.log(`Color : ${selectedColor}`);
        // Get the corresponding account ID from the parent div's label
        var accountId = (event.target as HTMLInputElement).parentNode.querySelector("label").textContent.split(":")[1].trim();
        // Update the color value in the JSON data
        console.log(`Acc : ${accountId}`)
        const curList = getAccountListOptions().then((data) => {
          if (data.hasOwnProperty('jsonaccounts')) {
          const items = data['jsonaccounts'];
          console.log(`Acc : ${accountId}`)
          console.log(items[`${accountId}`]);
          items[accountId].color = selectedColor;
          // Save the modified JSON data back to chrome.storage.local
          chrome.storage.local.set({ jsonaccounts: items });
          }
        });

        
      });

      accountDiv.appendChild(colorInput);
      form.appendChild(accountDiv);
    }
  }

  // Add the form to the container
  container.appendChild(form);
};

async function getAccountListOptions() {
  return await new Promise((resolve, reject) =>
    chrome.storage.local.get("jsonaccounts", (response) => {
      if (response) {
        resolve(response);
      } else {
        resolve({});
      }
      reject();
    })
  );
}


document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);

