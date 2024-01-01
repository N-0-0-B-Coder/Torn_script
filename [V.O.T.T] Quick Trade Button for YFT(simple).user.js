// ==UserScript==
// @name         Quick Trade Button for YFT (Simple)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Quick Trade Button for YFT (Your Favorite Traders) - Simple Eddition: Quick Trade button in chat with your traderlist without opening profile page to trade with them.
// @author       DaoChauNghia[3029549]
// @match        https://www.torn.com/*php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const traderlist = ["Qwerty1326", "Khang2412"];
    const traderID = { "Qwerty1326": 3022432, "Khang2412": 2353835 };

    function createTradeButton(name) {
        const tradeButton = document.createElement("button");
        tradeButton.type = "button";
        tradeButton.classList.add("chat-box-options__button___O1B8v");
        tradeButton.id = "TradeButton" + traderID[name];
        tradeButton.addEventListener("click", function () {
            window.open("https://www.torn.com/trade.php#step=start&userID=" + traderID[name]);
        });

        const tradeButtonDiv = document.createElement("div");
        tradeButtonDiv.classList.add("chat-box-options__items___Vwu4d");
        tradeButton.appendChild(tradeButtonDiv);

        const tradeButtonSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        tradeButtonSvg.setAttribute("width", "20");
        tradeButtonSvg.setAttribute("height", "20");
        tradeButtonSvg.setAttribute("fill", "none");
        tradeButtonSvg.setAttribute("viewBox", "0 0 24 24");
        tradeButtonSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        tradeButtonSvg.classList.add("chat-box-options__icon___puJ7U");
        tradeButtonSvg.innerHTML = '<path d="M 11.22 8.12 v 2.16 l -5.04 -5.04 l 5.04 -5.04 v 2.16 s 10.35 0 10.98 12.06 A 10.2861 10.2861 90 0 0 11.22 8.12 Z m -8.82 1.26 c 0.72 12.06 10.98 12.06 10.98 12.06 V 23.6 l 5.04 -5.04 l -5.04 -5.04 v 2.16 A 10.2861 10.2861 90 0 1 2.4 9.38 Z"></path>';
        tradeButtonDiv.appendChild(tradeButtonSvg);

        const tradeButtonP = document.createElement("p");
        tradeButtonP.classList.add("typography___Dc5WV", "body4", "color-#333333", "chat-box-options__label___QSXin");
        tradeButtonP.innerHTML = "Trade!";
        tradeButtonDiv.appendChild(tradeButtonP);

        return tradeButton;
    }

    function addTradeButtonToChat(chatElement) {
        const chatName = chatElement.parentNode.querySelector("div.chat-box-header___P15jw > button > p").innerText;
        if (traderlist.includes(chatName) && !chatElement.querySelector("#TradeButton" + traderID[chatName])) {
            const tradeButton = createTradeButton(chatName);
            const chatinfo = chatElement.querySelector("div:nth-child(1) > button:nth-child(1)");
            chatinfo.after(tradeButton);
        }
    }

    // Function to be called when a new element is added
    function handleNewElements(mutations) {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.matches(".chat-box-options___XoTAR")) {
                        addTradeButtonToChat(node);
                    }
                });
            }
        });
    }

    // Observe changes in the DOM
    const observer = new MutationObserver(handleNewElements);
    const chatListContainer = document.querySelector(".chat-app__chat-list-chat-box-wrapper___S7MmX");
    observer.observe(chatListContainer, { childList: true, subtree: true });
    
})();