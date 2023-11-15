// ==UserScript==
// @name         Viets Omni Torn Tool
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.torn.com/profiles.php?XID=3029549
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

// #region Variables

const VOTTIcon = "https://i.postimg.cc/RZbnmTC8/VOTT-main.png";
const FBIcon = "https://i.postimg.cc/FzX7dLWQ/facebook.png";
var OnMobile = false
var VOTTSettingsDiv;
var VOTTSettingsMenuArea;
var VOTTSettingsMenuContent;

// #endregion

// #region Storage

var VOTT_Storage = {};

// Get the value of the storage
function Get_VOTT_Storage(key) { return VOTT_Storage[key]; }

// Get the value of the storage, empty string if undefined
function GetStorageEmptyIfUndefined(key) { return (VOTT_Storage[key] == undefined) ? "" : VOTT_Storage[key]; }

// Set the value of the storage
function Set_VOTT_Storage(key, value) {
    try {
        VOTT_Storage[key] = value;
    }
    catch (e) {
        LogInfo("VOTT threw an exception in SetStorage method : " + e);
    }
}

// Check the value of the storage and set it if it is not set
function CheckStorageBoolWithDefaultValue(key, defaultValueIfUnset) {
    if (VOTT_Storage[key] == "true") return true;
    else if (VOTT_Storage[key] == "false") return false;
    else {
        Set_VOTT_Storage(key, defaultValueIfUnset);
        return defaultValueIfUnset;
    }
}

// #endregion

// #region Style
var styleToAdd = document.createElement('style');

/* Style the tab */
styleToAdd.innerHTML += '.VOTT_Setting_Menu {border: 1px solid #ccc;background-color: #f1f1f1;}';

/* Style the buttons inside the tab */
styleToAdd.innerHTML += '.VOTT_Setting_Menu button {display: block; text-align:center !important; height:45px; background-color: inherit; color: black; padding: 22px 16px; width: 100%; border: none; outline: none; text-align: left; cursor: pointer; transition: 0.3s;font-size: 14px; border: 1px solid white !important}';

/* Change background color of buttons on hover */
styleToAdd.innerHTML += '.VOTT_Setting_Menu button:hover button:focus { background-color: #99ccff !important; color: black !important}';

/* Create an active/current "tab button" class */
styleToAdd.innerHTML += '.VOTT_Setting_Menu button.active { background-color: black !important; color:white}';

styleToAdd.innerHTML += '.VOTT_SettingsCellMenu {width:100px; background:white; height:370px; vertical-align: top !important;}';

styleToAdd.innerHTML += '.VOTT_SettingsCellHeader {text-align: center; font-size: 18px !important; background: black; color: white;}';


/* Buttons in Option menu content */
styleToAdd.innerHTML += '.VOTT_buttonInOptionMenu { background-color: black; border-radius: 4px; border-style: none; box-sizing: border-box; color: #fff;cursor: pointer;display: inline-block; font-family: "Farfetch Basis", "Helvetica Neue", Arial, sans-serif;';
styleToAdd.innerHTML += 'font-size: 12px; margin: 5px; max-width: none; outline: none;overflow: hidden;  padding: 5px 5px; position: relative;  text-align: center;}';

/* Style the tab content */

styleToAdd.innerHTML += '.VOTT_optionsTabContentDiv { padding: 10px 6px;}';
styleToAdd.innerHTML += '.VOTT_optionsTabContentDiv a { display: initial !important;}';

styleToAdd.innerHTML += '.VOTT_optionsTabContentDivSmall { padding: 5px 5px;}';

styleToAdd.innerHTML += '.VOTT_optionsTabContent { padding: 10px 10px;  border: 1px solid #ccc;  }';
styleToAdd.innerHTML += '.VOTT_optionsTabContent label { margin:10px 0px; }';
styleToAdd.innerHTML += '.VOTT_optionsTabContent p { margin:10px 0px; }';
styleToAdd.innerHTML += '.VOTT_optionsTabContent a { color:black !important;}';

styleToAdd.innerHTML += '.VOTT_optionsTabContent input { margin:0px 10px !important; }';
styleToAdd.innerHTML += '.VOTT_optionsTabContent input[type = button] { margin:0px 10px 0px 0px !important; }';
styleToAdd.innerHTML += '.VOTT_optionsTabContent input:disabled[type = button] { background-color: #AAAAAA; }';
styleToAdd.innerHTML += '.VOTT_optionsTabContent input[type = number] { text-align: right; }';

styleToAdd.innerHTML += '.VOTT_button {  background-color: gray; border-radius: 4px; border-style: none; box-sizing: border-box; color: #fff;cursor: pointer;display: inline-block; font-family: "Farfetch Basis", "Helvetica Neue", Arial, sans-serif;';
styleToAdd.innerHTML += 'font-size: 12px;font-weight: 100; line-height: 1;  margin: 0; max-width: none; min-width: 10px;  outline: none;overflow: hidden;  padding: 5px 5px; position: relative;  text-align: center;';
styleToAdd.innerHTML += 'text-transform: none;  user-select: none; -webkit-user-select: none;  touch-action: manipulation; width: 100%;}';
styleToAdd.innerHTML += '.VOTT_button: hover, .VOTT_button:focus { opacity: .75;}'

// Get the first script tag
var ref = document.querySelector('script');

// Insert our new styles before the first script tag
ref.parentNode.insertBefore(styleToAdd, ref);

// #endregion

// #region Ultilities
const PageType = {
    Profile: 'Profile',
    RecruitCitizens: 'Recruit Citizens',
    HallOfFame: 'Hall Of Fame',
    Faction: 'Faction',
    Company: 'Company',
    Competition: 'Competition',
    Bounty: 'Bounty',
    Search: 'Search',
    Hospital: 'Hospital',
    Chain: 'Chain',
    FactionControl: 'Faction Control',
    Market: 'Market',
    Forum: 'Forum',
    ForumThread: 'ForumThread',
    ForumSearch: 'ForumSearch',
    Abroad: 'Abroad',
    Enemies: 'Enemies',
    Friends: 'Friends',
    PointMarket: 'Point Market',
    Properties: 'Properties',
    War: 'War',
    ChainReport: 'ChainReport',
    RWReport: 'RWReport',
};

var mapPageTypeAddress = {
    [PageType.Profile]: 'https://www.torn.com/profiles.php',
    [PageType.RecruitCitizens]: 'https://www.torn.com/bringafriend.php',
    [PageType.HallOfFame]: 'https://www.torn.com/halloffame.php',
    [PageType.Faction]: 'https://www.torn.com/factions.php',
    [PageType.Company]: 'https://www.torn.com/joblist.php',
    [PageType.Competition]: 'https://www.torn.com/competition.php',
    [PageType.Bounty]: 'https://www.torn.com/bounties.php',
    [PageType.Search]: 'https://www.torn.com/page.php',
    [PageType.Hospital]: 'https://www.torn.com/hospitalview.php',
    [PageType.Chain]: 'https://www.torn.com/factions.php?step=your#/war/chain',
    [PageType.FactionControl]: 'https://www.torn.com/factions.php?step=your#/tab=controls',
    [PageType.Market]: 'https://www.torn.com/imarket.php',
    [PageType.Forum]: 'https://www.torn.com/forums.php',
    [PageType.ForumThread]: 'https://www.torn.com/forums.php#/p=threads',
    [PageType.ForumSearch]: 'https://www.torn.com/forums.php#/p=search',
    [PageType.Abroad]: 'https://www.torn.com/index.php?page=people',
    [PageType.Enemies]: 'https://www.torn.com/blacklist.php',
    [PageType.Friends]: 'https://www.torn.com/friendlist.php',
    [PageType.PointMarket]: 'https://www.torn.com/pmarket.php',
    [PageType.Properties]: 'https://www.torn.com/properties.php',
    [PageType.War]: 'https://www.torn.com/war.php',
    [PageType.ChainReport]: 'https://www.torn.com/war.php?step=chainreport',
    [PageType.RWReport]: 'https://www.torn.com/war.php?step=rankreport',
}

function IsPage(pageType) {
    return window.location.href.startsWith(mapPageTypeAddress[pageType]);
}

// #endregion

// #region Menu Settings

// Inject VOTT Settings button in profile page
function InjectOptionMenuButtonInProfile(node) {
    if (!node) {
        return;
    }
    if (node.className.indexOf('mobile') !== -1) {
        OnMobile = true;
        return;
    }
    const topPageLinksList = document.querySelector("#top-page-links-list");

    let btnOpenSetting = document.createElement('a');
    btnOpenSetting.className = "t-clear h c-pointer line-h24 right";
    btnOpenSetting.innerHTML = '<div class="VOTT_button" style="font-size:x-small"><img src="' + VOTTIcon + '" style="max-width:100px;max-height:16px;vertical-align:middle;"/> SETTINGS</div>';
    btnOpenSetting.addEventListener("click", () => {
        console.log("Open/Close Setting");
        if (VOTTSettingsDiv == undefined) {
            BuildSettingsMenu(document.querySelector(".content-title"));
        }

        if (VOTTSettingsDiv.style.display == "block") {
            VOTTSettingsDiv.style.display = "none";
            console.log("Close Setting");
        }
        else {
            VOTTSettingsDiv.style.display = "block";
            console.log("Open Setting");
        }
    });

    topPageLinksList.appendChild(btnOpenSetting);
}

//create main menu table of the script
function BuildSettingsMenu(node) {

    VOTTSettingsDiv = document.createElement('div');
    VOTTSettingsDiv.style.background = "lightgray";

    VOTTSettingsMenuArea = document.createElement('div');
    VOTTSettingsMenuArea.className = "VOTT_Setting_Menu";

    VOTTSettingsMenuContent = document.createElement('div');

    var cell, table;
    table = document.createElement('table');
    table.style = 'width:100%; border:2px solid white';


    let thead = table.createTHead();
    let rowHeader = thead.insertRow();
    let th = document.createElement("th");
    th.className = "VOTT_SettingsCellHeader";
    th.colSpan = 2;

    let imgDivVOTTSettingsDiv = document.createElement("div");
    imgDivVOTTSettingsDiv.innerHTML = '<img src="' + VOTTIcon + '" style="max-width:150px;max-height:100px;vertical-align:middle;margin-bottom:10px;margin-top:10px;" /> <p style="margin-bottom:10px;">Viets Omni Torn Tool</p>';
    th.appendChild(imgDivVOTTSettingsDiv);

    rowHeader.appendChild(th);

    let raw = table.insertRow();
    cell = raw.insertCell();
    cell.className = "VOTT_SettingsCellMenu";
    cell.appendChild(VOTTSettingsMenuArea);

    cell = raw.insertCell();
    cell.className = "VOTT_SettingsCellContent";
    cell.appendChild(VOTTSettingsMenuContent);

    VOTTSettingsDiv.appendChild(table);
    node.appendChild(VOTTSettingsDiv);

    BuildOptionsInMenu_General(VOTTSettingsMenuArea, VOTTSettingsMenuContent)
    BuildOptionsInMenu_RefillNoti(VOTTSettingsMenuArea, VOTTSettingsMenuContent);
    BuildOptionsInMenu_CompAddiction(VOTTSettingsMenuArea, VOTTSettingsMenuContent);
    BuildOptionsInMenu_SearchQuickAttack(VOTTSettingsMenuArea, VOTTSettingsMenuContent);

    VOTTSettingsDiv.style.display = "none";

    // Get the element with id="defaultOpen" and click on it
    document.getElementById("VOTT_tablinks_defaultOpen").click();
}

// #endregion

// #region Menu Settings Options

// Open the tab of the menu
function OpenOptionsTab(evt, optionsTabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("VOTT_optionsTabContent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("VOTT_tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(optionsTabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Build List Options of Menu and its content
function BuildOptionsInMenu(menuArea, contentArea, name, shouldBeHiddenWhenInactive, isOpenAtStart = false) {
    // Adding the button in the tabs
    let TabEntryBtn = document.createElement("button");
    TabEntryBtn.className = "VOTT_tablinks";
    if (shouldBeHiddenWhenInactive == true)
        TabEntryBtn.className += " VOTT_tablinksShouldBeHiddenWhenInactive";

    if (isOpenAtStart)
        TabEntryBtn.id = "VOTT_tablinks_defaultOpen";

    TabEntryBtn.innerHTML = name;
    TabEntryBtn.addEventListener("click", function (evt) {
        OpenOptionsTab(evt, "VOTT_optionsTabContent_" + name);
    });

    menuArea.appendChild(TabEntryBtn);

    // Adding the corresponding div
    let TabContent = document.createElement("div");
    TabContent.className = "VOTT_optionsTabContent";
    TabContent.id = "VOTT_optionsTabContent_" + name;
    contentArea.appendChild(TabContent);

    return TabContent;
}

// Create checkbox in content area of Options
function AddOptionCheckBox(contentDiv, StorageKeyValue, defaultValue, textToDisplay, name) {
    // Alternative profile display
    let optionNode = document.createElement("div");
    optionNode.className = "VOTT_optionsTabContentDiv";
    let isShowingAlternativeProfileDisplay = CheckStorageBoolWithDefaultValue(StorageKeyValue, defaultValue);

    let optionCheckbox = document.createElement('input');
    optionCheckbox.type = "checkbox";
    optionCheckbox.name = "name";
    optionCheckbox.value = "value";
    optionCheckbox.id = "id" + name;
    optionCheckbox.checked = isShowingAlternativeProfileDisplay;

    optionCheckbox.addEventListener("change", () => {
        let isOptionValue = optionCheckbox.checked;
        Set_VOTT_Storage(StorageKeyValue, isOptionValue);
        console.log(name + " checkbox changed to " + isOptionValue);
    });

    var optionLabel = document.createElement('label')
    optionLabel.htmlFor = "id" + name;
    optionLabel.appendChild(document.createTextNode(textToDisplay));
    optionNode.appendChild(optionLabel);
    optionNode.appendChild(optionCheckbox);
    contentDiv.appendChild(optionNode);
}

// Create content for 'General' tab
function BuildOptionsInMenu_General(menuArea, contentArea) {
    let contentDiv = BuildOptionsInMenu(menuArea, contentArea, "General", false, true);

    // API Key
    let mainAPIKeyLabel = document.createElement("label");
    mainAPIKeyLabel.innerHTML = 'API Key';

    let mainAPIKeyInput = document.createElement("input");
    mainAPIKeyInput.value = GetStorageEmptyIfUndefined(VOTT_Storage.PrimaryAPIKey);

    btnValidatemainAPIKey = document.createElement("input");
    btnValidatemainAPIKey.type = "button";
    btnValidatemainAPIKey.value = "Validate";
    btnValidatemainAPIKey.className = "VOTT_buttonInOptionMenu";

    btnValidatemainAPIKey.addEventListener("click", () => {
        errorValidatemainAPIKey.style.visibility = "hidden";
        successValidatemainAPIKey.style.visibility = "hidden";
        btnValidatemainAPIKey.disabled = true;
        Set_VOTT_Storage(StorageKey.PrimaryAPIKey, mainAPIKeyInput.value);
        VerifyTornAPIKey(OnTornAPIKeyVerified);
    });

    

    successValidatemainAPIKey = document.createElement("label");
    successValidatemainAPIKey.innerHTML = 'API Key verified and saved!';
    successValidatemainAPIKey.style.color = 'green';
    successValidatemainAPIKey.style.visibility = "hidden";

    errorValidatemainAPIKey = document.createElement("label");
    errorValidatemainAPIKey.innerHTML = 'Error while verifying API Key';
    errorValidatemainAPIKey.style.backgroundColor = 'red';
    errorValidatemainAPIKey.style.visibility = "hidden";

    let mainAPIKeyDiv = document.createElement("div");
    mainAPIKeyDiv.className = "VOTT_optionsTabContentDiv";
    mainAPIKeyDiv.appendChild(mainAPIKeyLabel);
    mainAPIKeyDiv.appendChild(mainAPIKeyInput);
    mainAPIKeyDiv.appendChild(btnValidatemainAPIKey);
    mainAPIKeyDiv.appendChild(successValidatemainAPIKey);
    mainAPIKeyDiv.appendChild(errorValidatemainAPIKey);
    contentDiv.appendChild(mainAPIKeyDiv);

    apiRegister = document.createElement("div");
    apiRegister.className = "VOTT_optionsTabContentDiv";
    apiRegister.innerHTML = '<a href="" target="_blank"><input type"button" class="VOTT_buttonInOptionMenu" value="Generate a basic key"/></a>';
    contentDiv.appendChild(apiRegister);
}

//create content for 'Script 1' tab
function BuildOptionsInMenu_RefillNoti(menuArea, contentArea) {
    let contentDiv = BuildOptionsInMenu(menuArea, contentArea, "Refill Notification", false);

    AddOptionCheckBox(contentDiv, VOTT_Storage.Script1_Enabled, false, "Enable Script?", "Sciprt_1_enabled");

    let TabContent_Content = document.createElement("div");
    TabContent_Content.className = "VOTT_optionsTabContentDiv";
    TabContent_Content.innerHTML = "Script version : " + GM_info.script.version;
    contentDiv.appendChild(TabContent_Content);

    let ScriptName = document.createElement("div");
    ScriptName.className = "VOTT_optionsTabContentDiv";
    ScriptName.innerHTML = 'This is Script 1.';
    contentDiv.appendChild(ScriptName);

    let Signature = document.createElement("div");
    Signature.className = "VOTT_optionsTabContentDiv";
    Signature.innerHTML = 'Signature Test? <a href="https://www.torn.com/3029549" ><img src="https://www.torn.com/sigs/17_3029549.png" /></a>';
    contentDiv.appendChild(Signature);

    let DiscordLink = document.createElement("div");
    DiscordLink.className = "VOTT_optionsTabContentDiv";

    let DiscordText = document.createElement("div");
    DiscordText.innerHTML = 'Give feedback, report bugs or just come to say hi to me on: ';
    DiscordLink.appendChild(DiscordText);

    let DiscordLinkImg = document.createElement("div");
    DiscordLinkImg.style.textAlign = "center";
    DiscordLinkImg.innerHTML = '<a href="https://www.facebook.com/daochaunghia" target="_blank"><img width="60" height="60" title="Facebook" src=' + FBIcon + '/> </a>';

    DiscordLink.appendChild(DiscordLinkImg);

    contentDiv.appendChild(DiscordLink);
}

//create content for 'Script 2' tab
function BuildOptionsInMenu_CompAddiction(menuArea, contentArea) {
    let contentDiv = BuildOptionsInMenu(menuArea, contentArea, "Company Addiction", false);

    let TabContent_Content = document.createElement("div");
    TabContent_Content.className = "VOTT_optionsTabContentDiv";
    TabContent_Content.innerHTML = "Info 2 Script version : " + GM_info.script.version;
    contentDiv.appendChild(TabContent_Content);

    let ForumThread = document.createElement("div");
    ForumThread.className = "VOTT_optionsTabContentDiv";
    ForumThread.innerHTML = 'Read basic setup, Q&A and R+ the script if you like it on the <a href="https://www.torn.com/forums.php#/p=threads&f=67&t=16290324&b=0&a=0&to=22705010" target="_blank"> Forum thread</a>';
    contentDiv.appendChild(ForumThread);

    let DiscordLink = document.createElement("div");
    DiscordLink.className = "VOTT_optionsTabContentDiv";

    let DiscordText = document.createElement("div");
    DiscordText.innerHTML = 'Give feedback, report bugs or just come to say hi on the Discord';
    DiscordLink.appendChild(DiscordText);

    let DiscordLinkImg = document.createElement("div");
    DiscordLinkImg.style.textAlign = "center";
    DiscordLinkImg.innerHTML = '<a href="https://discord.gg/zgrVX5j6MQ" target="_blank"><img width="300" height="60" title="Discord" src="https://i.postimg.cc/SNt5nkVQ/discord-logo-blue.png" /> </a>';

    DiscordLink.appendChild(DiscordLinkImg);

    contentDiv.appendChild(DiscordLink);
}

//create content for 'Script 3' tab
function BuildOptionsInMenu_SearchQuickAttack(menuArea, contentArea) {
    let contentDiv = BuildOptionsInMenu(menuArea, contentArea, "Search-Quick Attack", false);

    let TabContent_Content = document.createElement("div");
    TabContent_Content.className = "VOTT_optionsTabContentDiv";
    TabContent_Content.innerHTML = "Info 3 Script version : " + GM_info.script.version;
    contentDiv.appendChild(TabContent_Content);

    let ForumThread = document.createElement("div");
    ForumThread.className = "VOTT_optionsTabContentDiv";
    ForumThread.innerHTML = 'Read basic setup, Q&A and R+ the script if you like it on the <a href="https://www.torn.com/forums.php#/p=threads&f=67&t=16290324&b=0&a=0&to=22705010" target="_blank"> Forum thread</a>';
    contentDiv.appendChild(ForumThread);

    let DiscordLink = document.createElement("div");
    DiscordLink.className = "VOTT_optionsTabContentDiv";

    let DiscordText = document.createElement("div");
    DiscordText.innerHTML = 'Give feedback, report bugs or just come to say hi on the Discord';
    DiscordLink.appendChild(DiscordText);

    let DiscordLinkImg = document.createElement("div");
    DiscordLinkImg.style.textAlign = "center";
    DiscordLinkImg.innerHTML = '<a href="https://discord.gg/zgrVX5j6MQ" target="_blank"><img width="300" height="60" title="Discord" src="https://i.postimg.cc/SNt5nkVQ/discord-logo-blue.png" /> </a>';

    DiscordLink.appendChild(DiscordLinkImg);

    contentDiv.appendChild(DiscordLink);
}
// #endregion

// #region API

// Fetch user data from Torn Server for verifying
function VerifyTornAPIKey(callback) {
    var urlToUse = "https://api.torn.com/user/?comment=VOTTAuth&key=" + Get_VOTT_Storage(VOTT_Storage.PrimaryAPIKey);
    GM.xmlHttpRequest({
        method: "GET",
        url: urlToUse,
        onload: (r) => {
            let j = JSONparse(r.responseText);
            if (!j) {
                callback(false, "Couldn't check (unexpected response)");
                return;
            }

            if (j.error && j.error.code > 0) {
                callback(false, j.error.error);
                return;
            }

            if (j.status != undefined && !j.status) {
                callback(false, "Unknown status. M.I.A?");
                return;
            }
            else {
                SetStorage(StorageKey.PlayerId, j.player_id);
                callback(true);
                return;
            }
        },
        onabort: () => callback(false, "Couldn't check (aborted)"),
        onerror: () => callback(false, "Couldn't check (error)"),
        ontimeout: () => callback(false, "Couldn't check (timeout)")
    })
}


// get things done after API Key is verified
function OnTornAPIKeyVerified(success, reason) {
    btnValidatemainAPIKey.disabled = false;
    Set_VOTT_Storage(VOTT_Storage.IsPrimaryAPIKeyValid, success);
    if (success === true) {
        successValidatemainAPIKey.style.visibility = "visible";
        apiRegister.style.display = "none";
        //FetchUserDataFromBSPServer();
    }
    else {
        //RefreshOptionMenuWithSubscription();
        errorValidatemainAPIKey.style.visibility = "visible";
        apiRegister.style.display = "block";
        errorValidatemainAPIKey.innerHTML = reason;
        subscriptionEndText.innerHTML = '<div style="color:red">Please fill a valid API Key, and press on validate activate VOTT</div>';
    }
}

// #endregion

(function () {
    'use strict';
    window.addEventListener('load', async function () {
        BuildSettingsMenu(document.querySelector(".content-title"))
        if (IsPage(PageType.Profile))
        InjectOptionMenuButtonInProfile(document.querySelector(".content-title"))
    });
})();
