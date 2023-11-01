// ==UserScript==
// @name         Advance Search-Quick Attack
// @namespace    http://tampermonkey.net/
// @version      0.9.5
// @updateURL    https://github.com/N-0-0-B-Coder/Torn_script/raw/main/Advance%20Search-Quick%20Attack.user.js
// @downloadURL  https://github.com/N-0-0-B-Coder/Torn_script/raw/main/Advance%20Search-Quick%20Attack.user.js
// @description  Add button for quickly attack chosen target after advance search
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
        style.type = "text/css";
        style.innerHTML = s;
        document.head.appendChild(style);
    };
    GM_addStyle(`
.btn-wrap.advance-search-attack {
	float: right;

    z-index: 99999;
}
`);
//    margin-left: auto;
    const addAtkLabels = ["Attack"];
    const observerTarget = $(".content-wrapper")[0];
    const observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };
    let userwrap = document.getElementById('userlist-wrapper');
    /*$(document).ready(function() {
        if (observerTarget.classList.contains('user-info-list-wrap')  || observerTarget.classList.contains("userlist-wrapper")){
        let containerID = $("ul.user-info-list-wrap > li");
            containerID.find("div.level-icons-wrap span.user-icons").each(function(){
                insertatkbtn(this, addAtkLabels);
            });
    }*/
    const AdSearchobserver = new MutationObserver(function(mutations) {
        let havebtn = false;
        let mutation = mutations[0].target;
        if (mutation.classList.contains("user-info-list-wrap") || mutation.classList.contains("userlist-wrapper")) {
            let containerID = $("ul.user-info-list-wrap > li");
            containerID.find("div.level-icons-wrap span.user-icons").each(function(){
                let user = this.parentElement.parentElement.className;
                let userID = user.replace("user", "");
                if (this.classList.contains("span.btn-wrap.advance-search-attack")){
                }
                else{
                    insertatkbtn(this, addAtkLabels,userID);
                    let zspan = this.querySelector("span.icons-wrap.icons");
                    zspan.style.display = 'inline';
                    let zul = this.querySelector("ul#iconTray.big.svg");
                    zul.style.display = 'inline';
                    havebtn = true;
                }
                if (havebtn){
                    AdSearchobserver.disconnect();
                }
                else{
                    AdSearchobserver.observe(observerTarget, observerConfig);
                }
                //let isParentRowDisabled = this.parentElement.parentElement.classList.contains("disabled");
                //insertatkbtn(this, addAtkLabels);
                /*let alreadyHasAtkBtn = this.querySelector(".btn-wrap.advance-search-attack") != null;
                if (!alreadyHasAtkBtn){
                    insertatkbtn(this, addAtkLabels);
                    let zul = this.querySelector("ul#iconTray.big.svg");
                    zul.style.zIndex = 1;
                }*/
            });
        }
    });
    $(document).ready(function() {
        AdSearchobserver.observe(observerTarget, observerConfig);
    });
    AdSearchobserver.observe(observerTarget, observerConfig);

    function insertatkbtn(element, buttonLabels, ID){
        const outerspanatk = document.createElement('span');
        outerspanatk.className = 'btn-wrap.advance-search-attack';

        const innerspanatk = document.createElement('span');
        innerspanatk.className = 'btn';

        const inputElementAtk = document.createElement('input');
        inputElementAtk.type = 'button';
        inputElementAtk.value = buttonLabels[0];
        inputElementAtk.className = 'torn-btn';

        innerspanatk.appendChild(inputElementAtk);
        outerspanatk.appendChild(innerspanatk);

        element.append(outerspanatk);

        $(outerspanatk).on("click", "input", function(event) {
            //this.parentNode.style.display = "none";
            let attack = `https://www.torn.com/loader.php?sid=attack&user2ID=${ID}`
            window.open(attack, '_blank');
        });
    }


})();