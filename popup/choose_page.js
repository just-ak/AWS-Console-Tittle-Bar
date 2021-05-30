function onUpdated(tab) {
  console.log(`Updated tab: ${tab.id}`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("page-choice-https")) {
    var chosenPage = "https://" + e.target.textContent;
    var updating = browser.tabs.update({url: chosenPage});
    updating.then(onUpdated, onError);  
  }
  if (e.target.classList.contains("page-choice-http")) {
    var chosenPage = "http://" + e.target.textContent;
    var updating = browser.tabs.update({url: chosenPage});
    updating.then(onUpdated, onError);  
  }
});

document.addEventListener("DOMContentLoaded", function(){
  getAccountName();
});


async function getAccountName() {
  let promise = new Promise(function (resolve, reject) {
    chrome.storage.local.get('jsoninfo', function (response) {
      let accountDetails = JSON.parse(response.jsoninfo);
      resolve(accountDetails);
    })
  });
  let accountDetails = await promise
  innerText = ""

  if (accountDetails['https']) {
    console.log("ONE:" + accountDetails['https'].length);
    for (i in accountDetails['https']) {
      elaccname= document.createElement("div");
      elaccname.classList.add("page-choice-https");
      elaccname.innerText = accountDetails['https'][i];
      document.getElementById("accurl").appendChild(elaccname)
    }
  }
  if (accountDetails['http']) {
    console.log("ONE:" + accountDetails['http'].length);
    for (i in accountDetails['http']) {
      elaccname= document.createElement("div");
      elaccname.classList.add("page-choice-http");
      elaccname.innerText = accountDetails['http'][i];
      document.getElementById("accurl").appendChild(elaccname)
    }
  }
}

