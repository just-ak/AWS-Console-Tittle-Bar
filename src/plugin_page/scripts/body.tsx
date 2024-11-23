const { pp_debugLog } = require('../../common/reference');
const {
    pb_body,
    pb_firefoxViewport
  } = require('./dom');

function resizeBody() {
    const newHeight = pb_firefoxViewport.scrollHeight;
    const newWidth = pb_firefoxViewport.scrollWidth;
  
    const maxWidth = 600; // Firefox's maximum width for popups
    const maxHeight = 800; // Firefox's maximum height for popups
  
    pb_body.style.width = `${Math.min(newWidth, maxWidth)}px`;
    pb_body.style.height = `${Math.min(newHeight, maxHeight)}px`;
    pp_debugLog(`Resized popup to ${pb_body.style.width} x ${pb_body.style.height}`);

  }
  

  export function initializeBody() {

  // Use MutationObserver to detect changes in the DOM
const observer = new MutationObserver(() => {
    resizeBody(); // Call resizeBody whenever the DOM changes
  });
  
  // Configure the observer to monitor child changes and content updates
  observer.observe(pb_firefoxViewport, { childList: true, subtree: true, characterData: true });
  
  // Initial resize based on content size
  resizeBody();

};

export const pb_resizeBody = resizeBody;