import "./styles/index.css";
import { Buffer } from 'buffer';

// MOCKING MINER METADATA RESPONSE
const minerMetadataJSON = {
  "burialId": "f2c25b1e7a0f3ab4cbbef3f1e48490d0c206fa63b762c725d9126eda5a04a131i0",
  "boneyId": "9d9309a92a1657ab4822a9e460a73a048fb19ccdb9227d8893312bbc957174b5i0",
  "multiplier" :"7.4"
}
const coded = CBOR.encode(minerMetadataJSON);
// Function to convert a Uint8Array into a hexadecimal string
function uint8ArrayToHex(uint8a) {
  return Array.from(uint8a).map(b => b.toString(16).padStart(2, '0')).join('');
}

const uint8Array = new Uint8Array(coded);
const mockMetadataResponse = uint8ArrayToHex(uint8Array);
// MOCKING MINER METADATA RESPONSE

function draw(t,e){let n=t.getContext("2d"),o=[];var a=0;e.forEach(t=>{let l=new Image;l.src=t,l.onload=()=>{(a+=1)===e.length&&function t(){for(let e=0;e<o.length;e++)n.drawImage(o[e],0,0)}()},o.push(l)})}

const toggleButton = document.getElementById('toggleButton');
const imageDialog = document.getElementById('imageDialog');

toggleButton.addEventListener('click', () => {
    imageDialog.style.display = imageDialog.style.display === 'none' ? 'block' : 'none';
});

// Implement your drawing logic here or remove if not needed
draw(document.getElementById('imageCanvas'), ["img/miner.gif"]);

// const h1 = document.createElement("h1");
// h1.innerText = "Hello, I am some JavaScript in action!";
// document.body.insertAdjacentElement("afterbegin", h1);

const req = async () => {
  // Self fetch miner metadata
  // const res = await fetch(
  //   "https://ordinals.com/r/metadata/3b0d02048e81b3086fe729b1c32e3b44e28e19dc69bba42f0632b866c5bd6ae0i0"
  // );
  // const buffer = Buffer.from(await res.json(), 'hex');

  const buffer = Buffer.from(mockMetadataResponse, 'hex');
  const arrayBuffer = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.length);
  const decoded = CBOR.decode(arrayBuffer);

  // const body = JSON.stringify(decoded, null, 2)
  // const codeBlock = document.createElement("code");
  // codeBlock.innerText = body;
  // document.body.insertAdjacentElement("beforeend", codeBlock);
};
window.addEventListener("DOMContentLoaded", req);



// need the miner to call out to block height and its own inscription information and metadata