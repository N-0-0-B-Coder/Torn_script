// ==UserScript==
// @name         Target HP Percentage
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add percentage in target HP for Execute Bonus Weapon
// @author       DaoChauNghia[3029549]
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// ==/UserScript==

/*
function addPercentage(){
    let targetHP = document.querySelector('[id*="player-health-value"]');
    let values = targetHP.innerHTML.split('/');
    let percentage = (parseInt(values[0]) / parseInt(values[1])) * 100;
    targetHP.innerHTML = values[0] + '/' + values[1] + ' (' + percentage + '%)';
}
*/

(function () {
    'use strict';

    // Your code here...

    // Create a MutationObserver instance
 
    // Select the element
    let element = document.querySelector('.content-wrapper > .coreWrap___LtSEy > .playersModelWrap___rZigq > .players___WPQ05');

    // Select the player element
    let playerelement = element.getElementsByClassName("player___BogMt")[1]; // get the second element


    let targetElement = playerelement.querySelector('.header___gISeK > .topWrap___mZum5 > .textEntries___bbjd5');
 

    let SixEntryElement = targetElement.getElementsByClassName('entry___m0IK_')[2]; // get the third element


    let healthValueElement = SixEntryElement.querySelector('[id*="player-health-value"]'); // get the element with id containing "player-health-value"

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

        // Create a MutationObserver instance
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
})();
