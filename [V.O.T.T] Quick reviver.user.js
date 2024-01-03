// ==UserScript==
// @name         Quick reviver
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Present the revive chance in hospital page and auto confirm revive if press
// @author       DaoChauNghia [3029549]
// @match        https://www.torn.com/hospitalview.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const observerTarget = document.querySelector(".content-wrapper");
    const observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };

    let AdSearchobserver = new MutationObserver(function (mutations) {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains("user-info-list-wrap") || mutation.target.classList.contains("userlist-wrapper")) {
                let usersInfo = mutation.target.querySelectorAll("ul.user-info-list-wrap > li");
                //console.log(usersInfo);
                usersInfo.forEach((userProf) => {
                    let reviveElement = userProf.querySelector("a.revive");
                    //console.log(reviveElement);
                    if (reviveElement && reviveElement.className.includes('reviveNotAvailable')) {
                        userProf.style = "display:none;";
                    } else {
                        reviveElement.click();
                        let revivechance = userProf.querySelector("div.confirm-revive > div");
                        console.log(revivechance);
                        reviveElement.click();
                    }

                });
            }
        });
    });

    AdSearchobserver.observe(observerTarget, observerConfig);

    function getReviveChance() {
        let hospList = document.querySelectorAll("ul.user-info-list-wrap > li");
        console.log(hospList);
        hospList.forEach((user) => {
            let reviveElement = user.querySelector('.revive');
            console.log(reviveElement);
            if (reviveElement && reviveElement.className.includes('reviveNotAvailable')) {
                user.style = 'display:none;';
            }

            let revivechance = user.querySelector('.ajax-action').querySelector('b');
            console.log(revivechance);
            if (revivechance) {
                reviveElement.innerHTML = revivechance;
            }
        });
    }

})();