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

if (reproductor) reproductor.volume = 0.8;

function cargarCancion() {
    if(tituloObjeto && artistaObjeto && reproductor) {
        tituloObjeto.innerText = canciones[indiceActual].titulo;
        artistaObjeto.innerText = canciones[indiceActual].artista;
        reproductor.src = canciones[indiceActual].src;
    }
}

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

// Conexión de botones Next y Prev
if(btnNext) btnNext.addEventListener('click', nextSong);
if(btnPrev) btnPrev.addEventListener('click', prevSong);

// Auto-play siguiente canción
if(reproductor) {
    reproductor.addEventListener('ended', nextSong);
}

// Iniciar al cargar
cargarCancion();
updateClock();
