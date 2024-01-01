// ==UserScript==
// @name         Quick Trade Button for YFT (Adv)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Quick Trade Button for YFT (Your Favorite Traders) - Advance Eddition: Quick Trade button in chat with your traderlist without opening profile page to trade with them. Go to their profile and add your favorite traders before using.
// @author       DaoChauNghia[3029549]
// @match        https://www.torn.com/*php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    //#region createTradeButton

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

    //#endregion

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

    //#region addTradeListInProfile
    if (window.location.href.startsWith("https://www.torn.com/profiles.php")) {
        const profileID = window.location.href.split("XID=")[1];
        const profileName = document.querySelector("#skip-to-content").innerText.split(" ")[0].split("'")[0];
        console.log(profileName);

        const favoriteTrader = document.createElement("a");
        favoriteTrader.id = "button12-profile-" + profileID;
        favoriteTrader.classList.add("profile-button", "profile-button-YFT", "active");
        favoriteTrader.setAttribute("aria-label", "YFT");
        //favoriteTrader.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="default___XXAGt profileButtonIcon" filter="" fill="url(#linear-gradient-disable-dark-mode)" stroke="#d4d4d4" stroke-width="0" width="46" height="46" viewBox="478.6 178 46 46"><path d="M494,198h4v-4h4v4h4v4h-4v4h-4v-4h-4Zm-5,2a11,11,0,1,0,11-11A10.968,10.968,0,0,0,489,200Z"></path></svg>';
        favoriteTrader.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="default___XXAGt profileButtonIcon" filter="" fill="yellow" stroke="#d4d4d4" stroke-width="0" width="46" height="46" viewBox="694.6 178 46 46"><path d="M 709.4058 205.2742 L 698.623 196.2426 L 712.8157 195.1366 L 718.0688 181.6813 L 723.4141 195.1366 L 737.5146 196.2426 L 726.7318 205.2742 L 730.2339 219.0982 L 718.0688 211.5411 L 705.9958 219.4669 L 709.4058 205.2742 Z"></path></svg>';
/*
        const favoriteTraderSvg = document.createElement("Svg");
        favoriteTraderSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        favoriteTraderSvg.classList.add("default___XXAGt", "profileButtonIcon");
        favoriteTraderSvg.setAttribute("filter", "");
        favoriteTraderSvg.setAttribute("fill", "url(#linear-gradient-dark-mode)");
        favoriteTraderSvg.setAttribute("stroke", "#d4d4d4");
        favoriteTraderSvg.setAttribute("stroke-width", "0");
        favoriteTraderSvg.setAttribute("width", "46");
        favoriteTraderSvg.setAttribute("height", "46");
        favoriteTraderSvg.setAttribute("viewBox", "694.6 178 46 46");
        favoriteTraderSvg.innerHTML = '<path d="M 709.4058 205.2742 L 698.623 196.2426 L 712.8157 195.1366 L 718.0688 181.6813 L 723.4141 195.1366 L 737.5146 196.2426 L 726.7318 205.2742 L 730.2339 219.0982 L 718.0688 211.5411 L 705.9958 219.4669 L 709.4058 205.2742 Z"></path>'
        favoriteTrader.appendChild(favoriteTraderSvg);
*/
        waitFor(document.body,"#profile-container-description").then((profileDescription) => {
        var buttonlist = profileDescription.parentNode.querySelector("div.buttons-wrap > div > a:last-child");
        console.log(buttonlist);
        buttonlist.after(favoriteTrader);
        });
    }
    //#endregion
})();