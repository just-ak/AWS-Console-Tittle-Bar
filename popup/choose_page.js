document.addEventListener("click", function (e) {
  if (!e.target.classList.contains("page-choice")) {
    return;
  }

  var chosenPage = "https://" + e.target.textContent;
  browser.tabs.create({
    url: chosenPage
  });

});
getAccountName();

async function getAccountName() {
  let promise = new Promise(function (resolve, reject) {
    chrome.storage.local.get('jsoninfo', function (response) {
      let accountDetails = JSON.parse(response.jsoninfo);
      resolve(accountDetails);
    })
  });
  let accountDetails = await promise
  innerText = ""

  if (accountDetails['links']) {
    console.log("ONE:" + accountDetails['links'].length);
    for (i in accountDetails['links']) {
      elaccname= document.createElement("div");
      elaccname.classList.add("page-choice");
      elaccname.innerText = accountDetails['links'][i];
      document.getElementById("accurl").appendChild(elaccname)
    }
  }
}

