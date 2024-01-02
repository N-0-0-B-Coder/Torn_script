// Description: Library of functions for use in scripts

////////////////////////////////////////

// Function to keep finding until get the selector in the target(mostly document.body)
const waitFor = (target, selector) => {
    return new Promise(resolve => {
        if (target.querySelector(selector)) {
            return resolve(target.querySelector(selector));
        }
        const observer = new MutationObserver(mutations => {
            if (target.querySelector(selector)) {
                resolve(target.querySelector(selector));
                observer.disconnect();
            }
        });
        observer.observe(target, {
            childList: true,
            subtree: true
        });
    });
};
////////////////////////////////////////


/////////////////////localstorage///////////////////
// Function to save state using localStorage
function LocalStorage_SaveData(controls) {
    localStorage.state = JSON.stringify(controls);
}

// Function to load state using localStorage
function LocalStorage_LoadData() {
    const storedControls = JSON.parse(localStorage.state || '{}');
    controls.state = storedControls.state || false;
}
/////////////////////localstorage///////////////////


///////////////////////GM_Value/////////////////////
// Function to save state using GM_setValue
function GM_SaveData(controls) {
    GM_setValue('State', JSON.stringify(controls));
}

// Function to load state using GM_getValue
function GM_LoadData(controls) {
    const storedControls = JSON.parse(GM_getValue('State', '{}'));
    controls.state = storedControls.state || false;
}
///////////////////////GM_Value/////////////////////