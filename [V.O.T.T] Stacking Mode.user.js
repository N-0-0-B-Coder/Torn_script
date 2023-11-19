// ==UserScript==
// @name         [V.O.T.T] Stacking Mode
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Stacking mode on E-Bar to prevent gym while stacking.
// @updateURL    https://github.com/N-0-0-B-Coder/Torn_script/raw/main/%5BV.O.T.T%5D%20Stacking%20Mode.user.js
// @downloadURL  https://github.com/N-0-0-B-Coder/Torn_script/raw/main/%5BV.O.T.T%5D%20Stacking%20Mode.user.js
// @author       DaoChauNghia [3029549]
// @match        https://www.torn.com/*php*
// @exclude      https://www.torn.com/loader.php?sid=attack&user2ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    var controls = {}; // Initialize an empty dictionary to store controls

    // Function to save switch state
    function saveStackSwitch() {
        GM_setValue('StackMode', JSON.stringify(controls));
    }

    // Function to load switch state
    function loadStackSwitch() {
        const storedControls = JSON.parse(GM_getValue('StackMode', '{}'));
        controls.StackEnabled = storedControls.StackEnabled || false;
    }

    // Function to create switch button
    function createSwitchButton() {
        const switchButton = document.createElement('a');
        if (controls.StackEnabled) {
            switchButton.textContent = '[stacking enaled]';
        } else {
            switchButton.textContent = '[stacking disabled]';
        }
        switchButton.className = 't-blue'; // Add "t-blue" class to the button
        switchButton.style.display = 'flex';
        switchButton.style.marginLeft = 'auto'; // Add the dots at the right of dots
        switchButton.style.cursor = 'pointer';
        switchButton.addEventListener('click', () => {
            controls.StackEnabled = !controls.StackEnabled;

            if (controls.StackEnabled) {
                switchButton.textContent = '[stacking enaled]';
            } else {
                switchButton.textContent = '[stacking disabled]';
            }
            saveStackSwitch();
        });
        return switchButton;
    }

    // Function to add an image element based on GymTable display
    function addImageBasedOnDisplay(GymTable) {
        const imageSrc = 'https://i.postimg.cc/BnsZBgqX/not-lazy.png';
        const imageElement = document.createElement('img');
        imageElement.src = imageSrc;
        imageElement.style.width = '100%'; // Adjust the width as needed

        // Check if GymTable display is "none"
        if (controls.StackEnabled) {
            imageElement.style.display = 'block'; // Set the display style for the image
        } else {
            imageElement.style.display = 'none'; // Set the display style for the image
        }

        // Insert the image element before the GymTable
        GymTable.parentNode.insertBefore(imageElement, GymTable);
    }

    loadStackSwitch();

    // Function to add switch button to the page
    const EnerBar = document.querySelector('.bar___Bv5Ho').parentNode.insertBefore(createSwitchButton(), document.querySelectorAll('.bar___Bv5Ho')[0]);
    console.log(EnerBar.parentNode);
    if (window.location.href.match('https://www.torn.com/gym.php')) {
        let GymTable = document.querySelector('div#gymroot');
        console.log(GymTable);
        addImageBasedOnDisplay(GymTable);
        if (controls.StackEnabled) {
            GymTable.style.display = 'none';
        } else {
            GymTable.style.display = 'block';
        }
    }
    //EnerBar.parentNode.insertBefore(createSwitchButton(), 'bar___Bv5Ho');
    //EnerBar.appendChild(switchButton);
})();