//Variables globales
const APP_NAME = "Habit Lab";  //es const 
const STORAGE =  "habits-lab:habits"; // se centraliza en una constante para evitar errores al escribir texto varias veces

//Estado principal de la aplicación
//se mantiene en un solo objeto para que sea más facil saber que datos  estas disponibles en la aplicación
const state = {
    habits: loadHabits(), //cargamos los habitos del local storage al iniciar la aplicación en la función loadhabits()
    currentFilter: "all" // Filtro actual para mostrar los habitos, por defecto es "all" (todos los habitos), pero puede ser "pending" (habitos pendientes) o "completed" (habitos completados)

};
// Referencia al DOM
// se agrupan las referencias todos los elementos en un objeto llamado elements 

const elements = {
    form: document.querySelector("#habitForm"),
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
let habits = loadHabits();


//funciones
//Carga los habitos del localStorage
//se usa un try/catch para evitar que la app falle si el almacenamiento tiene datos invalidos


//carga los datos del local storage
function loadHabits(){
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

    //Crear  un nuevo hábito 
    addHabit(habitName, habitEnergy);

    //Limitar el formulario después de agregar el hábito
    elements.form.reset(); // reseteamos el formulario para limpiar los campos después de agregar un hábito
    elements.habitName.focus(); // ponemos el foco en el campo de nombre para facilitar la entrada de datos
    hideMessage(); // ocultamos cualquier mensaje de error que pueda haber quedado después de agregar un hábito

}

//cambia el estado de un hábito
//nos devolvera (retornara) el objeto hábiro cuando se cambie su estado paa poder mostrarse
function toggleHabit(id) { //toogle en español seria: cabirarEstadoHabito
    state.habits = state.habits.map((habit) => {
        if (habit.id === id) {
            return   habit;       
        }
        return {
            ...habit,//se devuelve el habito pero con el estado actualizado
            done: !habit.done  // cambiamos el estado de "done"  a su valor contrario (si es true, lo cambia a false, y si es false, lo cambia a true
            
        };
    });
    saveHabits(); // guardamos los habitos actualizados en el local storage
    render(); // renderizamos los habitos actualizados en el DOM

}

//Elimina un habito de la lista
function deleteHabit(id) {
    state.habits = state.habits.filter((habit)=> habit.id !== id); // filtramos los habitos para eliminar el habito con el id especificado
    //proporcionando y devolvemos un nuevo array sin ese hábito
    saveHabits();
    render();
}


//obtiene habitos filtrados según el estado del filtro actual
function getFilteredHabits(){
    if ( state.currentFilter === "pending") {
        return state.habits.filter(habit => !habit.done); // si el filtro es "pending", retornamos solo los habitos que no están completados
        //que no estan completados (done: false)
    }
    if (state.currentFilter === "done") {
    return state.habits.filter(habit => habit.done); // si el filtro es "done", retornamos solo los habitos que están completados
    //que estan completados (done: true)
    }
    return state.habits; // si el filtro es "all", retornamos todos los habitos

}

function handleFilterClick(event) {
    const selectedFilter = event.target.dataset.filter; // obtenemos el valor del filtro seleccionado del atributo data-filter del botón
    state.currentFilter = selectedFilter;
    render(); // renderizamos los habitos filtrados en el DOM
}

//Maneja acciones sobre cada hábito (completar o ekiminar)
//usa data-action y data-id para saber que acción se quiere realizar y sobre que hábito
function handleHabitAction(event) {
    const button = event.target.closset("[data-action]"); // buscamos el botón más cercano al elemento clickeado que tenga el atributo data-action
    if (!button) return; // si no se encuentra un botón con data-action, salimos de la función
    const action = button.dataset.action; // obtenemos el valor de la acción del atributo data-action
    const habitId = button.dataset.id; // obtenemos el id del hábito del atributo data-id
    if (action === "toggle") {
        toggleHabit(habitId); // si la acción es "toggle", llamamos a la función toggleHabit para cambiar el estado del hábito
    } else if (action === "delete") {
        deleteHabit(habitId); // si la acción es "delete", llamamos a la función deleteHabit para eliminar el hábito
    }
}


