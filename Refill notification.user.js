// ==UserScript==
// @name         Refill Notification
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Notify user about daily refills with dots under user points
// @author       DaoChauNghia [3029549]
// @match        https://www.torn.com/*
// @exclude      https://www.torn.com/preferences*
// @grant        none
// ==/UserScript==

(async function () {
    'use strict';

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
    let apiKey = localStorage.getItem('tornApiKey');
    if (!apiKey || apiKey === 'null') {
        apiKey = prompt('Please enter your Torn API key:');
        if (!apiKey) {
            // User canceled the prompt, set API key to "null"
            apiKey = 'null';
        }
    }

    const verificationUrl = `https://api.torn.com/user/?selections=refills&key=${apiKey}`;

    try {
        const response = await fetch(verificationUrl);
        var data = await response.json();

        if (data.error && data.error.code === 2) {
            // Incorrect key, alert the user, set API key to "null", and reload the page
            alert('Incorrect API key. Please enter a valid Torn API key.');
            localStorage.setItem('tornApiKey', 'null');
            location.reload();
        } else {
            // API key is valid, store it
            localStorage.setItem('tornApiKey', apiKey);

            // Load the switch state before creating the switch button and dots
            loadRefillSwitch();

            // Create a box as a child element of the specified class element
            const pointBlock = document.querySelector('.point-block___rQyUK.tt-points-value');
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
            pointBlock.appendChild(refillBox);

            // Create a switch button
            const switchButton = createSwitchButton(refillBox);
            refillBox.appendChild(switchButton);
        }
    } catch (error) {
        console.error('Error verifying API key:', error);
        alert('Error verifying API key. Please try again.');
        localStorage.setItem('tornApiKey', 'null'); // Reset API key to "null" in case of an error
        location.reload();
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

})();
