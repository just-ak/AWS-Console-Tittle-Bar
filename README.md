# AWS Console Title Bar

AWS Console does not show which account you are  logged into.

Enter a small JSON file with the id and description to be displayed in the title bar.


## Firefox

about:debugging#/setup

### Firefox Submitting Extension

Submitting New Version to Firefox Extensions : https://addons.mozilla.org/en-US/developers/addons


## Chrome

chrome://extensions/


## Example

```json
{
    "238190811919":{"id":"Just AK","color":"red"},
    "055112749202":{"id":"Audit","color":"green"},
    "757298465818":{"id":"Developer One"},
    "602959098990":{"id":"Example"},
    "urls":[
        {"url":"https://akfdev.com","title":"AKFDEV.con"}
        ,{"url":"https://akfdev.awsapps.com/start","title":"AWS Console: just-ak"}
        ,{"url":"https://d-9c6715bd19.awsapps.com/start","title":"AWS Console : TORG"}
    ]
}
```