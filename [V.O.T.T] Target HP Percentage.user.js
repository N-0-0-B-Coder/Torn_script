// ==UserScript==
// @name         [V.O.T.T] Target HP Percentage
// @namespace    http://tampermonkey.net/
// @version      1.0
// @updateURL    https://github.com/N-0-0-B-Coder/Torn_script/raw/main/%5BV.O.T.T%5D%20Target%20HP%20Percentage.user.js
// @downloadURL  https://github.com/N-0-0-B-Coder/Torn_script/raw/main/%5BV.O.T.T%5D%20Target%20HP%20Percentage.user.js
// @description  Add percentage in target HP for Bonus Weapon
// @author       DaoChauNghia[3029549]
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    var defenderElement;
    var percentageElement;
    // Function to awwait for selector
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
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    };

    waitFor(document.body, '.entry___m0IK_:nth-child(5)').then((defenderElement) => {
        console.log('defenderElement: ', defenderElement);

        // create percentage element
        percentageElement = document.createElement('span');

        // append percentage element to health value element
        defenderElement.appendChild(percentageElement);
        updatePercentageDisplay(defenderElement);
        updateHP(defenderElement, defenderElement);
    });

    function updateHP(target, selector) {
        // Create a MutationObserver instance for the target element
        const HPobserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                updatePercentageDisplay(selector);
            });
        });
        // Options for the observer (which mutations to observe)
        let HPconfig = { attributes: true, childList: true, subtree: true, characterData: true };

        // Start observing the target element with the configured mutations
        HPobserver.observe(target.childNodes[1], HPconfig);
    }

    // Function to update the percentage display
    function updatePercentageDisplay(target) {
        let values = target.childNodes[1].innerHTML.split('/');
        let percentage = (parseInt(values[0].replace(/,/g, '')) / parseInt(values[1].replace(/,/g, ''))) * 100;
        percentageElement.innerHTML = ' (' + percentage.toFixed(2) + '%)';
    }
})();
