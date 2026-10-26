const uploadBox = document.getElementById('upload-box');
const fileInput = document.getElementById('rom-file');
const selectBtn = document.getElementById('select-btn');
const gameWorkspace = document.getElementById('game-workspace');
const exitBtn = document.getElementById('exit-btn');
const systemSelect = document.getElementById('system-select');
const selectorWrapper = document.getElementById('selector-wrapper');
const controlsList = document.getElementById('controls-list');

// Diccionario de controles según cada consola
const controlsConfig = {
    gba: [
        { key: "Flechas / D-Pad", action: "Moverse" },
        { key: "Z", action: "Botón A" },
        { key: "X", action: "Botón B" },
        { key: "A", action: "Botón L" },
        { key: "S", action: "Botón R" },
        { key: "Enter", action: "START" },
        { key: "Shift", action: "SELECT" }
    ],
    gb: [
        { key: "Flechas / D-Pad", action: "Moverse" },
        { key: "Z", action: "Botón A" },
        { key: "X", action: "Botón B" },
        { key: "Enter", action: "START" },
        { key: "Shift", action: "SELECT" }
    ],
    nes: [
        { key: "Flechas / D-Pad", action: "Moverse" },
        { key: "Z", action: "Botón A" },
        { key: "X", action: "Botón B" },
        { key: "Enter", action: "START" },
        { key: "Shift", action: "SELECT" }
    ],
    snes: [
        { key: "Flechas / D-Pad", action: "Moverse" },
        { key: "Z", action: "Botón A" },
        { key: "X", action: "Botón B" },
        { key: "A", action: "Botón X" },
        { key: "S", action: "Botón Y" },
        { key: "Q", action: "Botón L" },
        { key: "W", action: "Botón R" },
        { key: "Enter", action: "START" },
        { key: "Shift", action: "SELECT" }
    ],
    segaMD: [
        { key: "Flechas / D-Pad", action: "Moverse" },
        { key: "Z", action: "Botón A" },
        { key: "X", action: "Botón B" },
        { key: "C", action: "Botón C" },
        { key: "Enter", action: "START" }
    ],
    n64: [
        { key: "Flechas / D-Pad", action: "Movimiento (C-Buttons: I, J, K, L)" },
        { key: "Z", action: "Botón A" },
        { key: "X", action: "Botón B" },
        { key: "C", action: "Z-Trigger (Gatillo)" },
        { key: "Enter", action: "START" }
    ]
};

// Función para actualizar la lista visualmente cuando cambia el select
function actualizarPanelControles() {
    const system = systemSelect.value;
    const controls = controlsConfig[system] || controlsConfig.gba;
    
    controlsList.innerHTML = "";
    controls.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="key">${item.key}</span> <span>${item.action}</span>`;
        controlsList.appendChild(li);
    });
}

// Escuchar cambios en el selector
systemSelect.addEventListener('change', actualizarPanelControles);

// Ejecutar al cargar la página por primera vez
actualizarPanelControles();

uploadBox.addEventListener('click', () => fileInput.click());
selectBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileInput.click();
});

uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.style.borderColor = 'var(--primary-neon)';
});

uploadBox.addEventListener('dragleave', () => {
    uploadBox.style.borderColor = 'rgba(0, 242, 254, 0.3)';
});

uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        iniciarJuego(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) iniciarJuego(file);
});

function iniciarJuego(file) {
    const gameUrl = URL.createObjectURL(file);
    const selectedSystem = systemSelect.value;

    uploadBox.classList.add('hidden');
    selectorWrapper.classList.add('hidden');
    gameWorkspace.classList.remove('hidden');

    // Configuración de EmulatorJS
    window.EJS_player = '#game';
    window.EJS_gameUrl = gameUrl;
    window.EJS_core = selectedSystem;
    window.EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
    window.EJS_startOnLoaded = true;
    window.EJS_width = 640;
    window.EJS_height = 480;

    const script = document.createElement('script');
    script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
    script.id = 'emulator-script';
    document.body.appendChild(script);
}

exitBtn.addEventListener('click', () => {
    const script = document.getElementById('emulator-script');
    if (script) script.remove();
    
    document.getElementById('game').innerHTML = '';
    gameWorkspace.classList.add('hidden');
    uploadBox.classList.remove('hidden');
    selectorWrapper.classList.remove('hidden');
    fileInput.value = '';
});