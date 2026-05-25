# Práctica 1 - Programación 2
### Elaborado por:
Maria Rosceli Dueñas Morocho y Franklyn Enrique Sierra Contreras.  
En los lenguajes y tecnologías web utilizadas:
- HTML
- CSS
- JavaScript
### Práctica:
La práctica consiste en desarrollar un sistema que sea capaz de analizar registros de errores (logs) provenientes de distintos servidores, procesándolos de forma simultánea para identificar la frecuencia con la que ocurren distintos tipos de incidentes. La idea principal es que el sistema pueda manejar varios archivos al mismo tiempo y consolidar toda la información en una sola estructura organizada.  

A medida que se procesan estos datos, el sistema debe contar cuántas veces aparece cada tipo de error y almacenar esa información de manera persistente, es decir, guardarla en un archivo para poder reutilizarla en futuras ejecuciones sin empezar desde cero.  

Además, el sistema debe ser capaz de detectar automáticamente situaciones críticas: cuando un tipo de error supere un cierto límite de ocurrencias, se debe generar una alerta. Estas alertas no solo se muestran en pantalla, sino que también deben registrarse en un archivo, simulando un sistema de monitoreo de seguridad.  

Finalmente, el programa debe ofrecer una forma de consultar la información procesada, permitiendo al usuario revisar cuántas veces ha ocurrido un error específico, ver cuáles son los más frecuentes y generar reportes organizados con todos los datos recopilados.  
