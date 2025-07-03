/**
 * Sistema de Playlist com localStorage
 * 
 * Funcionalidades:
 * - Adicionar músicas
 * - Remover músicas
 * - Tocar, pausar e navegar entre faixas
 * - Persistência no localStorage
 */

// Elementos do DOM
const trackList = document.getElementById("track-list");
const playBtn = document.getElementById("play-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const volumeSlider = document.getElementById("volume-slider");
const addBtn = document.getElementById("add-btn");
const trackTitle = document.getElementById("track-title");
const trackArtist = document.getElementById("track-artist");
const trackUrl = document.getElementById("track-url");

// Objeto de áudio
const audio = new Audio();

// Estado da playlist
let currentTrackIndex = 0;
let isPlaying = false;

// Chave para armazenamento no localStorage
const STORAGE_KEY = "userPlaylist";

// Carrega a playlist do localStorage ou inicia vazia
let playlist = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

/**
 * Atualiza a lista de músicas no DOM
 */
function renderPlaylist() {
    trackList.innerHTML = "";
    playlist.forEach((track, index) => {
        const li = document.createElement("li");
        if (index === currentTrackIndex && isPlaying) {
            li.classList.add("playing");
        }
        li.innerHTML = `
            <span>${track.title} - ${track.artist}</span>
            <button class="delete-btn" data-index="${index}">Remover</button>
        `;
        trackList.appendChild(li);
    });

    // Adiciona eventos de clique para remover músicas
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            removeTrack(index);
        });
    });
}

/**
 * Adiciona uma nova música à playlist
 */
function addTrack() {
    if (!trackTitle.value || !trackArtist.value || !trackUrl.value) {
        alert("Preencha todos os campos!");
        return;
    }

    const newTrack = {
        title: trackTitle.value,
        artist: trackArtist.value,
        url: trackUrl.value
    };

    playlist.push(newTrack);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playlist));
    renderPlaylist();

    // Limpa os campos
    trackTitle.value = "";
    trackArtist.value = "";
    trackUrl.value = "";
}

/**
 * Remove uma música da playlist
 * @param {number} index - Índice da música a ser removida
 */
function removeTrack(index) {
    playlist.splice(index, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playlist));
    if (currentTrackIndex >= playlist.length) currentTrackIndex = 0;
    renderPlaylist();
    if (isPlaying) playTrack();
}

/**
 * Toca a música atual
 */
function playTrack() {
    if (playlist.length === 0) return;

    const track = playlist[currentTrackIndex];
    audio.src = track.url;
    audio.play();
    isPlaying = true;
    playBtn.textContent = "⏸ Pause";
    renderPlaylist();
}

/**
 * Pausa a música atual
 */
function pauseTrack() {
    audio.pause();
    isPlaying = false;
    playBtn.textContent = "⏯ Play";
    renderPlaylist();
}

/**
 * Avança para a próxima música
 */
function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    if (isPlaying) playTrack();
    else renderPlaylist();
}

/**
 * Volta para a música anterior
 */
function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    if (isPlaying) playTrack();
    else renderPlaylist();
}

// Event Listeners

// Ao clicar no botão "Adicionar", chama a função para adicionar uma nova música à playlist.
addBtn.addEventListener("click", addTrack);

// Ao clicar no botão "Play/Pause", alterna entre tocar e pausar a música atual.
playBtn.addEventListener("click", () => {
    if (isPlaying) pauseTrack();
    else playTrack();
});

// Ao clicar no botão "Próxima", avança para a próxima música da playlist.
nextBtn.addEventListener("click", nextTrack);

// Ao clicar no botão "Anterior", volta para a música anterior da playlist.
prevBtn.addEventListener("click", prevTrack);

// Ao mover o controle de volume, ajusta o volume do áudio.
volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
});

// Inicializa a playlist
renderPlaylist();