if (element1 = document.querySelectorAll('[data-testid="aws-my-account-details"]')[0]) {
  element1 = document.querySelectorAll('[data-testid="aws-my-account-details"]')[0].innerHTML
  accountId = element1;
} else {
  element2 = document.querySelectorAll('[data-testid="account-menu-title"]')[1].parentElement.innerText.replace(/\D/g, '');
  accountId = ""; //accounts[element2];     
}

getAccountName(accountId).then(accountDetails => {
  if (document.getElementById("awsconsolelables")) {

    el = document.getElementById("awsconsolelables")
  } else {

    el = document.createElement("div");
    el.id = "awsconsolelables"
    el.classList.add("awsconsolelables");
    document.querySelectorAll('header')[0].appendChild(el)
  }
  if (document.getElementById("awsconsolelables_name")) {
    
    elaccname = document.getElementById("awsconsolelables_name")
  } else {

    elaccname = document.createElement("div");
    elaccname.id = "awsconsolelables_name"
    elaccname.classList.add("name");
    el.appendChild(elaccname)
  }
  if (accountDetails[accountId])  {
    if (accountDetails[accountId].id) {
  
    elaccname.innerText = accountDetails[accountId].id;
    }
    else {
  
      elaccname.innerText = "UnKnown";
    }


    if (accountDetails[accountId].color) {
      elaccname.style.setProperty("color", accountDetails[accountId].color,"important")
    }
    if (accountDetails[accountId].background) {
      elaccname.style.background = accountDetails[accountId].background;
    }
    if (accountDetails[accountId].headerBackground) {
      document.querySelectorAll('header')[0].style.background = accountDetails[accountId].headerBackground;
    }
    if (accountDetails[accountId].headerColor) {
      document.querySelectorAll('[data-testid="awsc-nav-account-menu-button"]')[0].style.setProperty("color", accountDetails[accountId].headerColor,"important")
      document.querySelectorAll('[data-testid="awsc-nav-regions-menu-button"]')[0].style.setProperty("color", accountDetails[accountId].headerColor,"important")
      document.querySelectorAll('[data-testid="awsc-nav-support-menu-button"]')[0].style.setProperty("color", accountDetails[accountId].headerColor,"important")
      document.querySelectorAll('[data-testid="aws-services-list-button"]')[0].style.setProperty("color", accountDetails[accountId].headerColor,"important")
  
    }
  } else  {

  }

})

async function getAccountName(accountId) {
  let promise = new Promise(function (resolve, reject) {
    chrome.storage.local.get('jsoninfo', function (response) {
      let accountDetails = JSON.parse(response.jsoninfo);
      resolve(accountDetails);
    })
  });
  let accountDetails = await promise
  return accountDetails
}
