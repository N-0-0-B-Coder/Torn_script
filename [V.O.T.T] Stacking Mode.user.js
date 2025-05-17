// ==UserScript==
// @name         Total WorkStat-Advanced Search
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @updateURL    https://github.com/N-0-0-B-Coder/Torn_script/raw/main/Total%20WorkStat-Advanced%20Search.user.js
// @downloadURL  https://github.com/N-0-0-B-Coder/Torn_script/raw/main/Total%20WorkStat-Advanced%20Search.user.js
// @description  Present workstat value beside player name in advanced search
// @author       DaoChauNghia[3029549]
// @match        https://www.torn.com/page.php?sid=UserList*
// @match        https://www.torn.com/profiles.php*
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

    // #region WorkStat Filter Switch

    var controls = {}; // Initialize an empty dictionary to store controls

    // Function to save switch state
    function swSaveFilterSwitch() {
        GM_setValue('WSFFilter', JSON.stringify(controls));
    }

    // Function to load switch state
    function swLoadFilterSwitch() {
        const storedControls = JSON.parse(GM_getValue('WSFFilter', '{}'));
        controls.StackEnabled = storedControls.StackEnabled || false;
    }

    // Function to create switch button
    function createSwitchButton() {
        const switchButton = document.createElement('a');
        if (controls.StackEnabled) {
            switchButton.textContent = '[WorkStatFilter enabled]';
        } else {
            switchButton.textContent = '[WorkStatFilter disabled]';
        }
        switchButton.className = 't-blue'; // Add "t-blue" class to the button
        switchButton.style.display = 'flex';
        switchButton.style.marginLeft = 'auto'; // Add the dots at the right of dots
        switchButton.style.cursor = 'pointer';
        switchButton.addEventListener('click', () => {
            controls.StackEnabled = !controls.StackEnabled;

            if (controls.StackEnabled) {
                switchButton.textContent = '[WorkStatFilter enabled]';
            } else {
                switchButton.textContent = '[WorkStatFilter disabled]';
            }
            swSaveFilterSwitch();
        });
        return switchButton;
    }

    // #endregion WorkStat Filter Switch

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

    // #endregion API Key Validation

    swLoadFilterSwitch(); // Load the switch state

    // Function to add switch button to the page
    const SWFilterBar = document.querySelector('.bar___Bv5Ho').parentNode.insertBefore(createSwitchButton(), document.querySelectorAll('.bar___Bv5Ho')[0]);

    // Only run the script on the specific page
    if (window.location.pathname === '/page.php' && window.location.search.startsWith('?sid=UserList')) {
        const observerTarget = $(".content-wrapper")[0];
        const observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };
        var unavailable = [];
        if (controls.StackEnabled) {
            unavailable = ['Job','Federal'];
        } else {
            unavailable = ['Federal'];
        }
        const workstatCache = {};


        let AdSearchobserver = new MutationObserver(function(mutations) {
            mutations.forEach((mutation) => {
                if (
                    mutation.target.classList.contains("user-info-list-wrap") ||
                    mutation.target.classList.contains("userlist-wrapper")
                ) {
                    let containerID = $("ul.user-info-list-wrap > li");
                    containerID.each(function () {
                        let status = this.querySelectorAll('ul#iconTray > li');
                        // Check if any status is unavailable
                        let isUnavailable = false;
                        for (let s of status) {
                            if (unavailable.some(u => s.title.includes(u))) {
                                this.style.display = 'none';
                                isUnavailable = true;
                                break;
                            }
                        }
                        if (isUnavailable) return; // Skip further processing for this user

                        let user = this.className;
                        let userID = user.replace("user", "");
                        let userIcons = $(this).find("div.level-icons-wrap > span.user-icons");
                        if (
                            userIcons.length > 0 &&
                            !userIcons[0].hasAttribute('data-ws-processed')
                        ) {
                            userIcons[0].setAttribute('data-ws-processed', 'true');
                            // Remove any existing block before adding a new one
                            let existing = userIcons[0].querySelector('.advance-search-workstat');
                            if (existing) existing.remove();
                            insertWorkstat(userIcons[0], userID);
                        }
                        let iconWrap = this.querySelector('span.icons-wrap');
                        iconWrap.style.display = 'inline';
                        let iconTray = this.querySelector('span.icons-wrap > ul#iconTray');
                        iconTray.style.display = 'inline';
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
    }

    if (window.location.pathname === '/profiles.php') {

        let profileRoot = document.querySelector('.core-layout__viewport > .user-profile');
        let ProfileWrapper = profileRoot.getElementsByClassName('profile-wrapper')[2]; // get the third element
        let BasicInfo = ProfileWrapper.getElementsByClassName('info-table')[0];
        let UserInfo = BasicInfo.childNodes[1];
        let UserInfoTable = UserInfo.childNodes[1];

        let UserWorkStat = document.createElement('span');


        let userID = window.location.search.replace("?XID=", "");
        fetch(`https://api.torn.com/v2/user/${userID}/hof?key=${storedApiKey}`)
            .then(response => response.json())
            .then(data => {
            let value = (data && data.hof && data.hof.working_stats) ? data.hof.working_stats.value : 'N/A';
            if (typeof value === 'number') {
                value = value.toLocaleString();
            }

            UserWorkStat.innerHTML = " (WorkStat: " + value + ")";
            UserInfoTable.appendChild(UserWorkStat);
            })
            .catch(error => {
            UserWorkStat.innerHTML = " (WorkStat: ERROR)";
            UserInfoTable.appendChild(UserWorkStat);
            });
    }

})();
