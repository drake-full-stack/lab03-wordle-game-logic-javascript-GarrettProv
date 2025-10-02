// ===== GAME STATE VARIABLES =====
const TARGET_WORD = "WORDS";  // Our secret word for testing
let currentRow = 0;           // Which row we're filling (0-5)
let currentTile = 0;          // Which tile in the row (0-4)
let gameOver = false;         // Is the game finished?

// DOM element references (set up on page load)
let gameBoard, rows, debugOutput;

// ===== HELPER FUNCTIONS (PROVIDED) =====

// Debug/Testing Functions
function logDebug(message, type = 'info') {
    // Log to browser console
    console.log(message);
    
    // Also log to visual testing area
    if (!debugOutput) {
        debugOutput = document.getElementById('debug-output');
    }
    
    if (debugOutput) {
        const entry = document.createElement('div');
        entry.className = `debug-entry ${type}`;
        entry.innerHTML = `
            <span style="color: #666; font-size: 12px;">${new Date().toLocaleTimeString()}</span> - 
            ${message}
        `;
        
        // Add to top of debug output
        debugOutput.insertBefore(entry, debugOutput.firstChild);
        
        // Keep only last 20 entries for performance
        const entries = debugOutput.querySelectorAll('.debug-entry');
        if (entries.length > 20) {
            entries[entries.length - 1].remove();
        }
    }
}

function clearDebug() {
    const debugOutput = document.getElementById('debug-output');
    if (debugOutput) {
        debugOutput.innerHTML = '<p style="text-align: center; color: #999; font-style: italic;">Debug output cleared - ready for new messages...</p>';
    }
}

// Helper function to get current word being typed
function getCurrentWord() {
    const currentRowElement = rows[currentRow];
    const tiles = currentRowElement.querySelectorAll('.tile');
    let word = '';
    tiles.forEach(tile => word += tile.textContent);
    return word;
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    gameBoard = document.querySelector('.game-board');
    rows = document.querySelectorAll('.row');
    debugOutput = document.getElementById('debug-output');
    
    logDebug("🎮 Game initialized successfully!", 'success');
    logDebug(`🎯 Target word: ${TARGET_WORD}`, 'info');
    logDebug("💡 Try typing letters, pressing Backspace, or Enter", 'info');
});

// ===== YOUR CHALLENGE: IMPLEMENT THESE FUNCTIONS =====

document.addEventListener("keydown", (event) => {
  logDebug(`Key pressed: "${event.key}"`, "info");

  if (gameOver) {
    logDebug("Game is over", "error");
    return;
  }

  const key = event.key.toUpperCase();
  if (key === "BACKSPACE") {
    deleteLetter();
    return;
  }
  if (key === "ENTER") {
    submitGuess();
    return;
  }
  if (/^[A-Z]$/.test(key)) {
    addLetter(key);
    return;
  }
});


function addLetter(letter) {
  if (currentTile >= 5) {
    logDebug("❌ Row is already full. Ignoring extra input.", "error");
    return;
  }
  const rowElement = rows[currentRow];
  const tiles = rowElement.querySelectorAll(".tile");
  if (!tiles || tiles.length < 5) {
    return;
  }
  const tile = tiles[currentTile];
  tile.textContent = letter;
  tile.classList.add("filled");

  currentTile += 1;
  if (typeof getCurrentWord === "function") {
    logDebug(`Current guess: "${getCurrentWord()}"`, "info");
  }
}


// TODO: Implement deleteLetter function  
// function deleteLetter() {
//     // Your code here!
// }

// TODO: Implement submitGuess function
// function submitGuess() {
//     // Your code here!
// }

// TODO: Implement checkGuess function (the hardest part!)
// function checkGuess(guess, tiles) {
//     // Your code here!
//     // Remember: handle duplicate letters correctly
//     // Return the result array
// }