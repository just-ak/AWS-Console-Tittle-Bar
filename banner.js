if (element1 = document.querySelectorAll('[data-testid="aws-my-account-details"]')[0]) {
  element1 = document.querySelectorAll('[data-testid="aws-my-account-details"]')[0].innerHTML
  accountId = element1; 
} else {
  element2 = document.querySelectorAll('[data-testid="account-menu-title"]')[1].parentElement.innerText.replace(/\D/g, '');
  accountId = ""; //accounts[element2];     
}

getAccountName(accountId).then(accountDetails => {
    el = document.createElement("div");
    el.classList.add("awsconsolelables");
    elaccname  = document.createElement("div");
    elaccname.classList.add("name");
    elaccname.innerText = accountDetails[accountId].id;
    if (accountDetails[accountId].color) {
      elaccname.style.color = accountDetails[accountId].color ;
    }
    if (accountDetails[accountId].background) {
      elaccname.style.background = accountDetails[accountId].background;
    }
    el.appendChild(elaccname)
    document.querySelectorAll('header')[0].appendChild(el)
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
