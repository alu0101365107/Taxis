const getSheetData = ({ sheetID, sheetName, query, callback }) => {
    const base = `https://docs.google.com/spreadsheets/d/${sheetID}/gviz/tq?`;
    const url = `${base}&sheet=${encodeURIComponent(
      sheetName
    )}&tq=${encodeURIComponent(query)}`;
  
    fetch(url)
      .then((res) => res.text())
      .then((response) => {
        callback(responseToObjects(response));
      });
    const isToday = (dateToCheck) => {
      // Get today's date
      const today = new Date();
      // Compare the components of the dateToCheck with today's date
      const isSameDate =
        dateToCheck.getDate() === today.getDate() &&
        dateToCheck.getMonth() + 1 === today.getMonth() &&
        dateToCheck.getFullYear() === today.getFullYear();
       
      // Return true if the dateToCheck is today, otherwise return false
      return isSameDate;
    };

    function responseToObjects(res) {
      // credit to Laurence Svekis https://www.udemy.com/course/sheet-data-ajax/
      const jsData = JSON.parse(res.substring(47).slice(0, -2));
      let data = [];
      let object = {}
      let Viaje = "Viajes"
      let viajes = [] 
      for (let tmp = 1; tmp < jsData.table.rows.length; tmp++) {
        for (let index = 0; index < jsData.table.rows[tmp].c.length; index++) {
            if (index == 0 && jsData.table.rows[tmp].c[index] != null){
                object["Licencia"] = jsData.table.rows[tmp].c[index].v
            } else if (index == 1 && jsData.table.rows[tmp].c[index] != null) { 
                object["Total"] = jsData.table.rows[tmp].c[index].f
            } else if (jsData.table.rows[tmp].c[index] != null) {
                date = jsData.table.rows[tmp].c[index].v
                if (date != undefined && typeof date == "string") {
                    viajes.push(date)
                    // date = date.slice(4)
                    // var partes = date.substring(1, date.length - 1).split(',');
                    // // Obtiene los componentes de la fecha a partir del array
                    // var año = parseInt(partes[0]);
                    // var mes = parseInt(partes[1]);
                    // var día = parseInt(partes[2]);
                    // var hora = parseInt(partes[3]);
                    // var minutos = parseInt(partes[4]);
                    // var segundos = parseInt(partes[5]);
                    // console.log(date + " " + jsData.table.rows[tmp].c[index].f + " " + 
                    // isToday(new Date(año, mes - 1, día, hora, minutos, segundos)))
                }
            } 
        } 
        object[Viaje] = viajes;
        data.push(object)
        viajes = []
        object = {}
      }
    //   const columns = jsData.table.cols;
    //   const rows = jsData.table.rows;
    //   let rowObject;
    //   let cellData;
    //   for (let r = 0, rowMax = rows.length; r < rowMax; r++) {
    //     rowObject = {};
    //     for (let c = 0, colMax = columns.length; c < colMax; c++) {
    //       cellData = rows[r]["c"][c];
    //       propName = columns[c].label;
    //       if (cellData === null) {
    //         rowObject[propName] = "";
    //       } else if (
    //         typeof cellData["v"] == "string" &&
    //         cellData["v"].startsWith("Date")
    //       ) {
    //         rowObject[propName] = new Date(cellData["f"]);
    //       } else {
    //         rowObject[propName] = cellData["v"];
    //       }
    //     }
    //     data.push(rowObject);
    //   }
      return data;
    }
  };