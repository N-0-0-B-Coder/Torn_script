// ==UserScript==
// @name         Spies Export (manual)
// @namespace    http://tampermonkey.net/
// @version      2024-03-29
// @description  Export spies data to CSV format
// @author       DaoChauNghia
// @match        https://www.tornstats.com/spies/faction*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tornstats.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==

(function () {
  "use strict";

  function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV file
    csvFile = new Blob([csv], { type: "text/csv" });

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();

    // Clean up
    document.body.removeChild(downloadLink);
  }

  function exportTableToCSV(filename) {
    var csv = GM_getValue("temporaryCSVData");
    if (!csv) {
      alert("No CSV data found.");
      return;
    }

    // Download CSV file
    downloadCSV(csv, filename);
  }

  function saveCSVTemporarily() {
    var csv = GM_getValue("temporaryCSVData", ""); // Retrieve existing CSV data, default to empty string if not found
    var newData = []; // Array to store new data

    // Generate CSV data from the current table
    var rows = document.querySelectorAll("#spies-table tbody tr");
    for (var i = 0; i < rows.length; i++) {
      var row = [],
        cols = rows[i].querySelectorAll("td");

      for (var j = 0; j < cols.length; j++) {
        var cellData = cols[j].innerText.trim().replace(/,/g, ""); // Remove commas
        row.push(cellData);
      }

      newData.push(row.join(","));
    }

    // Combine existing CSV data with new data
    var combinedData = csv + "\n" + newData.join("\n");

    // Save combined CSV data temporarily
    GM_setValue("temporaryCSVData", combinedData);
    alert("CSV data saved temporarily!");
  }

  function deleteCachedCSVData() {
    GM_deleteValue("temporaryCSVData");
    alert("Cached CSV data deleted!");
  }

  // Create download button
  var downloadButton = document.createElement("button");
  downloadButton.textContent = "Download CSV";
  downloadButton.style.marginRight = "10px"; // Adjust style as needed

  // Append button before specified path
  var targetElement = document.querySelector(
    "#app > div.container.pt-5 > div > div > div > div > nav"
  );
  if (targetElement) {
    targetElement.insertBefore(downloadButton, targetElement.firstChild);
  }

  // Attach event listener to the download button
  downloadButton.addEventListener("click", function () {
    exportTableToCSV("spies_data.csv");
  });

  // Create save button
  var saveButton = document.createElement("button");
  saveButton.textContent = "Save CSV Data Temporarily";

  // Append button before specified path
  if (targetElement) {
    targetElement.insertBefore(saveButton, targetElement.firstChild);
  }

  // Attach event listener to the save button
  saveButton.addEventListener("click", function () {
    saveCSVTemporarily();
  });

  // Create delete cache button
  var deleteCacheButton = document.createElement("button");
  deleteCacheButton.textContent = "Delete Cached Data";

  // Append button before specified path
  if (targetElement) {
    targetElement.insertBefore(deleteCacheButton, targetElement.firstChild);
  }

  // Attach event listener to the delete cache button
  deleteCacheButton.addEventListener("click", function () {
    deleteCachedCSVData();
  });
})();
