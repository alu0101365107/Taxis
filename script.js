
window.addEventListener("DOMContentLoaded", (event) => {
  const sheetDataHandler = (sheetData) => {
    console.log("sheet data: ", sheetData);
    informacionMultiple = sheetData;
    llenarTabla(informacionMultiple);
    //ADD YOUR CODE TO WORK WITH sheetData ARRAY OF OBJECTS HERE
  };

  // --==== QUERY EXAMPLES ====--
  // --==== USE LETTERS FOR COLUMN NAMES ====--
  //  'SELECT A,C,D WHERE D > 150'
  //  'SELECT * WHERE B = "Potato"'
  //  'SELECT * WHERE A contains "Jo"'
  //  'SELECT * WHERE C = "active" AND B contains "Jo"'
  //  "SELECT * WHERE E > date '2022-07-9' ORDER BY E DESC"

  getSheetData({
    // sheetID you can find in the URL of your spreadsheet after "spreadsheet/d/"
    sheetID: "13cMHOtAnUMkeZihjX5IHXhK9K2f9i5xDKvzYelj-jvQ",
    // sheetName is the name of the TAB in your spreadsheet (default is "Sheet1")
    sheetName: "1.GENERAL",
    query: "SELECT *",
    callback: sheetDataHandler,
  });
});

