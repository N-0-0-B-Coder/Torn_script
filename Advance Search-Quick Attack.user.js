// ==UserScript==
// @name         Advance Search-Quick Attack
// @namespace    http://tampermonkey.net/
// @version      0.9.1
// @updateURL    https://github.com/N-0-0-B-Coder/Torn_script/raw/main/Advance%20Search-Quick%20Attack.user.js
// @downloadURL  https://github.com/N-0-0-B-Coder/Torn_script/raw/main/Advance%20Search-Quick%20Attack.user.js
// @description  Add button for quickly attack chosen target after advance search
// @author       You
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
    margin-left: auto;
    z-index: 99999;
}
`);

    const addAtkLabels = ["Attack"];
    const observerTarget = $(".content-wrapper")[0];
    const observerConfig = { attributes: false, childList: true, characterData: false, subtree: true };
    let userwrap = document.getElementById('userlist-wrapper');
    /*$(document).ready(function() {
        if (userwrap.hasClass('user-info-list-wrap')){
        let containerID = $("ul.user-info-list-wrap > li");
            containerID.find("div.level-icons-wrap span.user-icons").each(function(){
                //let isParentRowDisabled = this.parentElement.parentElement.classList.contains("disabled");
                let alreadyHasAtkBtn = this.querySelector(".btn-wrap.advance-search-attack") != null;
                if (!alreadyHasAtkBtn){

                    insertatkbtn(this, addAtkLabels);
                }
            });
                insertatkbtn(this, addAtkLabels);
            });
        }*/
    const observer = new MutationObserver(function(mutations) {
        let mutation = mutations[0].target;
        if (mutation.classList.contains("user-info-list-wrap") || mutation.classList.contains("userlist-wrapper")) {
            let containerID = $("ul.user-info-list-wrap > li");
            containerID.find("div.level-icons-wrap span.user-icons").each(function(){
                //let isParentRowDisabled = this.parentElement.parentElement.classList.contains("disabled");
                let alreadyHasAtkBtn = this.querySelector(".btn-wrap.advance-search-attack") != null;
                if (!alreadyHasAtkBtn){
                    let zul = this.querySelector("ul.big svg");
                    zul.style.zIndex = "1";
                    insertatkbtn(this, addAtkLabels);
                }
            });
        }
    });
    observer.observe(observerTarget, observerConfig);

    function insertatkbtn(element, buttonLabels){
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
            this.parentNode.style.display = "none";
            alert('ok');
        });

    }


})();