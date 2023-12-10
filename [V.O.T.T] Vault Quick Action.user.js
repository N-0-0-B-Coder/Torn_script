// ==UserScript==
// @name         [V.O.T.T] Vault Quick Action
// @namespace    http://tampermonkey.net/
// @version      0.3
// @downloadURL 
// @updateURL 
// @description  Add buttons to set money withdraw/deposit inputs to a target amount.
// @author       DaoChauNghia[3029549]
// @match        https://www.torn.com/*
// @require      
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

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

  const fillInputs = (walletBalance, target, leftInput, rightInput) => {
    if (walletBalance > target) {
      leftInput.value = "";
      leftInput.dispatchEvent(new Event("input", { bubbles: true }));
      rightInput.value = (walletBalance - target).toString();
      rightInput.dispatchEvent(new Event("input", { bubbles: true }));
    } else if (walletBalance < target) {
      leftInput.value = (target - walletBalance).toString();
      leftInput.dispatchEvent(new Event("input", { bubbles: true }));
      rightInput.value = "";
      rightInput.dispatchEvent(new Event("input", { bubbles: true }));
    }
  };

  const popup_fillInputs = (target) => {
    var newWin = window.open("https://www.torn.com/properties.php#/p=options&tab=vault");
    newWin.addEventListener("DOMContentLoaded", function () {
      var newdocument = newWin.document;
      const area = newdocument.querySelector("div.vault-wrap.container-ask");
      console.log(area);
      const leftInput = newdocument.querySelector("form.vault-cont.left input.input-money");
      console.log(leftInput);
      const rightInput = newdocument.querySelector("form.vault-cont.right input.input-money");
      console.log(rightInput);


      const vaultBalance = parseInt(leftInput.getAttribute("data-money"));
      const walletBalance = parseInt(rightInput.getAttribute("data-money"));

      //clearInterval(timer);
      console.log("Found vault input elements in new pop-up.");
      fillInputs(walletBalance, target, leftInput, rightInput);
    });
  };

  if (window.location.href.indexOf("properties.php") != -1) {
    const timer = setInterval(function () {
      const area = document.querySelector("div.vault-wrap.container-ask");
      const leftInput = document.querySelector("form.vault-cont.left input.input-money");
      const rightInput = document.querySelector("form.vault-cont.right input.input-money");

      if (!(area && leftInput && rightInput)) {
        return false;
      }

      const vaultBalance = parseInt(leftInput.getAttribute("data-money"));
      const walletBalance = parseInt(rightInput.getAttribute("data-money"));

      clearInterval(timer);
      console.log("Found vault input elements.");

      const text = document.createElement("span");
      text.innerHTML = "Target wallet value:&nbsp;&nbsp;&nbsp;&nbsp;";
      text.classList.add("m-top10");
      text.classList.add("bold");
      area.parentElement.insertBefore(text, area);
      const zeroBtn = document.createElement("button");
      zeroBtn.innerText = "0";
      zeroBtn.classList.add("torn-btn");
      zeroBtn.onclick = () => {
        fillInputs(walletBalance, 0, leftInput, rightInput);
      };
      area.parentElement.insertBefore(zeroBtn, area);

      const fiftyKBtn = document.createElement("button");
      fiftyKBtn.innerText = "50k";
      fiftyKBtn.classList.add("torn-btn");
      fiftyKBtn.onclick = () => {
        fillInputs(walletBalance, 50000, leftInput, rightInput);
      };
      area.parentElement.insertBefore(fiftyKBtn, area);

      const twoHunKBtn = document.createElement("button");
      twoHunKBtn.innerText = "200k";
      twoHunKBtn.classList.add("torn-btn");
      twoHunKBtn.onclick = () => {
        fillInputs(walletBalance, 200000, leftInput, rightInput);
      };
      area.parentElement.insertBefore(twoHunKBtn, area);

      const oneMBtn = document.createElement("button");
      oneMBtn.innerText = "1M";
      oneMBtn.classList.add("torn-btn");
      oneMBtn.onclick = () => {
        fillInputs(walletBalance, 1000000, leftInput, rightInput);
      };
      area.parentElement.insertBefore(oneMBtn, area);

      const twoMBtn = document.createElement("button");
      twoMBtn.innerText = "2M";
      twoMBtn.classList.add("torn-btn");
      twoMBtn.onclick = () => {
        fillInputs(walletBalance, 2000000, leftInput, rightInput);
      };
      area.parentElement.insertBefore(twoMBtn, area);

      const fiveMBtn = document.createElement("button");
      fiveMBtn.innerText = "5M";
      fiveMBtn.classList.add("torn-btn");
      fiveMBtn.onclick = () => {
        fillInputs(walletBalance, 5000000, leftInput, rightInput);
      };
      area.parentElement.insertBefore(fiveMBtn, area);
    }, 100);
  }
  if (window.location.href.indexOf("index.php") != -1) {
    const timer = setInterval(function () {
      const area = document.querySelector("#mainContainer > div.content-wrapper.autumn > div.content.m-top10");
      if (!area) {
        return false;
      }

      clearInterval(timer);
      console.log("Found element.");

      //Create container div for quick vault action
      var container = document.createElement("div");
      container.id = "VaultAction";
      area.parentElement.insertBefore(container, area);

      //Create header
      var header = document.createElement("div");
      header.classList.add('title-black', 'm-top10', 'title-toggle', 'active', 'top-round', 'chain-watcher-header');
      header.innerHTML = 'Vault Action';
      header.style.color = 'lime';

      //Create content

      var body = document.createElement("div");
      body.style.display = "flex";
      body.style.flexWrap = "wrap";
      body.classList.add('cont-gray10', 'bottom-round', 'cont-toggle', 'unreset', 'chain-watcher-body');

      var content = document.createElement("div");
      content.innerHTML = "Wallet value:&nbsp;&nbsp;&nbsp;&nbsp;";
      content.classList.add("m-top10", "bold");
      body.appendChild(content);

      //Add header and body elements
      container.appendChild(header);
      container.appendChild(body);

      const zeroBtn = document.createElement("button");
      zeroBtn.innerText = "0";
      zeroBtn.classList.add("torn-btn");
      zeroBtn.onclick = () => {
        popup_fillInputs(0);
      };
      body.appendChild(zeroBtn);

      const TwoHunKBtn = document.createElement("button");
      TwoHunKBtn.innerText = "200k";
      TwoHunKBtn.classList.add("torn-btn");
      TwoHunKBtn.onclick = () => {
        popup_fillInputs(200000);
      };
      body.appendChild(TwoHunKBtn);

      const oneMBtn = document.createElement("button");
      oneMBtn.innerText = "1M";
      oneMBtn.classList.add("torn-btn");
      oneMBtn.onclick = () => {
        popup_fillInputs(1000000);
      };
      body.appendChild(oneMBtn);

      const tenMBtn = document.createElement("button");
      tenMBtn.innerText = "10M";
      tenMBtn.classList.add("torn-btn");
      tenMBtn.onclick = () => {
        popup_fillInputs(10000000);
      };
      body.appendChild(tenMBtn);


    }, 100);
  }
})();