import "./styles/index.css";

const runesPerBlock = 5;
const runesHalvingBlockBonus = 495;
const halvingBlock = 840000;
const maxBlock = 890000;

const state = {
  name: "",
  burialId: "",
  boneyId: "",
  miningMultiplier: 0,
  inscriptionHeight: 0,
};

const getElementById = (id) => document.querySelector(`#${id}`);
const setState = (newState) => {
  state.name = newState.name;
  state.burialId = newState.burialId;
  state.boneyId = newState.boneyId;
  state.miningMultiplier = newState.miningMultiplier;
  state.inscriptionHeight = newState.inscriptionHeight;
};

const fetchAndDecodeMetadata = async (inscriptionId) => {
  const response = await fetch(
    `https://ordinals.com/r/metadata/${inscriptionId}`
  );
  const metadata = await response.json();
  const buffer = new Uint8Array(
    metadata.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  ).buffer;
  return CBOR.decode(buffer);
};

const fetchInscriptionInfo = async (inscriptionId) => {
  const response = await fetch(
    `https://ordinals.com/r/inscription/${inscriptionId}`
  );

  return await response.json();
};

const calculateRunes = (currentBlockHeight) => {
  if (currentBlockHeight === state.inscriptionHeight) return "0";
  const blockChange =
    Math.min(currentBlockHeight, maxBlock) - state.inscriptionHeight;

  const baseRunes =
    blockChange * runesPerBlock +
    (currentBlockHeight >= halvingBlock ? runesHalvingBlockBonus : 0);

  return (baseRunes * state.miningMultiplier).toFixed();
};

const getCurrentBlockHeight = async () => {
  const response = await fetch("https://ordinals.com/r/blockheight");
  return await response.json();
};

const updateRunesDisplay = async () => {
  const currentBlockHeight = await getCurrentBlockHeight();
  const totalRunes = calculateRunes(currentBlockHeight);
  getElementById("runeCount").innerText = totalRunes.toLocaleString();
};

const setupUI = () => {
  const toggleButton = getElementById("toggle");
  const metadataDialog = getElementById("metadata");

  getElementById(
    "burial-a"
  ).href = `https://ordinals.com/inscription/${state.burialId}`;
  getElementById(
    "boney-a"
  ).href = `https://ordinals.com/inscription/${state.boneyId}`;
  getElementById(
    "burial"
  ).src = `https://ordinals.com/content/${state.burialId}`;
  getElementById("boney").src = `https://ordinals.com/content/${state.boneyId}`;
  getElementById("multiplier").innerText = `${state.miningMultiplier}x`;
  getElementById("start-height").innerText = `Block ${state.inscriptionHeight}`;
  getElementById("name").innerText = state.name;

  const toggleHideClasses = () => {
    metadataDialog.classList.toggle("slide-up");
  };
  toggleButton.addEventListener("click", toggleHideClasses);
};

document.addEventListener("DOMContentLoaded", async () => {
  const id = window.location.split("/").pop();

  const [metadata, inscriptionInfo] = await Promise.all([
    fetchAndDecodeMetadata(id),
    fetchInscriptionInfo(id),
  ]);

  setState({
    ...metadata,
    inscriptionHeight: inscriptionInfo.height,
  });

  setupUI();
  updateRunesDisplay();
  setInterval(updateRunesDisplay, 600000);
});
