var appName = "Habit Lab";
let filtro = "all"; // Esta valor se cambiara a lo largo del programa
const STORAGE =  "habits";

//DOM elements
const form = document.querySelector("#form");
const input = document.getElementById("name"); // const input = document.querySelector("#input");
const energy = document.getElementById("energy");
const list = document.getElementById("lista");

//Botones

const btnALL = document.getElementById("all");
const btnPending = document.getElementById("pending");
const btnCompleted = document.getElementById("completed");

//Datos (arreglo de obejtos o el luegr donde se guardaran los habitos
let habits = load();


//funciones

//carga los datos del local storage
function load(){
    const data = localStorage.getItem(STORAGE); // obtenemos los datos y guardamos los datos en la variable STORAGE
    if(!data){
        return [];
    }

    return JSON.parse(data);

}

//guarda los datos en el local storage
function save(){
    localStorage.setItem(STORAGE, JSON.stringify(habits)); // guardamos los datos en el local storage
}


//guarda habito en arreglo
function addhabit(name, energy){
    const habit = {
        id: Date.now(), //generamos un id unico para cada habito
        name: name, //nombre del habito
        energy: energy, //energia del habito
        done: false //estado del habito, por defecto es false (no hecho)
    };
    habits.push(habit); //agregamos el habito al arreglo de habitos
    save();
    render();
}

//cambia el estado del habito
function toggleHabit(id){
    habits = habits.map(habit => {
            if (habit.id === id){
                habit.done = !habit.done; //cambiamos el estado del habito
            }
            return habit;
        });
    save();
    render();
}

function render() {
    const data = getFiltered();

    list.innerHTML = data.map(habit => {
        return `
            <div class="border p-2 mb-2 flex justify-between">
                <span>
                ${habit.name} - energia: ${habit.energy}  - ${habit.done ? "✅" : "❌"}
                </span>

                <div>
                    <button onclick="toggle(${habit.id})" class="bg-green-500 text-white px-2 py-1">✅</button>
                    <button onclick="remove(${habit.id})" class="bg-red-500 text-white px-2 py-1">❌</button>
                </div>
            </div>
        `;
    }).join("");
}



function deleteHabit(id){
    habits = habits.filter(habit => habit.id !== id);
    save();
    render();
}

function getFiletered(){
    if (filtro === "pending"){
        return habits.filter(habit => !habit.done);
    }
    if (filtro === "completed"){
        return habits.filter(habit => habit.done);
    }
    return habits;
}


//Eventos

//evento para agregar habito
btnAll.addEventListener("click", () => {
    filter = "all"; // cambiamos el filtro a "all"
    render(); // renderizamos la lista de hábitos
});

btnPending.addEventListener("click", () => {
    filter = "pending"; // cambiamos el filtro a "pending"
    render(); // renderizamos la lista de hábitos
});

btnDone.addEventListener("click", () => {
    filter = "done"; // cambiamos el filtro a "done"
    render(); // renderizamos la lista de hábitos
});





//funciones globales para botones de inline
window.toggle = toggleHabit; //hacemos la funcion toggleHabit global para poder usarla en los botones de inline
window.remove = deleteHabit; //hacemos la funcion deleteHabit global para poder usarla en los botones de inline

//INIT (renderizamos los habitos al cargar la pagina)
console.log