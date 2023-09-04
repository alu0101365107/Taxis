
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
licenciasConViajeHoy.sort(compararLicenciasPorUltimoViaje);
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
  var numeroTotalViajes = 0; // Variable para calcular el número total de viajes
  
  // Llenar la tabla con las licencias encontradas
  var numeroServicio = 1;
  licenciasConViajeHoy.forEach(function (licencia, index, array) {
    var fila = document.createElement("tr");
    var string = "";
    var i = licencia.Viajes.length - 1;
    for (var contadorViajesHoy = licencia.ViajesHoy; contadorViajesHoy > 0; contadorViajesHoy--) {
      string += licencia.Viajes[i].toLocaleTimeString() + " ";
      i--;
    }
    fila.innerHTML = "<td>" + (numeroServicio++) + ". " + licencia.Licencia + "</td>" + "<td><b>" + licencia.ViajesHoy + "</b> " + string + "</td>";
    numeroTotalViajes += licencia.ViajesHoy;
    tablaLicenciasHoy.appendChild(fila);
    
    if (index == array.length - 1) {
      // Agregar la fila "Total" al inicio de la tabla junto al número total de viajes
      var filaTotal = document.createElement("tr");
      filaTotal.innerHTML = "<th>Licencia</th><th>Total: " + numeroTotalViajes + "</th>";
      tablaLicenciasHoy.insertBefore(filaTotal, tablaLicenciasHoy.firstChild);
  
      // Agregar la fila de "Licencias Restantes" después de la fila "Total"
      var filaLicenciasRestantes = document.createElement("tr");
      var licenciasNoViaje = encontrarLicenciasFaltantes(licenciasConViajeHoy, todaData);
      var stringLicenciasNoViaje = "";
      licenciasNoViaje.forEach(function (item) {
        if (item.Licencia != undefined) {
          stringLicenciasNoViaje += item.Licencia.slice(2, item.Licencia.length) + " ";
        }
      });
      filaLicenciasRestantes.innerHTML = "<th>Licencias Restantes: " + (licenciasNoViaje.length - 1) + "</th>" + "<th>" + stringLicenciasNoViaje + "</th>";
      tablaLicenciasHoy.appendChild(filaLicenciasRestantes);
    }
  });
  
  // Agregar la tabla al documento
  document.body.appendChild(tablaLicenciasHoy);
  
  
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

// Referencias a los botones
const darkModeButton = document.getElementById("darkModeButton");
const sortButton = document.getElementById("sortButton");
const body = document.body;

// Manejar el cambio al modo oscuro
darkModeButton.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
});

// Obtén una referencia al botón "Ordenar por Total" y a la tabla
var botonOrdenarPorTotal = document.getElementById("sortButton");
var tabla = document.getElementById("informacionTabla");

// Agrega un controlador de eventos al botón para ordenar la tabla cuando se hace clic
botonOrdenarPorTotal.addEventListener("click", function () {
  ordenarTablaPorTotal();
});

// Función para ordenar la tabla por la columna "Total"
function ordenarTablaPorTotal() {
  var tbody = tabla.querySelector("tbody");
  var filas = Array.from(tbody.querySelectorAll("tr"));

  // Utiliza una función de comparación personalizada para ordenar las filas por "Total"
  filas.sort(function (filaA, filaB) {
    var totalA = parseInt(filaA.querySelector("td:nth-child(2)").textContent);
    var totalB = parseInt(filaB.querySelector("td:nth-child(2)").textContent);

    // Ordena en orden descendente (el número más grande primero)
    return totalB - totalA;
  });

  // Limpia el contenido anterior de tbody
  tbody.innerHTML = "";

  // Vuelve a agregar las filas ordenadas a tbody
  filas.forEach(function (fila) {
    tbody.appendChild(fila);
  });
}

// También puedes agregar estilos CSS para resaltar el botón cuando está activo
botonOrdenarPorTotal.addEventListener("click", function () {
  botonOrdenarPorTotal.classList.toggle("orden-activo");
});

botonOrdenarPorTotal.addEventListener("touchstart", ordenarTablaPorTotal);



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

function compararLicenciasPorUltimoViaje(a, b) {
  // Obtener la hora del último viaje de ambas licencias
  var ultimaHoraA = obtenerHoraUltimoViaje(a.Viajes);
  var ultimaHoraB = obtenerHoraUltimoViaje(b.Viajes);

  // Comparar las horas del último viaje
  if (ultimaHoraA > ultimaHoraB) {
    return -1; // Colocar a antes si a tiene un último viaje más tarde
  } else if (ultimaHoraA < ultimaHoraB) {
    return 1; // Colocar b antes si b tiene un último viaje más tarde
  } else {
    return 0; // Igual si ambas licencias tienen la misma hora del último viaje
  }
}

// Función para obtener la hora del último viaje
function obtenerHoraUltimoViaje(viajes) {
  if (viajes.length > 0) {
    var ultimoViaje = viajes[viajes.length - 1];
    return ultimoViaje.getHours() * 60 + ultimoViaje.getMinutes();
  } else {
    return -1; // Valor predeterminado en caso de que no haya viajes
  }
}


// Ordenar las licencias por hora y minutos del último viaje
licenciasConViajeHoy.sort(compararLicenciasPorHoraMasReciente);



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
