// ==UserScript==
// @name         Spies Export
// @namespace    http://tampermonkey.net/
// @version      2024-03-29
// @description  Export spies data to CSV
// @author       DaoChauNghia
// @match        https://www.tornstats.com/spies/faction?page=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tornstats.com
// @grant        none
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
    var csv = [];
    var rows = document.querySelectorAll("#spies-table tbody tr");

    for (var i = 0; i < rows.length; i++) {
      var row = [],
        cols = rows[i].querySelectorAll("td");

      for (var j = 0; j < cols.length; j++) {
        var cellData = cols[j].innerText.trim().replace(/,/g, ""); // Remove commas
        row.push(cellData);
      }

      csv.push(row.join(","));
    }

    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
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

  // Attach event listener to the button
  downloadButton.addEventListener("click", function () {
    exportTableToCSV("spies_data.csv");
  });
})();
