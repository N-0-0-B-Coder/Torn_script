// ==UserScript==
// @name         Chain Watcher
// @description  Glows colors to remember you to keep the chain alive
// @author       Steejo [3014487]
// @version      1.0
// @match        https://www.torn.com/*
// ==/UserScript==

(function() {
    'use strict';

    // Replace 'bar-timeleft' with the partial class name you want to watch
    const targetClassName = 'bar-timeleft';

    let timer = null;

    // Function to log the innerHTML of the target element
    const logInnerHTML = (mutationsList) => {
        mutationsList.forEach((mutation) => {
            if (mutation.type === 'childList') {
                const targetElement = document.querySelector(`[class^="${targetClassName}"]`);
                if (targetElement) {
                    timer = targetElement.innerHTML;
                }
            }
        });
    };

    // Function to set the shadow color based on the time left
    const setImmediateColor = () => {
        const time = timer.split(':');
        const minutes = parseInt(time[0]);
        const seconds = parseInt(time[1]);

        if (minutes >=4) {
            return;
        } else if (minutes >= 3) {
            changeShadowColor(settings.green.color);
        } else if (minutes >= 2) {
            changeShadowColor(settings.orange.color);
        } else {
            changeShadowColor(settings.red.color);
        }
    };

    // Create a MutationObserver instance
    const observer = new MutationObserver(logInnerHTML);

    // Get the document body element to watch for changes
    const bodyElement = document.body;

    // Start observing the body for changes to child elements
    observer.observe(bodyElement, { childList: true, subtree: true });

    // Edit these settings as needed (color, minutes, seconds)
    const settings = {
        green: { color: '#00FF00', minutes: [27, 57], seconds: 30 },
        orange: { color: '#FFA500', minutes: [29, 59], seconds: 0 },
        red: { color: '#FF0000', minutes: [29, 59], seconds: 50 }
    };

    const elements = [
        '#header-root',
        '#sidebarroot',
        '.content-wrapper.summer',
        '._chat-box-wrap_1pskg_111'
    ];

    const changeShadowColor = (color) => {
        // Remove existing animation style
        const existingStyle = document.getElementById('breathe-animation');
        if (existingStyle) existingStyle.remove();

        // Add new animation style
        const style = document.createElement('style');
        style.id = 'breathe-animation';
        style.innerHTML = `
            @keyframes breathe {
                0% { box-shadow: 0 0 5px ${color}; }
                50% { box-shadow: 0 0 20px ${color}, 0 0 30px ${color}; }
                100% { box-shadow: 0 0 5px ${color}; }
            }
        `;
        document.head.appendChild(style);

        for (const selector of elements) {
            const element = document.querySelector(selector);
            if (element) {
                element.style.animation = 'none';
                element.offsetHeight; // Trigger reflow
                element.style.animation = 'breathe 1s infinite';
            }
        }
    };

    // Set the shadow color every second
    setInterval(setImmediateColor, 1000);

})();
