const playerOneInput = document.querySelector("#nameOne");
const playerTwoInput = document.querySelector("#nameTwo");
const playBtn = document.querySelector(".play");
let playerOneName;
let playerTwoName;

playBtn.addEventListener("click", () => {
    playerOneName = playerOneInput.value;
    playerTwoName = playerTwoInput.value;
    playerOneInput.value = '';
    playerTwoInput.value = '';

    localStorage.setItem('playerOneName', playerOneName);
    localStorage.setItem('playerTwoName', playerTwoName);
    if (playerOneName != '' && playerTwoName != '') {
        window.location.href = "game.html";
    }
});