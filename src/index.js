import "./styles/index.css";
import { Buffer } from 'buffer';

// Constants for Rune calculation
const runesPerBlock = 5;

// Fetches and processes miner metadata
async function fetchAndDecodeMetadata() {
  const response = await fetch("https://ordinals.com/r/metadata/b14b6f3e0478f6e3754879a54c2a49e9fc3ad7c246baac3b2e0b5ed35f31d217i0");
  const jsonData = await response.json();
  const metadataBuffer = Buffer.from(jsonData, 'hex');
  const arrayBuffer = metadataBuffer.buffer.slice(metadataBuffer.byteOffset, metadataBuffer.byteOffset + metadataBuffer.length);
  return CBOR.decode(arrayBuffer);
}

// Calculates total Runes based on block heights and multiplier
function calculateRunes(currentBlockHeight, inscriptionBlockHeight, boostMultiplier) {
  const blockChange = currentBlockHeight - inscriptionBlockHeight;
  const baseRunes = blockChange * runesPerBlock;
  return baseRunes * boostMultiplier;
}

// Fetches the current blockchain height
async function getCurrentBlockHeight() {
  const response = await fetch("https://ordinals.com/r/blockheight");
  return await response.text();
}

// Function to update runes display
async function updateRunesDisplay() {
  try {
    const minerMetaData = await fetchAndDecodeMetadata();
    const currentBlockHeight = await getCurrentBlockHeight();
    const inscriptionBlockHeight = 833627; // Placeholder
    const miningMultiplier = minerMetaData.miningMultiplier;

    const totalRunes = calculateRunes(currentBlockHeight, inscriptionBlockHeight, miningMultiplier);
    document.getElementById('totalRunesDisplay').innerText = totalRunes.toLocaleString();
    document.getElementById('dialogMultiplierDisplay').innerText = miningMultiplier + 'x';
    document.getElementById('counterMultiplierDisplay').innerText = miningMultiplier + 'x';
  } catch (error) {
    console.error('Error updating runes:', error);
  }
}


// Sets up UI elements and event listeners for the miner
function setupUI() {
  const burgerMenu = document.getElementById('burgerMenu');
  const imageDialog = document.getElementById('imageDialog');
  const runeCounter = document.getElementById('runeCounter');
  const closeButton = document.querySelector('.close-button');

  burgerMenu.addEventListener('click', () => {
    burgerMenu.style.display = 'none';
    closeButton.style.display = 'flex';
    imageDialog.style.display = imageDialog.style.display === 'none' ? 'block' : 'none';
    runeCounter.style.display = runeCounter.style.display === 'none' ? 'block' : 'none';
  });

  closeButton.addEventListener('click', () => {
    closeButton.style.display = 'none';
    burgerMenu.style.display = 'flex';
    imageDialog.style.display = imageDialog.style.display === 'none' ? 'block' : 'none';
    runeCounter.style.display = runeCounter.style.display === 'none' ? 'block' : 'none';
  });
}

// Fetches and processes miner metadata
const req = async () => {
  try {
    await updateRunesDisplay();
  } catch (error) {
    console.error('Error during metadata fetch or processing:', error);
  }
};

// Initial setup
document.addEventListener("DOMContentLoaded", () => {
  setupUI();
  req();

  // Update the runes display every 10 minutes
  setInterval(updateRunesDisplay, 600000);
});
