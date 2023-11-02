// ==UserScript==
// @name         Advance Search-Quick Attack
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @updateURL    https://github.com/N-0-0-B-Coder/Torn_script/raw/main/Advance%20Search-Quick%20Attack.user.js
// @downloadURL  https://github.com/N-0-0-B-Coder/Torn_script/raw/main/Advance%20Search-Quick%20Attack.user.js
// @description  Filter unattackable target and quick attack button after advance search
// @author       DaoChauNghia[3029549]
// @match        https://www.torn.com/page.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';
    let GM_addStyle = function (s) {
        let style = document.createElement("style");
        style.innerHTML = s;
        document.head.appendChild(style);
    };
    GM_addStyle(`
.btn-wrap.advance-search-attack {
    float: right;
    margin-left: auto;
    z-index: 99999;
}
`);
    const addAtkLabels = ["Attack"];
    const observerTarget = $(".content-wrapper")[0];
    const observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };
    const unavailable = ['Traveling','Hospital','Federal','Jail'];

    let AdSearchobserver = new MutationObserver(function(mutations) {
        mutations.forEach((mutation) => {
            if (mutation.target.classList.contains("user-info-list-wrap") || mutation.target.classList.contains("userlist-wrapper")) {
                let containerID = $("ul.user-info-list-wrap > li");
                containerID.each(function() {
                    let user = this.className;
                    let userID = user.replace("user", "");
                    let userIcons = $(this).find("div.level-icons-wrap > span.user-icons");
                    if (userIcons.length > 0 && !userIcons[0].querySelector(".advance-search-attack")) {
                        insertatkbtn(userIcons[0], addAtkLabels, userID);
                    }
                    let iconWrap = this.querySelector('span.icons-wrap');
                    iconWrap.style.display = 'inline';
                    let iconTray = this.querySelector('span.icons-wrap > ul#iconTray');
                    iconTray.style.display = 'inline';
                    let status = this.querySelectorAll('ul#iconTray > li');
                    for(let s of status){
                        if (unavailable.some(u=> s.title.includes(u))){
                            this.style.display = 'none';
                        }
                    }
                });
            }
        });
    });

    AdSearchobserver.observe(observerTarget, observerConfig);

    function insertatkbtn(element, buttonLabels, ID){
        const outerspanatk = document.createElement('span');
        outerspanatk.className = 'btn-wrap advance-search-attack';

        const innerspanatk = document.createElement('span');
        innerspanatk.className = 'btn';

        const inputElementAtk = document.createElement('input');
        inputElementAtk.type = 'button';
        inputElementAtk.value = buttonLabels[0];
        inputElementAtk.className = 'torn-btn';

        innerspanatk.appendChild(inputElementAtk);
        outerspanatk.appendChild(innerspanatk);

        element.append(outerspanatk);

        $(outerspanatk).on("click", "input", function() {
            let attack = `https://www.torn.com/loader.php?sid=attack&user2ID=${ID}`
            window.open(attack, '_blank');
        });
    }
})();
