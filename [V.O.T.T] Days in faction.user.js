// ==UserScript==
// @name         [V.O.T.T] Days in faction
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add info of days in faction in profile page
// @author       DaoChauNghia[3029549]
// @match        https://www.torn.com/profiles.php?XID=2884626
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// ==/UserScript==

(async function () {
    'use strict';

    // #region API Key Validation

    // Function to check the API key
    async function checkApiKey(apiKey) {
        const apiUrl = `https://api.torn.com/user/?selections=profile&comment=VOTT&key=${apiKey}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.error);
        }

        return response.json();
    }

    // Check if the API key is stored
    if (!storedApiKey || storedApiKey === 'null') {
        askforapikey();
    }

    // Check the API key everytime the website is loaded
    if (storedApiKey !== 'null') {
        try {
            const checkapi = await checkApiKey(storedApiKey);
            if (checkapi.error) {
                if (checkapi.error.code === 2 || checkapi.error.code === 16) {
                    alert(`[Days in faction] Error. Please enter a valid limited Torn API key.`);
                    askforapikey();
                    return; // Terminate the script to prevent further execution
                } else if (checkapi.error.code === 7) {
                    alert(`[Days in faction] Error: ${checkapi.error.error}. Are you factionless? Script will not run.`);
                    return; // Terminate the script to prevent further execution
                }
            }
        } catch (error) {
            console.error(`Error during API key validation: ${error}`);

            // If access level is not high enough or incorrect key, re-ask the user for the API key
            if (error === 'Access level of this key is not high enough' || error === 'Incorrect key') {
                alert(`[Days in faction] Error: ${error}. Please enter a valid Torn API key.`);
                GM_setValue('apiKey', 'null');
                return; // Terminate the script to prevent further execution
            }
        }
    }

    // #endregion

    // #region Main Script

    // Fetch data using the validated API key
    if (storedApiKey !== 'null') {
        try {
            const data = await checkApiKey(storedApiKey);

            // Get the number of days in faction
            

        } catch (error) {
            console.error('Error fetching data:', error.message);
        }
    } else {
        console.log('User has chosen not to provide an API key or entered an incorrect key.');

        // Clear stored API key so that the prompt is shown again on the next visit
        GM_setValue('apiKey', 'null');
    }

    // #endregion

})();