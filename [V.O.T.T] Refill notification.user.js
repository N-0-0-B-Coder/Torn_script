// ==UserScript==
// @name         [V.O.T.T] Refill Notification
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Notify user about daily refills with dots under user points
// @author       DaoChauNghia [3029549]
// @match        https://www.torn.com/*php*
// @exclude      https://www.torn.com/preferences*
// @updateURL    https://github.com/N-0-0-B-Coder/Torn_script/raw/main/%5BV.O.T.T%5D%20Refill%20notification.user.js
// @downloadURL  https://github.com/N-0-0-B-Coder/Torn_script/raw/main/%5BV.O.T.T%5D%20Refill%20notification.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(async function () {
    'use strict';
    window.onload = async function () {
        var controls = {}; // Object to store controls

        // Function to save switch state
        function saveRefillSwitch() {
            localStorage.refillnoti = JSON.stringify(controls);
        }

        // Function to load switch state
        function loadRefillSwitch() {
            const storedControls = JSON.parse(localStorage.refillnoti || '{}');
            controls.refillswitch = storedControls.refillswitch || false;
        }

        // Verify the stored API key
        let apiKey = GM_getValue('tornApiKey', 'null');
        if (!apiKey || apiKey === 'null') {
            apiKey = prompt('[RefillNotification] Please enter your Torn API key:');
            if (!apiKey) {
                // User canceled the prompt, set API key to "null"
                apiKey = 'null';
            }
        }

        const verificationUrl = `https://api.torn.com/user/?selections=refills&key=${apiKey}`;

        try {
            const response = await fetch(verificationUrl);
            var data = await response.json();

            if (data && data.error && data.error.code === 2) {
                // Incorrect key, alert the user, set API key to "null", and reload the page
                if (apiKey === 'null') {
                    // User canceled the prompt, do not reload the page
                    alert('[RefillNotification] You have chosen not to provide an API key. The script will not run.');
                    return;
                } else {
                    alert('[RefillNotification] Incorrect API key. Please enter a valid Torn API key.');
                    GM_setValue('tornApiKey', 'null');
                    location.reload();
                }
            } else {
                // API key is valid, store it
                GM_setValue('tornApiKey', apiKey);

                // Load the switch state before creating the switch button and dots
                loadRefillSwitch();

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
            }
        } catch (error) {
            console.error('[RefillNotification] Error verifying API key:', error);
            alert('[RefillNotification] Error verifying API key. Please try again.');
            GM_setValue('tornApiKey', 'null'); // Reset API key to "null" in case of an error
            //location.reload();
        }

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
    };
})();
