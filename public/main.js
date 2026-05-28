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
//parte 1 de la practica
//aqui se arrastra y se envia los archivos al backend
const initApp =async () => {
  const droparea = document.querySelector(".droparea");
  if (!droparea) return;
  const btnTop = document.getElementById("btnTop");
  const btnReporte = document.getElementById("btnReporte");
  const btnCerrarFrecuencia = document.getElementById("btnCerrarFrecuencia");
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
  if (btnReporte) {
  btnReporte.addEventListener("click", mostrarReporte);
  }
  if (btnCerrarFrecuencia) {
  btnCerrarFrecuencia.addEventListener("click",ocultarResultados);
  }
  if (btnTop) {
  btnTop.addEventListener("click", mostrarTop5);
}
await frecuenciaFuncion();

};

function mostrarBuscador() {
  ocultarResultados();
  const busquedaBox = document.getElementById("busquedaBox");
  busquedaBox.classList.remove("hidden");
}

//oculta los demas botones
function ocultarResultados() {
  const busquedaBox = document.getElementById("busquedaBox");
  const top5Box = document.getElementById("top5Box");
  const reporteBox = document.getElementById("reporteBox");
  const inputCodigo = document.getElementById("inputCodigo");
  
  const resultadoBusqueda = document.getElementById("resultadoBusqueda");
  inputCodigo.value = "";
  resultadoBusqueda.textContent = "";
  
  busquedaBox.classList.add("hidden");
  top5Box.classList.add("hidden");
  reporteBox.classList.add("hidden");
}

//parte 5 de la guia 
//seccion consultar frecuencia
function consultarFrecuencia(){
  //se busca los elementos html, los id 
  const input=document.getElementById('inputCodigo');
  const resultado=document.getElementById('resultadoBusqueda');
 
//lo que quiero es que me elimina los espacios al principio y al final del input
//y ademas colocar todo en mayuscula para facilitar la busqueda
   const codigo=input.value.trim().toUpperCase();

   if(!codigo){
    resultado.textContent="escribe un codigo";
    return;
   }
   //En frecuencia lo que hacemos es buscar el valor del codig
   //la forma es usando frecuencias globales que es la variable que tiene todos los codigos de error
   //y pasamos el codigo, si da un valor por ejemplo 2, signiica que existe
   //y si es undefined, sinifica que no
   const frecuencia=frecuenciasGlobales[codigo]
    if(frecuencia!== undefined){
      resultado.textContent= `el codigo que ingresaste ${codigo} aparece un total de ${frecuencia}`;
    }else{
        resultado.textContent= `el codigo que ingresaste ${codigo}  no fue encontrado`
    } 
}

//parte 5 de la guia 
//seccion: logica de mostrar top 5
function  mostrarTop5(){
  ocultarResultados();
  //se buca los id de los elementos a utilizar
  const top5Box = document.getElementById("top5Box");
  const top5List = document.getElementById("top5List");
  //las entradas son los objetos clave-valor 
  //ejemplo, err_404: 2
  //clave es err_404 y valor es 2
  const entradas= Object.entries(frecuenciasGlobales);
  entradas.sort((a,b)=>{
    //lo que quiero es que me lo ordene de arriba para abajo
    const valor1=a[1];
    const valor2=b[1]
    return valor2-valor1;
  })
  //se agarra los primeros 5
  const primeros = entradas.slice(0, 5);
  //por ahora la lista esta en nada
 top5List.innerHTML = "";
 //si no tiene nada entonces da ese mensaje
if(primeros.length===0){
  top5Box.innerHTML="<li>No se cargo incidentes</li>"
  top5Box.classList.remove("hidden")
  return;
}
//si los primeros valores si existen, entonces se hace un for 
//para iterar entre los primeros top 5
for(let i=0; i<primeros.length;i++){
  //item va tener los valores clave error del objeto
  const item=primeros[i];
  //cantidad va tener el valor de clave, osea el numero
  const cantidad=item[1];
//codigo va tener la clave, osea los errores
  const codigo=item[0]
  //se crea un elemento li y se agrega al top5list y se muestran
  const li=document.createElement("li")
  li.textContent=`${codigo}:  ${cantidad}`
  top5List.appendChild(li)
}
top5Box.classList.remove("hidden")
}

// mostrar reporte
function mostrarReporte(){
  ocultarResultados();
  const reporteBox = document.getElementById("reporteBox");
  reporteBox.classList.remove("hidden");
}
document.addEventListener("DOMContentLoaded", initApp);


//parte 1 de la practica
//se procesa los archivos
const handleDrop = async (e) => {
  //se pasa toda la informacion en un solo array
  const archivos = [...e.dataTransfer.files];
  if (!archivos.length) {
    return;
  }
//se llama los elementos html 
  const menu = document.querySelector(".menu");
  const salida = document.getElementById("salida");
  const droparea = document.querySelector(".droparea");
  //se usa formdata para agrevar un campo
  const formData = new FormData();


  for (const archivo of archivos) {
    //se agregas todos lso archivos
    formData.append("logfiles", archivo);
  }


  menu.classList.add("hidden");
//procesa los archivos 
  try{
  const res = await fetch("/procesar", {
    method: "POST",
    body: formData,
  });
  //se espera el resultado 
  const data = await res.json();
  //si existe resultado del back, se actualiza frecuencias, si no no se muestra nada
frecuenciasGlobales = data.frecuenciasGlobales  || {};

  
    menu.classList.remove("hidden");
   //   droparea.classList.add("hidden")
      
  }catch(e){

    console.error(e);
    alert("Hubo un error al procesar el archivo");
  }

};