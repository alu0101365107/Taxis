// script.js

window.addEventListener("DOMContentLoaded", (event) => {
    const sheetDataHandler = (sheetData) => {
        console.log("sheet data: ", sheetData);
        informacionMultiple = sheetData;
        todaData = sheetData;
        llenarTabla(informacionMultiple);
        mostrarLicenciasConViajeHoy(informacionMultiple);
    };

    getSheetData({
        sheetID: "13cMHOtAnUMkeZihjX5IHXhK9K2f9i5xDKvzYelj-jvQ",
        sheetName: "1.GENERAL",
        query: "SELECT *",
        callback: sheetDataHandler,
    });
});

const sortButton = document.getElementById("sortButton");
sortButton.addEventListener("click", () => {
    ordenarTablaPorTotal();
    sortButton.classList.toggle("orden-activo");
});

var informacionMultiple = [];

function llenarTabla(data) {
  var tabla = document.getElementById("informacionTabla");
  var tbody = tabla.querySelector("tbody");

  tbody.innerHTML = "";

  data.forEach(function (item, index) {
      var fila = document.createElement("tr");
      var string = "";
      fila.innerHTML = "<td>" + item.Licencia + "</td>" +
                       "<td>" + item.Total + "</td>";
      item.Viajes.forEach(function (viaje) {
          if (typeof viaje === 'string') {
              string += getDateCorrect(viaje).toLocaleString() + "<br>";
          }
      });
      fila.innerHTML += "<td>" + string + "</td>";
      tbody.appendChild(fila);

      if (index === 9) {
          tabla.classList.add("columnas");
      }
  });
}

function actualizarEncabezado() {
    const encabezado = document.querySelector("h1");
    const fechaHoraActual = new Date();
    const diaSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][fechaHoraActual.getDay()];
    const dia = fechaHoraActual.getDate();
    const mes = fechaHoraActual.getMonth() + 1;
    const año = fechaHoraActual.getFullYear();
    const hora = fechaHoraActual.getHours();
    const minutos = fechaHoraActual.getMinutes();

    const fechaHoraFormateada = `${diaSemana}, ${dia}/${mes}/${año} ${hora}:${minutos}`;

    encabezado.textContent = `Información Organizada - ${fechaHoraFormateada}`;
}

window.addEventListener("DOMContentLoaded", actualizarEncabezado);
setInterval(actualizarEncabezado, 60000);

function getDateCorrect(dateStr) {
    if (typeof dateStr !== "number") {
        var partes = dateStr.match(/\d+/g);
        if (partes && partes.length >= 5) {
            var día = parseInt(partes[0]);
            var mes = parseInt(partes[1]) - 1;
            var año = parseInt(partes[2]);
            var hora = parseInt(partes[3]);
            var minutos = parseInt(partes[4]);
            var segundos = 0;

            if (año >= 0 && año <= 49) {
                año += 2000;
            } else if (año >= 50 && año <= 99) {
                año += 1900;
            }

            return new Date(año, mes, día, hora, minutos, segundos);
        }
    }
    return null;
  }

function ordenarTablaPorTotal() {
    var tabla = document.getElementById("informacionTabla");
    var tbody = tabla.querySelector("tbody");
    var filas = Array.from(tbody.querySelectorAll("tr"));

    filas.sort(function (filaA, filaB) {
        var totalA = parseInt(filaA.querySelector("td:nth-child(2)").textContent);
        var totalB = parseInt(filaB.querySelector("td:nth-child(2)").textContent);
        return totalB - totalA;
    });

    tbody.innerHTML = "";
    filas.forEach(function (fila) {
        tbody.appendChild(fila);
    });
}

function mostrarLicenciasConViajeHoy(data) {
    var hoy = new Date();
    var licenciasConViajeHoy = data.filter(function (item) {
        var viajes = item.Viajes || [];
        for (var i = 0; i < viajes.length; i++) {
            if (typeof viajes[i] === 'string') {
                if (getDateCorrect(viajes[i]).toDateString() === hoy.toDateString()) {
                    if (item.ViajesHoy == undefined) {
                        item.ViajesHoy = 1;
                    } else {
                        item.ViajesHoy += 1;
                    }
                }
            }
        }
        return item.ViajesHoy != undefined;
    });

    licenciasConViajeHoy.forEach(convertirCadenasAFechas);
    licenciasConViajeHoy.sort(compararLicenciasPorUltimoViaje);

    var tablaLicenciasHoy = document.createElement("table");
    var numeroTotalViajes = 0;

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
            var tiempoPromedioHoy = calcularTiempoPromedioHoy(licenciasConViajeHoy);

            var filaTotal = document.createElement("tr");
            var horaEstimadaSiguienteViaje = calcularHoraEstimadaSiguienteViaje(tiempoPromedioHoy);
            filaTotal.innerHTML = "<th>Licencia</th><th>Total: " + numeroTotalViajes + " (Se espera el siguiente viaje en: " + tiempoPromedioHoy + " a las " + horaEstimadaSiguienteViaje + ")</th>";
            tablaLicenciasHoy.insertBefore(filaTotal, tablaLicenciasHoy.firstChild);

            var filaLicenciasRestantes = document.createElement("tr");
            var licenciasNoViaje = encontrarLicenciasFaltantes(licenciasConViajeHoy, data);
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

    var divTablaLicenciasHoy = document.getElementById("tablaLicenciasHoy");
    divTablaLicenciasHoy.innerHTML = "";
    divTablaLicenciasHoy.appendChild(tablaLicenciasHoy);
}

function calcularHoraEstimadaSiguienteViaje(tiempoPromedioHoy) {
  var horaActual = new Date();
  var horas = parseInt(tiempoPromedioHoy.split(":")[0]);
  var minutos = parseInt(tiempoPromedioHoy.split(":")[1]);
  var segundos = parseInt(tiempoPromedioHoy.split(":")[2]);

  horaActual.setHours(horaActual.getHours() + horas);
  horaActual.setMinutes(horaActual.getMinutes() + minutos);
  horaActual.setSeconds(horaActual.getSeconds() + segundos);

  return horaActual.toLocaleTimeString();
}

function convertirCadenasAFechas(licencia) {
    licencia.Viajes = licencia.Viajes.map(getDateCorrect);
}

function compararLicenciasPorUltimoViaje(a, b) {
    var ultimoViajeA = obtenerHoraUltimoViaje(a);
    var ultimoViajeB = obtenerHoraUltimoViaje(b);

    return ultimoViajeB - ultimoViajeA;
}

function obtenerHoraUltimoViaje(licencia) {
    return licencia.Viajes[licencia.Viajes.length - 1];
}

function encontrarLicenciasFaltantes(licencias1, licencias2) {
  // Crear un conjunto (Set) de licencias en el primer array
  const setLicencias1 = new Set(licencias1.map((licencia) => licencia.Licencia));

  // Filtrar el segundo array para encontrar las licencias que no están en el primer array
  const licenciasFaltantes = licencias2.filter((licencia) => !setLicencias1.has(licencia.Licencia));
  return licenciasFaltantes;
}

function calcularTiempoPromedioHoy(data) {
    var hoy = new Date();
    var viajesHoy = [];

    data.forEach(function (licencia) {
        licencia.Viajes.forEach(function (viaje) {
            if (viaje.toDateString() === hoy.toDateString()) {
                viajesHoy.push(viaje);
            }
        });
    });

    if (viajesHoy.length < 2) {
        return "N/A";
    }

    viajesHoy.sort((a, b) => a - b);

    var tiemposEntreViajes = [];

    for (var i = 1; i < viajesHoy.length; i++) {
        var tiempoEntreViajes = (viajesHoy[i] - viajesHoy[i - 1]) / 1000;
        tiemposEntreViajes.push(tiempoEntreViajes);
    }

    var sumaTiempos = tiemposEntreViajes.reduce((a, b) => a + b, 0);
    var tiempoPromedio = sumaTiempos / tiemposEntreViajes.length;

    var horas = Math.floor(tiempoPromedio / 3600);
    var minutos = Math.floor((tiempoPromedio % 3600) / 60);
    var segundos = Math.floor(tiempoPromedio % 60);

    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}
