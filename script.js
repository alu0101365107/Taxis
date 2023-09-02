
window.addEventListener("DOMContentLoaded", (event) => {
  const sheetDataHandler = (sheetData) => {
    console.log("sheet data: ", sheetData);
    informacionMultiple = sheetData;
    llenarTabla(informacionMultiple);
    // Obtener la fecha de hoy
  var hoy = new Date("09/02/2023");
  // Filtrar las licencias que tienen un viaje en la fecha de hoy
  var licenciasConViajeHoy = informacionMultiple.filter(function (item) {
      var viajes = item.Viajes || [];
      for (var i = 0; i < viajes.length; i++) {
          viajes[i] = viajes[i].slice(4)
          var partes = viajes[i].substring(1, viajes[i].length - 1).split(',');
          // Obtiene los componentes de la fecha a partir del array
          var año = parseInt(partes[0]);
          var mes = parseInt(partes[1]) + 1;
          var día = parseInt(partes[2]);
          var hora = parseInt(partes[3]);
          var minutos = parseInt(partes[4]);
          var segundos = parseInt(partes[5]);
          var fechaViaje = new Date(año, mes - 1, día, hora, minutos, segundos)
          console.log(hoy.toDateString())
          console.log(fechaViaje.toDateString())
          if (fechaViaje.toDateString() === hoy.toDateString()) {
              return true;
          }
      }
      return false;
  });
  
  // Crear una tabla para mostrar las licencias con viaje hoy
  var tablaLicenciasHoy = document.createElement("table");
  tablaLicenciasHoy.border = "1";
  tablaLicenciasHoy.innerHTML = "<thead><tr><th>Licencia</th></tr></thead><tbody></tbody>";
  var tbodyLicenciasHoy = tablaLicenciasHoy.querySelector("tbody");
  
  // Llenar la tabla con las licencias encontradas
  licenciasConViajeHoy.forEach(function (licencia) {
      var fila = document.createElement("tr");
      var celdaLicencia = document.createElement("td");
      celdaLicencia.textContent = licencia.Licencia || "";
      fila.appendChild(celdaLicencia);
      tbodyLicenciasHoy.appendChild(fila);
  });
  
  // Agregar la tabla de licencias con viaje hoy al documento
  var contenedorTablaLicenciasHoy = document.getElementById("tablaLicenciasHoy");
  contenedorTablaLicenciasHoy.appendChild(tablaLicenciasHoy);
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

