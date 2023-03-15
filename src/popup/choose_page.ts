function onUpdated(tab) {
  console.log(`Updated tab: ${tab.id}`);
}

function onError(error) {
  console.log(`Error: ${error}`);
}

document.addEventListener("click", function (e) {
  if ((e.target as HTMLElement).classList.contains("page-choice-https")) {
    var chosenPage = "https://" + (e.target as HTMLElement).textContent;
    var updating = chrome.tabs.update({url: chosenPage});
    updating.then(onUpdated, onError);
  }



  if ((e.target as HTMLElement).classList.contains("page-choice-http")) {
    var chosenPage = "http://" + (e.target as HTMLElement).textContent;
    var updating = chrome.tabs.update({url: chosenPage});
    updating.then(onUpdated, onError);
  }
  if ((e.target  as HTMLElement).classList.contains("page-choice-urls")) {
    var chosenPage =  (e.target as HTMLElement).dataset.url;
    var updating = chrome.tabs.update({url: chosenPage});
    updating.then(onUpdated, onError);
  }
});

document.addEventListener("DOMContentLoaded", function(){
  getAWSAccountName();
});


async function getAWSAccountName() {
  let promise = new Promise(function (resolve, reject) {
    chrome.storage.local.get('jsoninfo', function (response) {
      let accountDetails = JSON.parse(response.jsoninfo);
      resolve(accountDetails);
    })
  });
  let accountDetails = await promise
  let innerText = ""
  if (accountDetails['urls']) {
    console.log("A:" + accountDetails['urls'].length);
    for (let i in accountDetails['urls']) {
      let elementAccountName = document.createElement("div");
      elementAccountName.classList.add("page-choice-urls");
      elementAccountName.innerText = accountDetails['urls'][i]['title'];
      elementAccountName.dataset.url = accountDetails['urls'][i]['url'];
      document.getElementById("accurl").appendChild(elementAccountName)
    }
  }

  if (accountDetails['https']) {
    console.log("B:" + accountDetails['https'].length);
    for (let i in accountDetails['https']) {
      let elementAccountName= document.createElement("div");
      elementAccountName.classList.add("page-choice-https");
      elementAccountName.innerText = accountDetails['https'][i];
      elementAccountName.dataset
      document.getElementById("accurl").appendChild(elementAccountName)
    }
  }
  if (accountDetails['http']) {
    console.log("C:" + accountDetails['http'].length);
    for (let i in accountDetails['http']) {
      let elementAccountName= document.createElement("div");
      elementAccountName.classList.add("page-choice-http");
      elementAccountName.innerText = accountDetails['http'][i];
      document.getElementById("accurl").appendChild(elementAccountName)
    }
  }
}

