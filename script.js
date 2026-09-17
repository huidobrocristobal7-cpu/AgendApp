// ==============================
// AGENDAPP - FUNCIONAMIENTO
// ==============================

let currentDate = new Date();

let events = JSON.parse(localStorage.getItem("agendapp_events")) || [];

const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");

const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

const addEventBtn = document.getElementById("addEventBtn");
const eventModal = document.getElementById("eventModal");
const closeModal = document.getElementById("closeModal");

const saveEvent = document.getElementById("saveEvent");

const eventTitle = document.getElementById("eventTitle");
const eventDate = document.getElementById("eventDate");
const eventTime = document.getElementById("eventTime");

const eventsList = document.getElementById("eventsList");


// ==============================
// NOMBRES DE LOS MESES
// ==============================

const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
];


// ==============================
// MOSTRAR CALENDARIO
// ==============================

function renderCalendar() {

    calendarDays.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.textContent = `${months[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Convertir domingo = 0 a lunes = 0
    let startDay = firstDay - 1;

    if (startDay < 0) {
        startDay = 6;
    }

    // Espacios antes del primer día
    for (let i = 0; i < startDay; i++) {

        const emptyDay = document.createElement("div");

        calendarDays.appendChild(emptyDay);
    }

    // Crear días
    for (let day = 1; day <= daysInMonth; day++) {

        const dayElement = document.createElement("div");

        dayElement.textContent = day;

        // Comprobar si es hoy
        const today = new Date();

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {

            dayElement.classList.add("today");
        }

        // Al hacer clic en un día
        dayElement.addEventListener("click", () => {

            const selectedDate =
                `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            eventDate.value = selectedDate;

            eventModal.classList.remove("hidden");

            eventTitle.focus();
        });

        calendarDays.appendChild(dayElement);
    }
}


// ==============================
// CAMBIAR MES
// ==============================

prevMonth.addEventListener("click", () => {

    currentDate.setMonth(currentDate.getMonth() - 1);

    renderCalendar();
});


nextMonth.addEventListener("click", () => {

    currentDate.setMonth(currentDate.getMonth() + 1);

    renderCalendar();
});


// ==============================
// ABRIR VENTANA
// ==============================

addEventBtn.addEventListener("click", () => {

    eventModal.classList.remove("hidden");

    eventTitle.focus();
});


// ==============================
// CERRAR VENTANA
// ==============================

closeModal.addEventListener("click", () => {

    eventModal.classList.add("hidden");

    clearForm();
});


// ==============================
// GUARDAR ACTIVIDAD
// ==============================

saveEvent.addEventListener("click", () => {

    const title = eventTitle.value.trim();
    const date = eventDate.value;
    const time = eventTime.value;

    if (!title) {

        alert("Escribe el nombre de la actividad.");

        return;
    }

    if (!date) {

        alert("Selecciona una fecha.");

        return;
    }

    const newEvent = {

        id: Date.now(),

        title: title,

        date: date,

        time: time || "Sin hora"
    };

    events.push(newEvent);

    saveEvents();

    renderEvents();

    eventModal.classList.add("hidden");

    clearForm();
});


// ==============================
// GUARDAR EN EL NAVEGADOR
// ==============================

function saveEvents() {

    localStorage.setItem(
        "agendapp_events",
        JSON.stringify(events)
    );
}


// ==============================
// MOSTRAR ACTIVIDADES
// ==============================

function renderEvents() {

    eventsList.innerHTML = "";

    if (events.length === 0) {

        eventsList.innerHTML =
            `<p class="empty">No tienes actividades todavía.</p>`;

        return;
    }

    // Ordenar por fecha
    const sortedEvents = [...events].sort((a, b) => {

        return (
            new Date(`${a.date}T${a.time === "Sin hora" ? "00:00" : a.time}`) -
            new Date(`${b.date}T${b.time === "Sin hora" ? "00:00" : b.time}`)
        );
    });

    sortedEvents.forEach(event => {

        const eventElement = document.createElement("div");

        eventElement.style.background = "#f8fafc";
        eventElement.style.padding = "15px";
        eventElement.style.borderRadius = "10px";
        eventElement.style.marginBottom = "10px";

        eventElement.innerHTML = `
            <strong>${event.title}</strong>
            <p style="color:#6b7280; margin-top:5px;">
                📅 ${formatDate(event.date)}
                <br>
                ⏰ ${event.time}
            </p>

            <button 
                onclick="deleteEvent(${event.id})"
                style="
                    margin-top:10px;
                    border:none;
                    background:#fee2e2;
                    color:#dc2626;
                    padding:7px 10px;
                    border-radius:7px;
                    cursor:pointer;
                "
            >
                🗑️ Eliminar
            </button>
        `;

        eventsList.appendChild(eventElement);
    });
}


// ==============================
// ELIMINAR ACTIVIDAD
// ==============================

function deleteEvent(id) {

    events = events.filter(event => event.id !== id);

    saveEvents();

    renderEvents();
}


// ==============================
// FORMATEAR FECHA
// ==============================

function formatDate(dateString) {

    const [year, month, day] = dateString.split("-");

    return `${day}/${month}/${year}`;
}


// ==============================
// LIMPIAR FORMULARIO
// ==============================

function clearForm() {

    eventTitle.value = "";

    eventDate.value = "";

    eventTime.value = "";
}


// ==============================
// INICIAR APP
// ==============================

renderCalendar();

renderEvents();