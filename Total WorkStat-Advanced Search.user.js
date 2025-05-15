// ==UserScript==
// @name         Total WorkStat-Advanced Search
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Present workstat value beside player name in advanced search
// @author       DaoChauNghia[3029549]
// @match        https://www.torn.com/page.php?sid=UserList*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.j
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(async function() {
    'use strict';

let GM_addStyle = function (s) {
        let style = document.createElement("style");
        style.innerHTML = s;
        document.head.appendChild(style);
    };
    GM_addStyle(`
.btn-wrap.advance-search-workstat {
    float: auto;
    margin-left: auto;
    z-index: 99999;
}
`);

    const observerTarget = $(".content-wrapper")[0];
    const observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };
    const unavailable = ['Traveling','Hospital','Federal','Jail'];
    const workstatCache = {};

    // #region API Key Validation

    // Function ask the user for the API key
    var storedApiKey = GM_getValue('apiKey');
    function askforapikey() {
        storedApiKey = prompt('Please enter your Torn API key (or click "Cancel" to skip):') || 'null';
        if (storedApiKey !== 'null') {
            GM_setValue('apiKey', storedApiKey);
            location.reload();
        } else {
            alert('You have chosen not to provide an API key. The script will not run.');
            GM_setValue('apiKey', storedApiKey);
        }
    }

    // Function to check the API key
    async function checkApiKey(apiKey) {
        const apiUrl = `https://api.torn.com/company/?selections=employees&key=${apiKey}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.error);
        }

        return response.json();
    }

    // Check if the API key is stored
    if (!storedApiKey || storedApiKey === 'null') {
        askforapikey();
    }

    // Check the API key everytime the website is loaded
    if (storedApiKey !== 'null') {
        try {
            const checkapi = await checkApiKey(storedApiKey);
            if (checkapi.error) {
                if (checkapi.error.code === 2 || checkapi.error.code === 16) {
                    alert(`Error. Please enter a valid limited Torn API key.`);
                    askforapikey();
                    return; // Terminate the script to prevent further execution
                } else if (checkapi.error.code === 6 || checkapi.error.code === 7) {
                    console.error(`[Employee Addiction] Error: ${checkapi.error.error}. \nAre you jobless or in TornJob? Script will not run.`);
                    return; // Terminate the script to prevent further execution
                }
            }
        } catch (error) {
            console.error(`Error during API key validation: ${error}`);

            // If access level is not high enough or incorrect key, re-ask the user for the API key
            if (error === 'Access level of this key is not high enough' || error === 'Incorrect key') {
                alert(`Error: ${error}. Please enter a valid Torn API key.`);
                GM_setValue('apiKey', 'null');
                return; // Terminate the script to prevent further execution
            }
        }
    }

    // #endregion

    let AdSearchobserver = new MutationObserver(function(mutations) {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains("user-info-list-wrap") || mutation.target.classList.contains("userlist-wrapper")) {
                let containerID = $("ul.user-info-list-wrap > li");
                containerID.each(function() {
                    let user = this.className;
                    let userID = user.replace("user", "");
                    let userIcons = $(this).find("div.level-icons-wrap > span.user-icons");
                    if (userIcons.length > 0 && !userIcons[0].querySelector(".advance-search-workstat")) {
                        insertWorkstat(userIcons[0], userID);
                    }
                    let iconWrap = this.querySelector('span.icons-wrap');
                    iconWrap.style.display = 'inline';
                    let iconTray = this.querySelector('span.icons-wrap > ul#iconTray');
                    iconTray.style.display = 'inline';
                    let status = this.querySelectorAll('ul#iconTray > li');
                    for(let s of status){
                        if (unavailable.some(u=> s.title.includes(u))){
                            this.style.display = 'none';
                        }
                    }
                });
            }
        });
    });

    AdSearchobserver.observe(observerTarget, observerConfig);

    function insertWorkstat(element, ID){
        // If we already have the value, use it
        if (workstatCache[ID] !== undefined) {
            addWSBlock(element, workstatCache[ID]);
            return;
        }

        console.log(`https://api.torn.com/v2/user/${ID}/hof?key=${storedApiKey}`);

        // Otherwise, fetch and cache
        fetch(`https://api.torn.com/v2/user/${ID}/hof?key=${storedApiKey}`)
            .then(response => response.json())
            .then(data => {
                let value = (data && data.hof && data.hof.working_stats) ? data.hof.working_stats.value : 'N/A';
                workstatCache[ID] = value;
                addWSBlock(element, value);
            })
            .catch(error => {
                addWSBlock(element, 'N/A');
            });
    }

    // Separate function to add the block
    function addWSBlock(element, value) {
        const outerspanatk = document.createElement('span');
        outerspanatk.className = 'bold btn-wrap advance-search-workstat';

        const wsBlock = document.createElement('div');
        wsBlock.textContent = value;
        wsBlock.style.padding = '6px 16px';
        wsBlock.style.background = 'transparent';
        wsBlock.style.color = '#fff';
        wsBlock.style.borderRadius = '4px';
        wsBlock.style.display = 'inline-block';
        wsBlock.style.cursor = 'default';
        wsBlock.style.fontWeight = 'bold';
        wsBlock.style.fontSize = '16px';
        wsBlock.style.width = 'auto';

        outerspanatk.appendChild(wsBlock);
        element.append(outerspanatk);
    }

})();