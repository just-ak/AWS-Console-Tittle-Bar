export function initializeTabs() {

  const tab = document.getElementById('tab');

  tab.addEventListener('click', function (e) {
    if (!(e.target as HTMLElement).dataset.tabName) return;
    openTab((e.target as HTMLElement), (e.target as HTMLElement).dataset.tabName);
  });

  function openTab(event, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      (tabcontent[i] as HTMLElement).style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      (tablinks[i] as HTMLElement).classList.remove("active");
    }
    document.getElementById(tabName).style.display = "block";
    (event as HTMLElement).classList.add("active");
  }
  (document.getElementsByClassName('tablinks')[0] as HTMLElement).click();
}