# AWS Console Title Bar

## Firefox

about:debugging#/setup

### Firefox Submitting Extension

Submitting New Version to Firefox Extensions : https://addons.mozilla.org/en-US/developers/addons


## Chrome

chrome://extensions/


## Example

```json
{
    "urls":[
        {"url":"https://akfdev.com","title":"AKFDEV.con"}
        ,{"url":"https://akfdev.awsapps.com/start","title":"AWS Console: just-ak"}
        ,{"url":"https://d-9c6715bd19.awsapps.com/start","title":"AWS Console : TORG"}
    ]
}
```

## Developing  

Firefox : about:debugging#/runtime/this-firefox
https://addons.mozilla.org/en-US/developers/addon/aws-console-title-bar/versions/submit/

Chrome :

chrome://extensions/   -- Turn on Developer Mode & Load Unpacked

https://chrome.google.com/webstore/category/extensions

https://chrome.google.com/webstore/devconsole/80050481-57f7-4a10-8bb4-7e6dfe5bec47/jhenfbkjfncfbimbkhakchbdefigenfp/edit/package


## Current Problems
Browser Plugins don't resize correctly after creation.
HTML5 Colour Picker does not work on Firefox Browser Plugins correctly.   https://github.com/mdbassit/Coloris  has been used.