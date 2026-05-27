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
const btnTop = document.getElementById("btnTop");
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
  if (btnTop) {
  btnTop.addEventListener("click", mostrarTop5);
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
function  mostrarTop5(){
    const top5Box = document.getElementById("top5Box");
  const top5List = document.getElementById("top5List");
  const entradas= Object.entries(frecuenciasGlobales);
  entradas.sort((a,b)=>{
    const valor1=a[1];
    const valor2=b[1]
    return valor2-valor1;
  })
  const primeros = entradas.slice(0, 5);
 top5List.innerHTML = "";
if(primeros.length===0){
  top5Box.innerHTML="<li>No se cargo incidentes</li>"
  top5Box.classList.remove("hidden")
  return;
}
for(let i=0; i<primeros.length;i++){
  const item=primeros[i];
  const cantidad=item[1];
  const codigo=item[0]
  const li=document.createElement("li")
  li.textContent=`${codigo}:  ${cantidad}`
  top5List.appendChild(li)
}
top5Box.classList.remove("hidden")
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
mostrarTop5();
   loader.classList.add("hidden");
    menu.classList.remove("hidden");
   //   droparea.classList.add("hidden")
      
  }catch(e){
    loader.classList.add("hidden");
    console.error(e);
    alert("Hubo un error al procesar el archivo");
  }

};
