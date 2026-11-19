
const btnComparar = document.getElementById("btnComparar");
const btnDescargar = document.getElementById("btnDescargar");
const resultado = document.getElementById("resultado");
const btnRefrescar = document.getElementById("btnRefrescar");

let diferencias = [];

function leerArchivo(archivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject("Error al leer el archivo");

        reader.readAsText(archivo);
    });
}

btnComparar.addEventListener("click", async function () {

    const archivo1 = document.getElementById("archivo1").files[0];
    const archivo2 = document.getElementById("archivo2").files[0];

    resultado.replaceChildren();
    diferencias = [];
    btnDescargar.hidden = true;

    if (!archivo1 || !archivo2) {
        resultado.textContent = "Debe seleccionar los dos archivos TXT.";
        return;
    }

    try {
        const [texto1, texto2] = await Promise.all([
            leerArchivo(archivo1),
            leerArchivo(archivo2)
        ]);

        const lineas1 = texto1.replace(/\r/g, "").split("\n");
        const lineas2 = texto2.replace(/\r/g, "").split("\n");

        const total = Math.max(lineas1.length, lineas2.length);

        for (let i = 0; i < total; i++) {

            const valor1 = lineas1[i] ?? "";
            const valor2 = lineas2[i] ?? "";

            if (valor1 !== valor2) {
                diferencias.push({
                    numero: i + 1,
                    archivo1: valor1,
                    archivo2: valor2
                });
            }
        }

        // Mostrar resultados
        const titulo = document.createElement("h3");
        titulo.textContent = "Resultado de la comparación";
        resultado.appendChild(titulo);

        const resumen = document.createElement("p");
        resumen.textContent = "Diferencias encontradas: " + diferencias.length;
        resultado.appendChild(resumen);

        if (diferencias.length === 0) {
            const mensaje = document.createElement("p");
            mensaje.textContent = "Los archivos son iguales.";
            mensaje.className = "coincide";
            resultado.appendChild(mensaje);
            return;
        }

        diferencias.forEach(d => {

            const div = document.createElement("div");
            div.className = "diferencia";

            const linea = document.createElement("strong");
            linea.textContent = "Línea " + d.numero;

            const archivoUno = document.createElement("p");
            archivoUno.textContent = "Archivo 1: " + d.archivo1;

            const archivoDos = document.createElement("p");
            archivoDos.textContent = "Archivo 2: " + d.archivo2;

            div.appendChild(linea);
            div.appendChild(archivoUno);
            div.appendChild(archivoDos);

            resultado.appendChild(div);
        });

        btnDescargar.hidden = false;

    } catch (error) {
        resultado.textContent = "Error: " + error;
        console.error(error);
    }
});

// Descargar diferencias
btnDescargar.addEventListener("click", function () {

    let contenido = "LINEA | ARCHIVO 1 | ARCHIVO 2\n\n";

    diferencias.forEach(d => {
        contenido += `${d.numero} | ${d.archivo1} | ${d.archivo2}\n`;
    });

    const blob = new Blob([contenido], {
        type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "diferencias.txt";
    link.click();

    URL.revokeObjectURL(url);
});

// Refrescar / limpiar pantalla
btnRefrescar.addEventListener("click", function () {

    // Limpiar archivos seleccionados
    document.getElementById("archivo1").value = "";
    document.getElementById("archivo2").value = "";

    // Limpiar resultados
    resultado.replaceChildren();

    // Reiniciar diferencias
    diferencias = [];

    // Ocultar botón descargar
    btnDescargar.hidden = true;

});


/*const btnComparar = document.getElementById("btnComparar");
const btnDescargar = document.getElementById("btnDescargar");
const resultado = document.getElementById("resultado");
const btnRefrescar = document.getElementById("refresh");

let diferencias = [];

// Leer archivo TXT
function leerArchivo(archivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject("Error al leer el archivo");

        reader.readAsText(archivo);
    });
}

// Comparar archivos
btnComparar.addEventListener("click", async () => {

    const archivo1 = document.getElementById("archivo1").files[0];
    const archivo2 = document.getElementById("archivo2").files[0];

    resultado.innerHTML = "";
    diferencias = [];
    btnDescargar.hidden = true;

    if (!archivo1 || !archivo2) {
        resultado.textContent = "Seleccioná los dos archivos.";
        return;
    }

    try {
        const texto1 = await leerArchivo(archivo1);
        const texto2 = await leerArchivo(archivo2);

        const lineas1 = texto1.split(/\r?\n/);
        const lineas2 = texto2.split(/\r?\n/);

        const maxLineas = Math.max(lineas1.length, lineas2.length);

        for (let i = 0; i < maxLineas; i++) {

            const linea1 = lineas1[i];
            const linea2 = lineas2[i];

            if (linea1 !== linea2) {

                const diferencia = {
                    numero: i + 1,
                    archivo1: linea1 ?? "(No existe)",
                    archivo2: linea2 ?? "(No existe)"
                };

                diferencias.push(diferencia);
            }
        }

        // Mostrar resultado
        if (diferencias.length === 0) {
            resultado.innerHTML = '<p class="coincide">Los archivos son iguales.</p>';
        } else {

            resultado.innerHTML = `
                <h3>Diferencias encontradas: ${diferencias.length}</h3>
            `;

            diferencias.forEach(d => {
                const div = document.createElement("div");
                div.className = "diferencia";

                div.textContent =
                    `Línea ${d.numero} | Archivo 1: ${d.archivo1} | Archivo 2: ${d.archivo2}`;

                resultado.appendChild(div);
            });

            btnDescargar.hidden = false;
        }

    } catch (error) {
        resultado.textContent = error;
    }
});

btnRefrescar.addEventListener

// Descargar diferencias
btnDescargar.addEventListener("click", () => {

    let contenido = "LINEA | ARCHIVO 1 | ARCHIVO 2\n\n";

    diferencias.forEach(d => {
        contenido += `${d.numero} | ${d.archivo1} | ${d.archivo2}\n`;
    });

    const blob = new Blob([contenido], {
        type: "text/plain;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "diferencias.txt";
    link.click();

    URL.revokeObjectURL(url);
});


/*
  // Carga un archivo .txt dentro de un textarea
  function cargarArchivo(inputId, textareaId) {
    document.getElementById(inputId).addEventListener('change', (e) => {
      const archivo = e.target.files[0];
      if (!archivo) return;
      const lector = new FileReader();
      lector.onload = () => { document.getElementById(textareaId).value = lector.result; };
      lector.readAsText(archivo);
    });
  }
  cargarArchivo('archivo1', 'texto1');
  cargarArchivo('archivo2', 'texto2');

  // Diferencias línea por línea usando la subsecuencia común más larga (LCS)
  function diferencias(a, b, normalizar) {
    const A = a.map(normalizar);
    const B = b.map(normalizar);
    const n = A.length, m = B.length;

    // Tabla LCS
    const t = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        t[i][j] = A[i] === B[j] ? t[i + 1][j + 1] + 1 : Math.max(t[i + 1][j], t[i][j + 1]);
      }
    }

    // Recorrido para armar el resultado
    const res = [];
    let i = 0, j = 0;
    while (i < n && j < m) {
      if (A[i] === B[j]) {
        res.push({ tipo: 'igual', texto: b[j], n1: i + 1, n2: j + 1 });
        i++; j++;
      } else if (t[i + 1][j] >= t[i][j + 1]) {
        res.push({ tipo: 'eliminada', texto: a[i], n1: i + 1, n2: '' });
        i++;
      } else {
        res.push({ tipo: 'agregada', texto: b[j], n1: '', n2: j + 1 });
        j++;
      }
    }
    while (i < n) { res.push({ tipo: 'eliminada', texto: a[i], n1: i + 1, n2: '' }); i++; }
    while (j < m) { res.push({ tipo: 'agregada', texto: b[j], n1: '', n2: j + 1 }); j++; }
    return res;
  }

  function comparar() {
    const lineas1 = document.getElementById('texto1').value.split(/\r?\n/);
    const lineas2 = document.getElementById('texto2').value.split(/\r?\n/);
    const ignorarMayus = document.getElementById('ignorarMayus').checked;
    const ignorarEspacios = document.getElementById('ignorarEspacios').checked;

    const normalizar = (linea) => {
      if (ignorarEspacios) linea = linea.trim().replace(/\s+/g, ' ');
      if (ignorarMayus) linea = linea.toLowerCase();
      return linea;
    };

    const resultado = diferencias(lineas1, lineas2, normalizar);
    const contenedor = document.getElementById('resultado');
    contenedor.textContent = '';

    let agregadas = 0, eliminadas = 0;
    resultado.forEach((r) => {
      const fila = document.createElement('div');
      fila.className = 'linea ' + (r.tipo === 'igual' ? '' : r.tipo);

      const signo = r.tipo === 'agregada' ? '+' : r.tipo === 'eliminada' ? '−' : '';
      if (r.tipo === 'agregada') agregadas++;
      if (r.tipo === 'eliminada') eliminadas++;

      // textContent evita interpretar HTML del archivo
      [['num', r.n1], ['num', r.n2], ['signo', signo], ['txt', r.texto]].forEach(([clase, valor]) => {
        const celda = document.createElement('span');
        celda.className = clase;
        celda.textContent = valor;
        fila.appendChild(celda);
      });
      contenedor.appendChild(fila);
    });

    const resumen = document.getElementById('resumen');
    resumen.textContent = (agregadas + eliminadas === 0)
      ? 'Los archivos son idénticos.'
      : `${agregadas} línea(s) agregada(s), ${eliminadas} eliminada(s).`;
  }

  document.getElementById('comparar').addEventListener('click', comparar);*/