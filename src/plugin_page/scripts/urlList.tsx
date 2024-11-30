import { updatePopupUrls } from "./pluginPage";

export function initializeUrlList() {
    document.addEventListener('DOMContentLoaded', function () {
        updatePopupUrls();
    });
}