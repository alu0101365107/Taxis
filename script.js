
window.addEventListener("DOMContentLoaded", (event) => {
  const sheetDataHandler = (sheetData) => {
    console.log("sheet data: ", sheetData);
    informacionMultiple = sheetData;
    todaData = sheetData
    llenarTabla(informacionMultiple);
    // Obtener la fecha de hoy
  var hoy = new Date();
  // Filtrar las licencias que tienen un viaje en la fecha de hoy
  var licenciasConViajeHoy = informacionMultiple.filter(function (item) {
      var viajes = item.Viajes || [];
      for (var i = 0; i < viajes.length ; i++) {
          if (getDateCorrect(viajes[i]).toDateString() === hoy.toDateString()) {
            if (item.ViajesHoy == undefined) {
              item.ViajesHoy = 1
            } else {
              item.ViajesHoy +=  1
            }
          }
      }
      if (item.ViajesHoy != undefined) {
        return item
      } else {
        return 0
      }
  });
// Convertir las cadenas de fecha en objetos Date
licenciasConViajeHoy.forEach(convertirCadenasAFechas);

// Ordenar las licencias por fecha de Viajes (la más reciente primero)
licenciasConViajeHoy.sort(compararLicenciasPorFecha);
  // var ordenViajesHoy = []
  // licenciasConViajeHoy = licenciasConViajeHoy.filter(function (item) {
  //   licenciasConViajeHoy.filter(function (item2) {
  //     for 
  //   })
  //   return item
  // })
  // Crear una tabla para mostrar las licencias con viaje hoy
  var tablaLicenciasHoy = document.createElement("table");
  tablaLicenciasHoy.border = "1";
  tablaLicenciasHoy.innerHTML = "<thead><tr><th>Licencia</th><th>Total</th></tr></thead><tbody></tbody>";
  var tbodyLicenciasHoy = tablaLicenciasHoy.querySelector("tbody");
  
  // Llenar la tabla con las licencias encontradas
  var contadorTotal = 0
  var numeroServicio = 1
  licenciasConViajeHoy.forEach(function (licencia, index, array) {
      var fila = document.createElement("tr");
      // celdaLicencia.textContent = licencia.Licencia || "";
      var string = ""
      var i = licencia.Viajes.length - 1
      for (var contadorViajesHoy = licencia.ViajesHoy; contadorViajesHoy > 0; contadorViajesHoy--) {
        string += licencia.Viajes[i].toLocaleTimeString() + " "
        i--
      }
      fila.innerHTML = "<td>" + (numeroServicio++) + ". " + licencia.Licencia + "</td>" + "<td><b>" + licencia.ViajesHoy + "</b> "+ string + "</td>";
      contadorTotal += licencia.ViajesHoy
      tbodyLicenciasHoy.appendChild(fila);
      if (index == array.length - 1) {
        fila.innerHTML = "<th>Total</th>" + "<th>" + contadorTotal + "</th>";
        tbodyLicenciasHoy.appendChild(fila);
        fila = document.createElement("tr");
        var licenciasNoViaje = encontrarLicenciasFaltantes(licenciasConViajeHoy,todaData)
        var stringLicenciasNoViaje = ""
        licenciasNoViaje.forEach(function (item) {
            if (item.Licencia != undefined) {
            stringLicenciasNoViaje += item.Licencia.slice(2, item.Licencia.length) + " "
          }
        })
        fila.innerHTML = "<th>Licencias Restantes: " + (licenciasNoViaje.length - 1) + "</th>" + "<th>" + stringLicenciasNoViaje + "</th>";
        tbodyLicenciasHoy.appendChild(fila);
      }
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

function getDateCorrect(dateStr) {
  var partes = dateStr.match(/\d+/g);
  if (partes && partes.length >= 5) {
    var día = parseInt(partes[0]);
    var mes = parseInt(partes[1]) - 1;
    var año = parseInt(partes[2]);
    var hora = parseInt(partes[3]);
    var minutos = parseInt(partes[4]);
    var segundos = 0;

    // Ajustar el año para manejar años con dos dígitos
    if (año >= 0 && año <= 49) {
      año += 2000; // Siglo 21
    } else if (año >= 50 && año <= 99) {
      año += 1900; // Siglo 20
    }

    return new Date(año, mes, día, hora, minutos, segundos);
  }

  return null; // Devolvemos null si no se pudo analizar la fecha
}

// Función de comparación personalizada para ordenar las licencias por la fecha más reciente de Viajes
function compararLicenciasPorFecha(a, b) {
  // Obtener las fechas más recientes de Viajes de ambas licencias
  var fechaMasRecienteA = a.Viajes.length > 0 ? a.Viajes.reduce(function (maxDate, fecha) {
      return fecha > maxDate ? fecha : maxDate;
  }) : null;

  var fechaMasRecienteB = b.Viajes.length > 0 ? b.Viajes.reduce(function (maxDate, fecha) {
      return fecha > maxDate ? fecha : maxDate;
  }) : null;

  // Comparar las fechas más recientes (si existen)
  if (fechaMasRecienteA && fechaMasRecienteB) {
      return fechaMasRecienteB - fechaMasRecienteA; // Orden descendente (el más reciente primero)
  } else if (!fechaMasRecienteA && fechaMasRecienteB) {
      return 1; // Colocar b antes si a no tiene fecha
  } else if (fechaMasRecienteA && !fechaMasRecienteB) {
      return -1; // Colocar a antes si b no tiene fecha
  } else {
      return 0; // Igual si ambas licencias no tienen fecha
  }
}

// Función para convertir las cadenas de fecha en objetos Date
function convertirCadenasAFechas(licencia) {
  licencia.Viajes = licencia.Viajes.map(function (fechaStr) {
      return getDateCorrect(fechaStr);
  });
  return licencia;
}

function encontrarLicenciasFaltantes(licencias1, licencias2) {
  // Crear un conjunto (Set) de licencias en el primer array
  const setLicencias1 = new Set(licencias1.map((licencia) => licencia.Licencia));

  // Filtrar el segundo array para encontrar las licencias que no están en el primer array
  const licenciasFaltantes = licencias2.filter((licencia) => !setLicencias1.has(licencia.Licencia));
  return licenciasFaltantes;
}
