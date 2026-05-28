import express from "express";
import multer from "multer";
import { readFile, writeFile } from "fs/promises";
import fs from "fs";
const app = express();
const PORT = 3000;
const upload = multer({ dest: "uploads/" });
app.use(express.static("public"));
let frecuenciasGlobales = {};
if(fs.existsSync('res.json')){
  try {
    const contenido=await readFile('res.json','utf8');
     frecuenciasGlobales = JSON.parse(contenido);
  } catch (e) {
    console.log(e)
  }
}
app.get("/frecuencias", (req, res) => {
  res.json({
    frecuenciasGlobales,
  });
});
//parte dos de la practica
//procesar los archivos
app.post("/procesar", upload.array("logfiles"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: "No se recibieron archivos",
      });
    }

  //se agrega un array vacio para luego agregar los valores de los archivos
    const resultadosPorArchivo = [];
//se busca cada archivo de forma independiente 
    for (const archivo of req.files) {
//se lee el archivo en la ruta establecida 
      const lineas = await leerArchivo(archivo.path);
      const frecuenciasArchivo = {};

      for (const linea of lineas) {
        const codigo = extraerCodigo(linea);

        if (codigo) {
          //ve cuantas veces aparece un error y lo suma
          frecuenciasArchivo[codigo] = (frecuenciasArchivo[codigo] || 0) + 1;
          //incrementa la frecuencia global
          frecuenciasGlobales[codigo] = (frecuenciasGlobales[codigo] || 0) + 1;
        }
      }
   
      resultadosPorArchivo.push({
        archivo: archivo.originalname,
        totalLineas: lineas.length,
        totalCodigosDistintos: Object.keys(frecuenciasArchivo).length,
        frecuencias: frecuenciasArchivo,
      });
    }
await fs.promises.unlink(archivo.path).catch(() => {});
    //punto 3 de la practica  en la funcion guardar despaldo
    
     await guardarRespaldo();
    res.json({
      totalArchivos: req.files.length,
      resultadosPorArchivo,
      frecuenciasGlobales,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "No se pudieron procesar los archivos",
      detalle: error.message,
    });
  }
});
app.use((req, res) => {
  res.status(404).send("No se encontró la página");
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
//me separa cada linea de error por separado por la ruta del archivo
async function leerArchivo(ruta) {
  const contenido = await readFile(ruta, "utf8");
  return contenido.split(/\r?\n/);
}

function extraerCodigo(linea) {
  const match = linea.toUpperCase().match(/\b[A-Z]{2,}(?:_[A-Z0-9]+)+\b/);
  if (match) {
    return match[0];
  } else {
    return null;
  }
}
//parte 3 de la practica
//se guarda los datos 
async function guardarRespaldo() {
  //conviero el objeto en un texto json en el archivo res.json
  
  await writeFile('res.json', JSON.stringify(frecuenciasGlobales, null, 2), "utf8");
}
