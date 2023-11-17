// ==UserScript==
// @name         [V.O.T.T] Refill Notification
// @namespace    http://tampermonkey.net/
// @version      0.17
// @description  Notify user about daily refills with dots under user points
// @author       DaoChauNghia [3029549]
// @match        https://www.torn.com/*php*
// @exclude      https://www.torn.com/loader.php?sid=attack&user2ID=*
// @exclude      https://www.torn.com/preferences*
// @updateURL    https://github.com/N-0-0-B-Coder/Torn_script/raw/main/%5BV.O.T.T%5D%20Refill%20notification.user.js
// @downloadURL  https://github.com/N-0-0-B-Coder/Torn_script/raw/main/%5BV.O.T.T%5D%20Refill%20notification.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(async function () {
    'use strict';

    var controls = {}; // Initialize an empty dictionary to store controls

    // #region Save Settings

    // Function to save switch state
    function saveRefillSwitch() {
        localStorage.refillnoti = JSON.stringify(controls);
    }

    // Function to load switch state
    function loadRefillSwitch() {
        const storedControls = JSON.parse(localStorage.refillnoti || '{}');
        controls.refillswitch = storedControls.refillswitch || false;
    }

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

    // #endregion

    // #region Dot Creation

    // Function to create colored dot with character
    function createDot(color, condition, character) {
        const dot = document.createElement('div');
        dot.style.width = '10px';
        dot.style.height = '10px';
        dot.style.borderRadius = '50%';
        dot.style.marginRight = '5px';
        dot.style.backgroundColor = condition ? color : 'transparent';
        dot.style.color = condition && controls.refillswitch ? 'white' : 'transparent';
        dot.style.display = 'flex';
        dot.style.alignItems = 'center';
        dot.style.justifyContent = 'center';
        dot.innerText = character;
        return dot;
    }

    // Function to create switch button
    function createSwitchButton(refillBox) {
        const switchButton = document.createElement('a');
        switchButton.textContent = '[switch]';
        switchButton.className = 't-blue'; // Add "t-blue" class to the button
        switchButton.style.display = 'flex';
        switchButton.style.marginLeft = 'auto'; // Add the dots at the right of dots
        switchButton.style.cursor = 'pointer';
        switchButton.addEventListener('click', () => {
            controls.refillswitch = !controls.refillswitch;
            // Toggle the visibility of characters in the dots
            const dots = refillBox.querySelectorAll('div');
            dots.forEach(dot => {
                if (controls.refillswitch) {
                    dot.style.color = 'white';
                } else {
                    dot.style.color = 'transparent';
                }
            });
            saveRefillSwitch();
        });
        return switchButton;
    }

    // #endregion

    // #region API Key Validation

    // Function to check the API key
    async function checkApiKey(apiKey) {
        const apiUrl = `https://api.torn.com/user/?selections=refills&key=${apiKey}`;

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
                    alert(`[Refill Notification] Error. Please enter a valid limited Torn API key.`);
                    askforapikey();
                    return; // Terminate the script to prevent further execution
                }
            }
        } catch (error) {
            console.error(`Error during API key validation: ${error}`);

            // If access level is not high enough or incorrect key, re-ask the user for the API key
            if (error === 'Access level of this key is not high enough' || error === 'Incorrect key') {
                alert(`[Refill Notification] Error: ${error}. Please enter a valid Torn API key.`);
                GM_setValue('apiKey', 'null');
                return; // Terminate the script to prevent further execution
            }
        }
    }

    // #endregion

    loadRefillSwitch();

    // #region Main Script

    // Fetch data using the validated API key
    if (storedApiKey !== 'null') {
        try {
            const data = await checkApiKey(storedApiKey);

            // Create a box as a child element of the specified class element
            const pointBox = document.querySelectorAll('.point-block___rQyUK');
            const pointBlock = pointBox[2];
            const refillBox = document.createElement('div');
            refillBox.style.display = 'flex';
            refillBox.style.alignItems = 'center';

            // Create dots with characters for energy, nerve, and token refills
            const energyDot = createDot('#69a829', !data.refills.energy_refill_used, 'E');
            const nerveDot = createDot('#c66231', !data.refills.nerve_refill_used, 'N');
            const tokenDot = createDot('purple', !data.refills.token_refill_used, 'T');

            // Append dots to the refillBox
            refillBox.appendChild(energyDot);
            refillBox.appendChild(nerveDot);
            refillBox.appendChild(tokenDot);

            // Append the refillBox to the pointBlock
            if (pointBlock) {
                pointBlock.appendChild(refillBox);
            } else {
                console.error('Could not find the third .point-block element');
            }


            // Create a switch button
            const switchButton = createSwitchButton(refillBox);
            refillBox.appendChild(switchButton);

        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    } else {
        console.log('User has chosen not to provide an API key or entered an incorrect key.');

        // Clear stored API key so that the prompt is shown again on the next visit
        GM_setValue('apiKey', 'null');
    }

    // #endregion

})();