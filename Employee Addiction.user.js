// ==UserScript==
// @name         Employee Addiction
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @updateURL    https://github.com/N-0-0-B-Coder/Torn_script/raw/main/Employee%20Addiction.user.js
// @downloadURL  https://github.com/N-0-0-B-Coder/Torn_script/raw/main/Employee%20Addiction.user.js
// @description  Display employee addiction values and message them with text when click on name
// @author       DaoChauNghia [3029549]
// @match        https://www.torn.com/index.php
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(async function() {
    'use strict';

    // Function to check the API key
    async function checkApiKey(apiKey) {
        const apiUrl = `https://api.torn.com/company/?selections=employees&key=${apiKey}`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error('Incorrect key');
        }

        return response.json();
    }

    // Function to copy text to clipboard
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    // Ask the user for the API key
    let storedApiKey = GM_getValue('apiKey');
    if (!storedApiKey || storedApiKey === 'null') {
        storedApiKey = prompt('Please enter your Torn API key (or click "Cancel" to skip):') || 'null';
        GM_setValue('apiKey', storedApiKey);

        // Check the API key immediately after user input
        if (storedApiKey !== 'null') {
            try {
                await checkApiKey(storedApiKey);
            } catch (error) {
                console.error('Incorrect key. Setting API key to "null".');
                GM_setValue('apiKey', 'null');
            }
        }
    }

    // Check if the title of the website is "Traveling | TORN"
    if (document.title === 'Traveling | TORN') {
        const Employ = {}; // Initialize an empty dictionary to store employee names and addiction values

        // Fetch data using the validated API key
        if (storedApiKey !== 'null') {
            try {
                const data = await checkApiKey(storedApiKey);
                const companyEmployees = data.company_employees;
                const allEmployeeIds = Object.keys(companyEmployees);

                // Create a new div element
                const employBox = document.createElement('div');

                // Set attributes for the new div
                employBox.id = 'employBox';
                //employBox.style.padding = '10px';
                employBox.style.marginTop = '10px';

                // Create a new div element for the delimiter
                const delimiter = document.createElement('hr');
                delimiter.className = 'delimiter___neME6';

                // Append the delimiter as a child of the employBox
                employBox.appendChild(delimiter);

                // Add a box name "Addiction" at the top
                const boxName = document.createElement('span');
                boxName.style.fontWeight = '700';
                boxName.textContent = 'Addiction';

                // Create a button for collapse/uncollapse
                const collapseButton = document.createElement('a');
                collapseButton.className = 't-blue'; // Add the "t-blue" class
                collapseButton.textContent = '[Hide]'; // Default state is collapsed
                collapseButton.style.marginLeft = '10px'; // Right margin set to 10px
                collapseButton.style['cursor'] = 'pointer';
                collapseButton.style.float = 'right';

                // Create a div for the content below the box name
                const contentBelowBox = document.createElement('div');
                contentBelowBox.id = 'contentBelowBox';

                // Toggle the visibility of the content below the box name and update the button text on click
                collapseButton.addEventListener('click', () => {
                    const isHidden = contentBelowBox.style.display === 'none';
                    contentBelowBox.style.display = isHidden ? 'block' : 'none';
                    collapseButton.textContent = isHidden ? '[Hide]' : '[Show]';
                });

                // Append the box name and collapse/uncollapse button to the employBox
                employBox.appendChild(boxName);
                employBox.appendChild(collapseButton);

                // Append the contentBelowBox as a child of the employBox
                employBox.appendChild(contentBelowBox);

                allEmployeeIds.forEach(employeeId => {
                    const employee = companyEmployees[employeeId];
                    const name = employee.name;
                    const addiction = employee.effectiveness.addiction || 0;

                    // Add employee name and addiction value to the dictionary
                    Employ[name] = { addict: addiction };

                    // Create a row for each employee with name and addiction value
                    const row = document.createElement('p');
                    row.style.lineHeight = '20px';
                    row.style.textDecoration = 'none';
                    row.id = `npcTimer${employeeId}`;

                    // Create a link element for copying to clipboard
                    const copyLink = document.createElement('a');
                    copyLink.className = 't-blue href desc';
                    copyLink.style.display = 'inline-block';
                    copyLink.href = `https://www.torn.com/messages.php#/p=compose&XID=${employeeId}`;
                    copyLink.textContent = name;

                    // Add a click event listener to copy the text to clipboard
                    copyLink.addEventListener('click', (event) => {
                        event.preventDefault();
                        const copyText = addiction < -9
                            ? `Good day ${name}, your addict is ${addiction} which is too high, time to go to rehab`
                            : `Good day ${name}, remember to maintain your addict small`;
                        copyToClipboard(copyText);
                        // Open new page
                        const composeUrl = `https://www.torn.com/messages.php#/p=compose&XID=${employeeId}`;
                        window.open(composeUrl, '_blank');
                        //alert(`Text "${copyText}" copied to clipboard!`);
                    });

                    // Create a span element for the addiction value
                    const addictionSpan = document.createElement('span');
                    addictionSpan.style.float = 'right';
                    addictionSpan.textContent = addiction;

                    // Append the link and addiction span to the row
                    row.appendChild(copyLink);
                    row.appendChild(addictionSpan);

                    // Append the row to the contentBelowBox
                    contentBelowBox.appendChild(row);

                    console.log(`${name}'s addiction value: ${addiction}`);
                });

                // Log the final dictionary
                console.log('Employ Dictionary:', Employ);

                // Append the employBox as a child of the element with class 'content___GVtZ_'
                document.querySelector('.content___GVtZ_').appendChild(employBox);
            } catch (error) {
                console.error('Error fetching data:', error.message);
            }
        } else {
            console.log('User has chosen not to provide an API key or entered an incorrect key.');

            // Clear stored API key so that the prompt is shown again on the next visit
            GM_setValue('apiKey', 'null');
        }
    } else {
        console.log('Script will only run on the "Traveling | TORN" page.');
    }
})();
