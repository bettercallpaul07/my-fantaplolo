// utils/csvLoader.js
import Papa from 'papaparse'

export const loadCSV = (filePath, callback) => {
  fetch(filePath)
    .then(response => response.text())
    .then(csvText => {
      Papa.parse(csvText, {
        header: true,
        dynamicTyping: true,
        complete: function(results) {
          callback(results.data)
        }
      })
    })
}