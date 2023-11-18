// ==UserScript==
// @name         [V.O.T.T] Target HP Percentage
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add percentage in target HP for Execute Bonus Weapon
// @author       DaoChauNghia[3029549]
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    var defenderElement;
    var isObserverDisconnected = false;
    var percentageElement;

    // Options for the observer (which mutations to observe)
    let config = { attributes: true, childList: true, subtree: true, characterData: true };

    // Create a MutationObserver to observe changes to the document
    let observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && !isObserverDisconnected) {
                // Select the "defender" element with the specified id and class name
                defenderElement = document.querySelector('#defender.player___BogMt .header___gISeK .topWrap___mZum5 .textEntries___bbjd5 .entry___m0IK_:nth-child(3)');

                if (defenderElement) {
                    // The element exists, so stop observing
                    observer.disconnect();
                    isObserverDisconnected = true;

                    console.log('defenderElement: ', defenderElement);

                    // Start observing the new healthValueElement
                    observeHealthValueElement();

                    targetHP();
                }

                // If defenderElement is not found, try again with an alternative selector
                if (!defenderElement) {
                    console.error('defenderElement not found, trying again');
                }
            }
        }
    });

    // Start observing the document with the configured mutations
    observer.observe(document, config);

    // Function to handle the target HP logic
    function targetHP() {
        if (percentageElement) {
            percentageElement.remove();
        }

        // create percentage element
        percentageElement = document.createElement('span');

        // append percentage element to health value element
        defenderElement.appendChild(percentageElement);
        updatePercentageDisplay();

        console.log('defenderElement: ', defenderElement);
    }

    // Function to observe changes to the healthValueElement
    function observeHealthValueElement() {

        // Create a MutationObserver instance for the target element
        let HPobserver = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    console.log('A child node or attribute has been modified.');
                    updatePercentageDisplay();
                }
            }
        });

        // Options for the observer (which mutations to observe)
        let HPconfig = { attributes: true, childList: true, subtree: true, characterData: true };

        // Start observing the target element with the configured mutations
        HPobserver.observe(defenderElement, HPconfig);
    }

    // Function to update the percentage display
    function updatePercentageDisplay() {
        let values = defenderElement.childNodes[1].innerHTML.split('/');
        let percentage = (parseInt(values[0].replace(/,/g, '')) / parseInt(values[1].replace(/,/g, ''))) * 100;
        percentageElement.innerHTML = ' (' + percentage.toFixed(2) + '%)';
    }
})();
