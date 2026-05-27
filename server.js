import express from "express";
import multer from "multer";
import { readFile,writeFile } from "fs/promises";
import fs from "fs";
const app = express();
const PORT = 3000;
const upload = multer({ dest: "uploads/" });
app.use(express.static("public"));
let frecuenciasGlobales={}
app.get("/frecuencias", (req, res) => {
  res.json({
    frecuenciasGlobales
  });
});
app.post("/procesar", upload.array("logfiles"), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: "No se recibieron archivos"
      });
    }

console.log("Antes de procesar:", frecuenciasGlobales);
    const resultadosPorArchivo = [];

    for (const archivo of req.files) {
       console.log("Procesando archivo:", archivo.originalname);
      const lineas = await leerArchivo(archivo.path);
      const frecuenciasArchivo = {};

      for (const linea of lineas) {
        const codigo = extraerCodigo(linea);

        if (codigo) {
          frecuenciasArchivo[codigo] = (frecuenciasArchivo[codigo] || 0) + 1;
          frecuenciasGlobales[codigo] = (frecuenciasGlobales[codigo] || 0) + 1;
        }
      }
 console.log("Frecuencias de este archivo:", frecuenciasArchivo);
      resultadosPorArchivo.push({
        archivo: archivo.originalname,
        totalLineas: lineas.length,
        totalCodigosDistintos: Object.keys(frecuenciasArchivo).length,
        frecuencias: frecuenciasArchivo
      });
    }
  console.log("Despues de procesar:", frecuenciasGlobales);
    res.json({
      totalArchivos: req.files.length,
      resultadosPorArchivo,
      frecuenciasGlobales
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "No se pudieron procesar los archivos",
      detalle: error.message
    });
  }
});
app.use((req,res)=>{
   res.status(404).send("No se encontró la página");
})

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
async function leerArchivo(ruta) {
  const contenido = await readFile(ruta, "utf8");
  return contenido.split(/\r?\n/);
}
function extraerCodigo(linea) {
  const match = linea.toUpperCase().match(/\b[A-Z]{2,}(?:_[A-Z0-9]+)+\b/);
  if(match){
    return match[0];
  }else{
    return null;
  }
}
