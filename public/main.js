const initApp = () => {
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
};

document.addEventListener("DOMContentLoaded", initApp);
const top=(frecuencia)=>{


}
const handleDrop = async (e) => {
  const archivos = [...e.dataTransfer.files];
  if (!archivos.length) {
    return;
  }
  const loader = document.querySelector(".loader");
  const menu = document.querySelector(".menu");
  const salida = document.querySelector(".salida");
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
   loader.classList.add("hidden");
    menu.classList.remove("hidden");
      droparea.classList.add("hidden")
      
  }catch(e){
    loader.classList.add("hidden");
    console.error(e);
    alert("Hubo un error al procesar el archivo");
  }

};
