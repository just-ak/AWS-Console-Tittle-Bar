import { debugLog } from '../../common/reference';
import {
  body,
  firefoxViewport
} from './dom';

export function resizeBody() {
  const newHeight = firefoxViewport.scrollHeight;
  const newWidth = firefoxViewport.scrollWidth;

  const maxWidth = 600; // Firefox's maximum width for popups
  const maxHeight = 800; // Firefox's maximum height for popups

  body.style.width = `${Math.min(newWidth, maxWidth)}px`;
  body.style.height = `${Math.min(newHeight, maxHeight)}px`;
  debugLog(`Resized popup to ${body.style.width} x ${body.style.height}`);
}
export function initializeBody() {
  const observer = new MutationObserver(() => {
    resizeBody();
  });
  observer.observe(firefoxViewport, { childList: true, subtree: true, characterData: true });
  resizeBody();
};
