const body = document.body as HTMLBodyElement;
const cogIcon = document.getElementById('awsso-header') as HTMLDivElement;
const accountConfigDiv = document.getElementById('accountConfig') as HTMLDivElement;
const urlAddDiv = document.getElementById('add-url-container')  as HTMLDivElement;
// const hiddenBox = document.getElementById('hiddenBox')  as HTMLDivElement;
const urlForm = document.getElementById('url-form') as HTMLFormElement;
const firefoxViewport = document.getElementById('firefox-viewport') as HTMLDivElement;
const editMode = document.getElementById('edit-mode') as HTMLDivElement;

export const pp_cogIcon = cogIcon;
export const pp_accountConfigDiv = accountConfigDiv;
export const pp_urlAddDiv = urlAddDiv;
// export const pp_hiddenBox = hiddenBox;


export const pb_body = body;
export const pb_firefoxViewport = firefoxViewport;

export const ph_cogIcon = cogIcon;
export const ph_accountConfigDiv = accountConfigDiv;
export const ph_urlAddDiv = urlAddDiv;
// export const ph_hiddenBox = hiddenBox;
export const ph_urlForm = urlForm;
export const ph_firefoxViewport = firefoxViewport;
export const ph_editMode = editMode;