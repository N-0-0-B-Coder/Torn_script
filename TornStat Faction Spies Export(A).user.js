// ==UserScript==
// @name         Spies Export
// @namespace    http://tampermonkey.net/
// @version      2024-03-29
// @description  Export spies data to CSV and save it temporarily
// @author       DaoChauNghia
// @match        https://www.tornstats.com/spies/faction*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tornstats.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==

(function () {
  "use strict";

  // Function to download CSV
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

  // Function to export table data to CSV
  function exportTableToCSV(filename) {
    var csv = GM_getValue("temporaryCSVData");
    if (!csv) {
      alert("No CSV data found.");
      return;
    }

    // Download CSV file
    downloadCSV(csv, filename);
  }

  // Function to save CSV data temporarily

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
    //alert("CSV data saved temporarily!");
  }

  // Function to delete cached CSV data
  function deleteCachedCSVData() {
    GM_deleteValue("temporaryCSVData");
    alert("Cached CSV data deleted!");
  }

  // Function to process each page
  function processPage(pageNumber, endPage) {
    // Check if the current page number is within the specified range
    if (pageNumber > endPage) {
      alert("Export completed!");
      return;
    }

    //go to the designated page
    window.location.href =
      "https://www.tornstats.com/spies/faction?page=" + pageNumber;

    // Retrieve data from the current page
    //var csvData = exportTableToCSV("spies_data_page_" + pageNumber + ".csv");
    saveCSVTemporarily();

    // Proceed to the next page
    var nextPage = pageNumber + 1;
    window.location.href =
      "https://www.tornstats.com/spies/faction?page=" + nextPage;
  }

  // Function to start exporting data
  function startExport(startPage, endPage) {
    // Check if startPage and endPage are valid numbers
    if (isNaN(startPage) || isNaN(endPage)) {
      alert("Please enter valid page numbers.");
      return;
    }

    // Process the first page
    processPage(startPage, endPage);
  }

  // Create download button
  var downloadButton = document.createElement("button");
  downloadButton.textContent = "Download CSV";
  downloadButton.style.marginRight = "10px"; // Adjust style as needed

  // Attach event listener to the download button
  downloadButton.addEventListener("click", function () {
    exportTableToCSV("spies_data.csv");
  });

  // Create start button and input fields
  var startButton = document.createElement("button");
  startButton.textContent = "Start Export";

  var startPageInput = document.createElement("input");
  startPageInput.type = "text";
  startPageInput.placeholder = "Starting page";

  var endPageInput = document.createElement("input");
  endPageInput.type = "text";
  endPageInput.placeholder = "Ending page";

  // Create delete cache button
  var deleteCacheButton = document.createElement("button");
  deleteCacheButton.textContent = "Delete Cached Data";
  //document.body.appendChild(deleteCacheButton);

  // Attach event listener to the delete cache button
  deleteCacheButton.addEventListener("click", function () {
    deleteCachedCSVData();
  });
  // Attach event listener to the start button
  startButton.addEventListener("click", function () {
    var startPage = parseInt(startPageInput.value);
    var endPage = parseInt(endPageInput.value);

    startExport(startPage, endPage);
  });

  // Append button before specified path
  var targetElement = document.querySelector(
    "#app > div.container.pt-5 > div > div > div > div > nav"
  );
  if (targetElement) {
    targetElement.insertBefore(deleteCacheButton, targetElement.firstChild);
    targetElement.insertBefore(downloadButton, targetElement.firstChild);
    targetElement.insertBefore(startButton, targetElement.firstChild);
    targetElement.insertBefore(endPageInput, targetElement.firstChild);
    targetElement.insertBefore(startPageInput, targetElement.firstChild);
  }
})();
