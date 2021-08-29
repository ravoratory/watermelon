import { initGame } from "./game.js";

const modal = document.getElementById('modal');
const modalButton = document.getElementById('modalButton');

const openModal = () => {
  modal.style.display = '';
}

const closeModal = () => {
  modal.style.display = 'none';
}

export const openResultModal = (score) => {
  const headerMessage = document.getElementById('headerMessage');
  const bodyImg = document.getElementById('bodyImg');
  const bodyMessage = document.getElementById('bodyMessage');
  const buttonMessage = document.getElementById('buttonMessage');
  headerMessage.textContent = 'Result';
  bodyImg.src = '/assets/img/break.png';
  bodyMessage.textContent = `SCORE: ${Math.trunc(score)}`;
  bodyMessage.style.fontSize = '32px';
  bodyMessage.style.fontWeight = 'bold';
  buttonMessage.textContent = 'REPLAY';

  modalButton.onclick = () => {
    closeModal();
    initGame();
  };
  openModal();
}

const initModal = () => {
  const backgroundImgUrl = 'url(/assets/img/sea.jpg)';
  modalButton.onclick = () => {
    closeModal();
    document.getElementById('board').style.backgroundImage = backgroundImgUrl;
    initGame();
  }
}
initModal();
