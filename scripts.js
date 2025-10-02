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


function deleteLetter() {
  if (currentTile <= 0) {
    logDebug("No letters to delete in this row", "error");
    return;
  }

  currentTile--;
  const currentRowElement = rows[currentRow];
  const tiles = currentRowElement.querySelectorAll(".tile");
  const tileToDelete = tiles[currentTile];

  const letterBeingDeleted = tileToDelete.textContent;

  tileToDelete.textContent = "";
  tileToDelete.classList.remove("filled");
  delete tileToDelete.dataset.letter;

  logDebug(
    `Deleted letter "${letterBeingDeleted}" from row ${currentRow}, tile ${currentTile}`,
    "info"
  );

  if (typeof getCurrentWord === "function") {
    logDebug(`Current guess: "${getCurrentWord()}"`, "info");
  }
}


function submitGuess() {
  logDebug("submitGuess() called", "info");

  if (currentTile !== 5) {
    alert("enter 5 letters!");
    logDebug("Row not complete (need 5 letters).", "error");
    return;
  }

  const rowElement = rows[currentRow];
  const tiles = rowElement.querySelectorAll(".tile");

  let guess = "";
  tiles.forEach((tile) => {
    guess += (tile.textContent || "").toUpperCase();
  });

  checkGuess(guess, tiles);

  if (guess === TARGET_WORD) {
    gameOver = true;
    logDebug("Game status: won", "info");
    setTimeout(() => alert("Congratulations! You won!"), 500);
    return;
  }

  // Move to next row
  currentRow += 1;
  currentTile = 0;

  // Lose condition (used all 6 rows)
  if (currentRow >= 6) {
    gameOver = true;
    logDebug("Game status: lost", "info");
    setTimeout(() => alert(`Game over. The word was ${TARGET_WORD}.`), 500);
  } else {
    logDebug(`Continuing to row ${currentRow}.`, "info");
  }
}


function checkGuess(guess, tiles) {
  logDebug(`Starting analysis for "${guess}"`, 'info');

  const target = TARGET_WORD.split('');
  const guessArray = guess.split('');
  const result = ['absent', 'absent', 'absent', 'absent', 'absent'];

  for (let i = 0; i < 5; i++) {
    if (guessArray[i] === target[i]) {
      result[i] = 'correct';
      target[i] = null;     
      guessArray[i] = null;  
    }
  }

  for (let i = 0; i < 5; i++) {
    if (guessArray[i] !== null) {
      const idx = target.indexOf(guessArray[i]);
      if (idx !== -1) {
        result[i] = 'present';
        target[idx] = null;  
        guessArray[i] = null;  
      }
    }
  }

  for (let i = 0; i < 5; i++) {
    const tile = tiles[i];
    tile.classList.remove('correct', 'present', 'absent');
    tile.classList.add(result[i]);
  }

  logDebug(`Result for row ${currentRow}: ${result.join(', ')}`, 'info');
  return result;
}
