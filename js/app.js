//Variables globales
const APP_NAME = "Habit Lab";  //es const 
const STORAGE =  "habits"; // se centraliza en una constante para evitar errores al escribir texto varias veces

//Estado principal de la aplicación
//se mantiene en un solo objeto para que sea más facil saber que datos  estas disponibles en la aplicación
const state = {
    habits: loadhabits(), //cargamos los habitos del local storage al iniciar la aplicación en la función loadhabits()
    currentFilter: "all" // Filtro actual para mostrar los habitos, por defecto es "all" (todos los habitos), pero puede ser "pending" (habitos pendientes) o "completed" (habitos completados)

};
// Referencia al DOM
// se agrupan las referencias todos los elementos en un objeto llamado elements 

const elements = {
    form: document.querySelector("habitForm"),
    habitName: document.querySelector("#habitName"),
    habitEnergy: document.querySelector("#habitEnergy"),
    formMessage: document.querySelector("#formMessage"),
    habitsList: document.querySelector("#habitList"),
    filterButtons: document.querySelectorAll(".filter-btn"),
    totalCount: document.querySelector("#totalCount"),
    pendingCount: document.querySelector("#pendingCount"),
    completedCount: document.querySelector("#completedCount")
}


//Incializar la aplicación
//Separar la iniciacialización para que sea más facil de entender y para que el codigo sea más organizado
function init() {
    bindEvents(); // se llama a la función bindEvents para agregar los eventos a los elementos del DOM
    render(); // se llama a la función render para mostrar los habitos en el DOM
    console.log(`Bienvenido a ${APP_NAME}`); // se muestra un mensaje de bienvenida en la consola
}

//Registra los eventos de la aplicación
//Esto evitara tener eventos mezclados con la lógica de la aplicación y hará que el código sea más organizado
function bindEvents() {
    elements.form.addEventListener("submit", handleFormSubmit); // se agrega un evento de submit al formulario para manejar la creación de nuevos habitos
    elements.filterButtons.forEach(button => {
        button.addEventListener("Click", handleFilterClick); // se agrega un evento de click a cada botón de filtro para manejar el cambio de filtro
    })

    //Delegación de eventos :
    //En lugar de usar un evento onclick 
    elements.habitsList.addEventListener("click", handleFilterClick);

}


//Datos (arreglo de obejtos o el luegr donde se guardaran los habitos
let habits = load();


//funciones
//Carga los habitos del localStorage
//se usa un try/catch para evitar que la app falle si el almacenamiento tiene datos invalidos


//carga los datos del local storage
function load(){
   try {
     const storeHabits = localStorage.getItem(STORAGE); // obtenemos los datos del local storage
     if (!storeHabits) {
        return []; // si no hay datos en el local storage, retornamos un arreglo vacio
     }
     return JSON.parse(storeHabits); // si hay datos en el local storage, los parseamos y los retornamos
   }
    catch (error) {
        console.error("Error al cargar los hábitos:", error);
        return [];
    }
}


//guarda los hábitos actuales en el local storage
// Esta función centraliza el guardado para no estar repitiendo lógica
function saveHabits() {
    localStorage.setItem(STORAGE, JSON.stringify(state.habits)); // guardamos los habitos en el local storage

}

//Función para manejar el envio del formulario
function handleFormSubmit(event) {
    event.preventDefault(); // evitamos que el formulario se envie y recargue la página
    const habitName = elements.habitName.value.trim(); // obtenemos el valor del campo de texto y lo limpiamos de espacios
    const habitEnergy = elements.habitEnergy.value;  // obtenemos el valor del campo de energía y lo convertimos a un número entero
    // Validación de los datos del formulario
    //Evita que se agreguen habitos sin nombre (evita habitos fantasma)
    if (!habitName) {
        showMessage("Ingresa un nombre del hábito antes de agregarlo.");
        return;
    }

}

//Crear  un nuevo hábito 
addHabit(habitsName, habitEnergy);

//Limitar el formulario después de agregar el hábito
