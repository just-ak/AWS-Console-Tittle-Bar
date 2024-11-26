import { updatePopupUrls } from "./plugin_page";

export function initializeUrlList() {
    document.addEventListener('DOMContentLoaded', function () {
        updatePopupUrls();
    });
}