let frecuenciasGlobales={}
async function frecuenciaFuncion() {
  try {
   const res= await fetch("/frecuencias");
   const datos=await res.json();
   frecuenciasGlobales=datos.frecuenciasGlobales||{};

  } catch (error) {
    console.error("No se pudieron cargar las frecuencias iniciales", error);
  }
  
}
const initApp =async () => {
  const droparea = document.querySelector(".droparea");
  if (!droparea) return;

  const active = () => droparea.classList.add("green-border");
  const inactivo = () => droparea.classList.remove("green-border");
  const prevents = (e) => e.preventDefault();

  ["dragenter", "dragover", "dragleave", "drop"].forEach((evento) => {
    droparea.addEventListener(evento, prevents);
  });

  ["dragenter", "dragover"].forEach((evento) => {
    droparea.addEventListener(evento, active);
  });

  ["dragleave", "drop"].forEach((evento) => {
    droparea.addEventListener(evento, inactivo);
  });
  droparea.addEventListener("drop", handleDrop);
  const btnFrecuencia = document.getElementById("btnFrecuencia");
  const btnBuscarCodigo = document.getElementById("btnBuscarCodigo");

  if (btnFrecuencia) {
    btnFrecuencia.addEventListener("click", mostrarBuscador);
  }

  if (btnBuscarCodigo) {
    btnBuscarCodigo.addEventListener("click", consultarFrecuencia);
  }
await frecuenciaFuncion();

};
function mostrarBuscador() {
  const busquedaBox = document.querySelector(".busquedaBox");
  busquedaBox.classList.remove("hidden");
}


function consultarFrecuencia(){
  const input=document.getElementById('inputCodigo');
   const resultado=document.getElementById('resultadoBusqueda');
   
  if (!input || !resultado) {
    return;
  }

   const codigo=input.value.trim().toUpperCase();

   if(!codigo){
    resultado.textContent="escribe un codigo";
    return;
   }
   const frecuencia=frecuenciasGlobales[codigo]
    if(frecuencia!== undefined){
      resultado.textContent= `el codigo que ingresaste ${codigo} aparece un total de ${frecuencia}`;
    }else{
        resultado.textContent= `el codigo que ingresaste ${codigo}  no fue encontrado`
    }
   
  
}
document.addEventListener("DOMContentLoaded", initApp);

const handleDrop = async (e) => {
  const archivos = [...e.dataTransfer.files];
  if (!archivos.length) {
    return;
  }
  const loader = document.querySelector(".loader");
  const menu = document.querySelector(".menu");
  const salida = document.getElementById("salida");
  const droparea = document.querySelector(".droparea");
  const formData = new FormData();

  for (const archivo of archivos) {
    formData.append("logfiles", archivo);
  }
  loader.classList.remove("hidden");

  menu.classList.add("hidden");

  try{
  const res = await fetch("/procesar", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
frecuenciasGlobales = data.frecuenciasGlobales  || {};

   loader.classList.add("hidden");
    menu.classList.remove("hidden");
   //   droparea.classList.add("hidden")
      
  }catch(e){
    loader.classList.add("hidden");
    console.error(e);
    alert("Hubo un error al procesar el archivo");
  }

};
