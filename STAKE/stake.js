document.addEventListener('DOMContentLoaded', () => {
    let playState = Array(5).fill().map(() => Array(5).fill(' '));
    let score = 1;
    const multiplier = 1.5;
    let values = 0;
    let totalGains = 0; 
    let betAmount = 0; // Declare betAmount here to use in showScoreOverlay
    let withdrawButtonAdded = false; 
    let currencyValue = 100; // Initialize currencyValue directly

    function render() {
        // Reset playState and totalGains
        playState = Array(5).fill().map(() => Array(5).fill(' '));
        totalGains = 0;
        values = 0;

        let bodyHTML = `<div class="navbar">
            <img class="stake" src="stake.svg">
            <div class="money">
                <select class="currency">
                    <option>₹${currencyValue.toFixed(2)}</option> <!-- Show currency value -->
                </select>
                <button class="wallet">Wallet</button>
            </div>
            <div class="profile">
                <div class="search">
                    <img class="images" src="searchImg.svg">
                    <p class="s">Search</p>
                </div>
                <img class="images" src="personImg.svg">
                <img class="images" src="notificationImg.svg">
                <img class="images" src="bookmarkImg.svg">
            </div>
        </div>
        <div class="box-container">
            <div class="leftBar">
                <div class="topheading">
                    <div class="manualDiv">
                        <button class="manual">Manual</button>
                        <button class="auto">Auto</button>
                    </div>
                </div>
                <div class="betting">
                    <p class="bet">Bet amount</p>
                    <input class="inputBox" type="number" placeholder="0.00" />
                    <p class="bet">Mines</p>
                    <select class="mines">
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5" selected>5</option>
                    </select>
                    <button class="placeBet">Bet</button>
                </div>
            </div>
            <div class="container">`;

        // Add boxes to the bodyHTML
        for (let i = 0; i < playState.length; i++) {
            let rowHTML = '';
            for (let j = 0; j < playState[i].length; j++) {
                rowHTML += `<div class='box js-tile-${i}-${j}' data-js-tile='${i}-${j}'></div>`;
            }
            bodyHTML += rowHTML;
        }
        
        bodyHTML += `</div></div>`;
        document.querySelector('body').innerHTML = bodyHTML;

        // Get the mine count after the HTML has been added to the document
        const mineCount = parseInt(document.querySelector('.mines').value);
        let placedMines = 0;

        // Randomly place mines
        while (placedMines < mineCount) {
            const randomRow = Math.floor(Math.random() * 5);
            const randomCol = Math.floor(Math.random() * 5);
            if (playState[randomRow][randomCol] === ' ') {
                playState[randomRow][randomCol] = 'M'; // Place mine
                placedMines++;
            }
        }

    betBtn = document.querySelector('.placeBet')
    withdrawButtonAdded = false;
    betBtn.addEventListener('click',()=>{
        const inputBox = document.querySelector('.inputBox');
        betAmount = parseFloat(inputBox.value);
        lostAmt = parseFloat(inputBox.value); // Use to show lost money in showScoreOverlayLost(score) function
        if (isNaN(betAmount) || betAmount <= 0) {
            alert("Please enter a valid bet amount.");
            return;
        }
        if (betAmount > currencyValue) {
            alert("Exceeding your limit....");
            return;
        }

        currencyValue -= betAmount;
        document.querySelector('.currency option').innerText = `₹${currencyValue.toFixed(2)}`;

        // Set up box click listeners
        document.querySelectorAll('.box').forEach(box => {
            box.addEventListener("click", () => {
                const boxPos = box.dataset.jsTile;
                const row = Number(boxPos.charAt(0));
                const column = Number(boxPos.charAt(2));
                    
                    if (playState[row][column] === 'M') {
                        box.innerHTML = `<img class='image mine' src='M.svg'>`;
                        betAmount = 0;
                        showScoreOverlayLost(score);
                        score = 1;
                        withdrawButtonAdded = false; // Reset withdraw button flag
                        alert("Game Over! You lost.");
                        setTimeout(render, 2000);
                    } else {
                        box.innerHTML = `<img class='image gain' src='G.svg'>`;
                        values++;
                        score *= multiplier;
                        betAmount *= multiplier;
                        inputBox.value = betAmount.toFixed(2);
                         // Add withdraw button only once
                    if (!withdrawButtonAdded) {
                        const withdrawButton = document.createElement('button');
                        withdrawButton.className = 'withdraw placeBet';
                        withdrawButton.innerText = 'Withdraw';
                        withdrawButton.addEventListener('click', () => {
                            currencyValue += betAmount; // Add betAmount to currencyValue as profit
                            document.querySelector('.currency option').innerText = `₹${currencyValue.toFixed(2)}`; // Update display
                            showScoreOverlay(score);
                            setTimeout(() => {
                                render(); // Reset game
                            }, 1000);
                        });
                        document.querySelector('.betting').appendChild(withdrawButton);
                        withdrawButtonAdded = true; 
                    }
                    }
            });
        });
    })
    }

    function showScoreOverlay(finalScore) {
        const scoreOverlay = document.querySelector('.score-overlay') || document.createElement('div');
        scoreOverlay.className = 'score-overlay';
        scoreOverlay.innerText = `🏆 Congratulations! ₹${betAmount} added to your balance!`;
        scoreOverlay.style.display = 'block'; 
        document.body.appendChild(scoreOverlay);

        setTimeout(() => {
            scoreOverlay.style.display = 'none'; 
        }, 3000);
    }

    function showScoreOverlayLost(finalScore) {
        const scoreOverlay = document.querySelector('.score-overlay') || document.createElement('div');
        scoreOverlay.className = 'score-overlay';
        scoreOverlay.innerText = `Unfortunately 💔, ₹${lostAmt} lost this time.`
        scoreOverlay.style.display = 'block'; 
        document.body.appendChild(scoreOverlay);

        setTimeout(() => {
            scoreOverlay.style.display = 'none'; 
        }, 3000);
    }

    render();
});
