function onUpdated(tab) {
  console.log(`Updated tab: ${tab.id}`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("page-choice-https")) {
    var chosenPage = "https://" + e.target.textContent;
    var updating = chrome.tabs.update({url: chosenPage});
    updating.then(onUpdated, onError);  
  }
  if (e.target.classList.contains("page-choice-http")) {
    var chosenPage = "http://" + e.target.textContent;
    var updating = chrome.tabs.update({url: chosenPage});
    updating.then(onUpdated, onError);  
  }
  if (e.target.classList.contains("page-choice-urls")) {
    var chosenPage =  e.target.dataset.url;
    var updating = chrome.tabs.update({url: chosenPage});
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
  if (accountDetails['urls']) {
    console.log("A:" + accountDetails['urls'].length);
    for (i in accountDetails['urls']) {
      elaccname= document.createElement("div");
      elaccname.classList.add("page-choice-urls");
      elaccname.innerText = accountDetails['urls'][i]['title'];
      elaccname.dataset.url = accountDetails['urls'][i]['url'];
      document.getElementById("accurl").appendChild(elaccname)
    }
  }

  if (accountDetails['https']) {
    console.log("B:" + accountDetails['https'].length);
    for (i in accountDetails['https']) {
      elaccname= document.createElement("div");
      elaccname.classList.add("page-choice-https");
      elaccname.innerText = accountDetails['https'][i];
      elaccname.dataset
      document.getElementById("accurl").appendChild(elaccname)
    }
  }
  if (accountDetails['http']) {
    console.log("C:" + accountDetails['http'].length);
    for (i in accountDetails['http']) {
      elaccname= document.createElement("div");
      elaccname.classList.add("page-choice-http");
      elaccname.innerText = accountDetails['http'][i];
      document.getElementById("accurl").appendChild(elaccname)
    }
  }
}

