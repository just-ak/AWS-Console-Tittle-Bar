#  AWS Console Title Bar
  
  
##  Export / Import of URL's
  
  
  
```json
{
    "urls":[
        {"url":"https://akfdev.com","title":"AKFDEV.con"}
        ,{"url":"https://akfdev.awsapps.com/start","title":"AWS Console: just-ak"}
        ,{"url":"https://d-9c6715bd19.awsapps.com/start","title":"AWS Console : TORG"}
    ]
}
```
  
##  Developing  
  
  
##  Firefox
  
  
Submitting Extension :[https://addons.mozilla.org/en-US/developers/addons]( )
  
Debugging : [about:debugging#/runtime/this-firefox]( )
  
Use the Inspect option within the plugins section.
![Inspect](./docs/FirefoxDebug.png )
https://addons.mozilla.org/en-US/developers/addon/aws-console-title-bar/versions/submit/
  
Chrome :
  
chrome://extensions/   -- Turn on Developer Mode & Load Unpacked
  
https://chrome.google.com/webstore/category/extensions
  
https://chrome.google.com/webstore/devconsole/80050481-57f7-4a10-8bb4-7e6dfe5bec47/jhenfbkjfncfbimbkhakchbdefigenfp/edit/package
  
  
##  Current Problemss
  
Browser Plugins don't resize correctly after creation.
HTML5 Colour Picker does not work on Firefox Browser Plugins correctly.   https://github.com/mdbassit/Coloris  has been used.
  
##  Manifest V3 Migration
  
  
https://developer.chrome.com/docs/extensions/migrating/to-service-workers/#move-dom-and-window
  