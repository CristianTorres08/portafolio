// --- CONFIGURACIÓN DE TEMA (MODO OSCURO) ---
const botonOsc = document.querySelector('.botonOsc');
const body = document.body;

if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light-mode');
  if(botonOsc) botonOsc.textContent = '☀️';
}

if(botonOsc) {
  botonOsc.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    botonOsc.textContent = isLight ? '☀️' : '🌙';
  });
}

// --- RELOJ DIGITAL ---
function updateClock() {
    const clock = document.getElementById('digital-clock');
    if (clock) {
        const now = new Date();
        clock.innerText = now.toLocaleTimeString('es-PE', { hour12: false });
    }
}
setInterval(updateClock, 1000);

// --- INTERSECTION OBSERVER (ANIMACIONES) ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.step').forEach(step => observer.observe(step));

// --- PLAYLIST LOGIC ---
const canciones = [
    { titulo: "Get Lucky", artista: "Daft Punk", src: "./assets/music/Get_Lucky.mp3" },
    { titulo: "Blinding Lights", artista: "The Weeknd", src: "./assets/music/Blinding_lights.mp3" },
    { titulo: "Casablanca", artista: "Jessica Jay", src: "./assets/music/Casablanca.mp3" },
    { titulo: "Passion", artista: "Netzwerk", src: "./assets/music/Passion.mp3" },
    { titulo: "P.I.M.P", artista: "50 CENT", src: "./assets/music/P.I.M.P.mp3" },
    { titulo: "No se", artista: "El Clon", src: "./assets/music/No_se.mp3" }                                        
];

let indiceActual = 0;
const reproductor = document.getElementById('audio-player');
const botonPlay = document.getElementById('play-btn-dash');
const btnNext = document.getElementById('next-btn-dash');
const btnPrev = document.getElementById('prev-btn-dash');
const tituloObjeto = document.getElementById('song-title');
const artistaObjeto = document.getElementById('artist-name');

// --- ELEMENTOS NUEVOS ---
const progressBar = document.getElementById('progress-bar');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeBar = document.getElementById('volume-bar');

if (reproductor) reproductor.volume = 0.8;

// --- CARGAR CANCIÓN ---
function cargarCancion() {
    if(tituloObjeto && artistaObjeto && reproductor) {
        const cancion = canciones[indiceActual];
        tituloObjeto.innerText = cancion.titulo;
        artistaObjeto.innerText = cancion.artista;
        reproductor.src = cancion.src;

        // Resetear barra y tiempos
        if(progressBar) progressBar.value = 0;
        if(currentTimeEl) currentTimeEl.innerText = "00:00";
        if(durationEl) durationEl.innerText = "00:00";
    }
}

// --- FORMATEAR TIEMPO ---
function formatTime(segundos) {
    const min = Math.floor(segundos / 60);
    const sec = Math.floor(segundos % 60);
    return `${min < 10 ? '0'+min : min}:${sec < 10 ? '0'+sec : sec}`;
}

// --- ACTUALIZAR BARRA DE PROGRESO Y TIEMPOS ---
if(reproductor) {
    reproductor.addEventListener('timeupdate', () => {
        if(progressBar && reproductor.duration) {
            const progreso = (reproductor.currentTime / reproductor.duration) * 100;
            progressBar.value = progreso || 0;
        }
        if(currentTimeEl) currentTimeEl.innerText = formatTime(reproductor.currentTime);
        if(durationEl && reproductor.duration) durationEl.innerText = formatTime(reproductor.duration);
    });
}

// --- CONTROL DE PROGRESO MANUAL ---
if(progressBar) {
    progressBar.addEventListener('input', () => {
        if(reproductor.duration) {
            reproductor.currentTime = (progressBar.value / 100) * reproductor.duration;
        }
    });
}

// --- CONTROL DE VOLUMEN ---
if(volumeBar) {
    volumeBar.addEventListener('input', () => {
        reproductor.volume = volumeBar.value;
    });
    // Inicializar valor del slider
    volumeBar.value = reproductor.volume;
}

// --- FUNCIONES DE REPRODUCCIÓN ---
function actualizarBoton(pausa) {
    if(botonPlay) botonPlay.innerText = pausa ? 'play' : 'pause';
}

function nextSong() {
    indiceActual = (indiceActual + 1) % canciones.length;
    cargarCancion();
    reproductor.play();
    actualizarBoton(false);
}

function prevSong() {
    indiceActual = (indiceActual - 1 + canciones.length) % canciones.length;
    cargarCancion();
    reproductor.play();
    actualizarBoton(false);
}

// --- EVENTOS DE LA MÚSICA ---
if(botonPlay) {
    botonPlay.addEventListener('click', () => {
        if (reproductor.paused) {
            reproductor.play();
            actualizarBoton(false);
        } else {
            reproductor.pause();
            actualizarBoton(true);
        }
    });
}

if(btnNext) btnNext.addEventListener('click', nextSong);
if(btnPrev) btnPrev.addEventListener('click', prevSong);

if(reproductor) {
    reproductor.addEventListener('ended', nextSong);
}

// Iniciar al cargar
cargarCancion();
updateClock();