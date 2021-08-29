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
  const bodyMessage = document.getElementById('bodyMessage');
  const buttonMessage = document.getElementById('buttonMessage');
  headerMessage.textContent = 'Result';
  bodyMessage.textContent = `SCORE: ${score}`;
  buttonMessage.textContent = 'REPLAY';

  modalButton.onclick = () => {
    closeModal();
    // ゲームをリプレイ出来るような処理
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
