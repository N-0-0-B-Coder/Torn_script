// ==UserScript==
// @name         [V.O.T.T] Target HP Percentage
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add percentage in target HP for Execute Bonus Weapon
// @author       DaoChauNghia[3029549]
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    var defenderElement;
    var isObserverDisconnected = false;

    // Create a MutationObserver to observe changes to the document
    let observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && !isObserverDisconnected) {
                // Select the "defender" element with the specified id and class name
                defenderElement = document.querySelector('#defender.player___BogMt');

                if (defenderElement) {
                    // The element exists, so stop observing
                    observer.disconnect();
                    isObserverDisconnected = true;
                    console.log('defenderElement found, observer disconnected');
                    console.log('defenderElement: ', defenderElement);
                    targetHP();
                }

                // If defenderElement is not found, try again with an alternative selector
                if (!defenderElement && !isObserverDisconnected) {
                    console.error('defenderElement not found, trying again');
                }
            }
        }
    });

    // Options for the observer (which mutations to observe)
    let config = { childList: true, subtree: true };

    // Start observing the document with the configured mutations
    observer.observe(document, config);

    // Function to handle the target HP logic
    function targetHP() {
        // Select the relevant elements within the defenderElement
        let targetElement = defenderElement.querySelector('.header___gISeK > .topWrap___mZum5 > .textEntries___bbjd5');
        if (targetElement) {
            console.log('targetElement: ', targetElement);
        }

        let thirdEntryElement = targetElement?.getElementsByClassName('entry___m0IK_')[2]; // get the third element
        if (thirdEntryElement) {
            console.log('thirdEntryElement: ', thirdEntryElement);
        }

        let healthValueElement = thirdEntryElement?.querySelector('[id*="player-health-value"]'); // get the element with id containing "player-health-value"
        if (healthValueElement) {
            console.log('healthValueElement: ', healthValueElement);
        }

        // Check if healthValueElement exists
        if (healthValueElement) {
            // create percentage element
            let percentageElement = document.createElement('span');

            // Initialize the display with the initial health percentage
            let values = healthValueElement.innerHTML.split('/');
            let percentage = (parseInt(values[0]) / parseInt(values[1])) * 100;
            percentageElement.innerHTML = ' (' + percentage.toFixed(2) + '%)';

            // append percentage element to health value element
            healthValueElement.appendChild(percentageElement);

            // Create a MutationObserver instance for the target element
            let HPobserver = new MutationObserver((mutationsList, observer) => {
                for (let mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        console.log('A child node has been added or removed.');
                    } else if (mutation.type === 'attributes' && mutation.attributeName === 'innerHTML') {
                        console.log('The innerHTML was modified.');
                        let values = mutation.target.innerHTML.split('/');
                        let percentage = (parseInt(values[0]) / parseInt(values[1])) * 100;
                        console.log('Health percentage: ' + percentage.toFixed(2) + '%');

                        // Update the percentage display
                        percentageElement.innerHTML = ' (' + percentage.toFixed(2) + '%)';
                    }
                }
            });

            // Options for the observer (which mutations to observe)
            let HPconfig = { attributes: true, childList: true, subtree: true };

            // Start observing the target element with the configured mutations
            HPobserver.observe(healthValueElement, HPconfig);
        }
    }
})();
