// ==UserScript==
// @name         Quick Trade BUtton for YFT (Your Favorite Traders) - Simple Eddition
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Quick Trade button in chat with your traderlist without opening profile page to trade with them.
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
        tradeButton.innerHTML = "Trade!";
        tradeButton.classList.add("torn-btn");
        tradeButton.id = "TradeButton" + traderID[name];
        tradeButton.addEventListener("click", function () {
            window.open("https://www.torn.com/trade.php#step=start&userID=" + traderID[name]);
        });
        return tradeButton;
    }

    function addTradeButtonToChat(chatElement) {
        const chatName = chatElement.querySelector("div > div.chat-box-header___P15jw > button > p").innerText;
        if (traderlist.includes(chatName) && !chatElement.querySelector("#TradeButton" + traderID[chatName])) {
            const tradeButton = createTradeButton(chatName);
            const chatFooter = chatElement.querySelector("div > div.chat-box-footer___YK914 > textarea");
            chatFooter.after(tradeButton);
        }
    }

    // Function to be called when a new element is added
    function handleNewElements(mutations) {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.matches("#chatRoot > div > div > section.chat-app__chat-list-chat-box-wrapper___S7MmX > div > div")) {
                        addTradeButtonToChat(node);
                    }
                });
            }
        });
    }

    // Observe changes in the DOM
    const observer = new MutationObserver(handleNewElements);
    const chatListContainer = document.querySelector("#chatRoot > div > div > section.chat-app__chat-list-chat-box-wrapper___S7MmX");
    observer.observe(chatListContainer, { childList: true, subtree: true });

    // Add trade buttons to existing elements
    const currentChat = document.querySelectorAll("#chatRoot > div > div > section.chat-app__chat-list-chat-box-wrapper___S7MmX > div > div");
    currentChat.forEach(addTradeButtonToChat);
})();