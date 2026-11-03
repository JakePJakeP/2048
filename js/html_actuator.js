function HTMLActuator() {
  this.tileContainer    = document.querySelector(".tile-container");
  this.scoreContainer   = document.querySelector(".score-container");
  this.bestContainer    = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");
  this.speech           = document.querySelector(".speech-bubble");
  this.speechText       = document.querySelector(".speech-text");
  this.speechArt        = document.querySelector(".speech-art");

  this.score = 0;
  this.scoreReady = false;
  this.seenMilestones = {};
  this.milestonesReady = false;
  this.freshStart = false;
  this.forceQuip = false;
}

HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    self.clearContainer(self.tileContainer);

    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);
    self.syncMilestones(self.maxValue(grid), metadata);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }

  });
};

HTMLActuator.prototype.maxValue = function (grid) {
  var max = 0;
  grid.cells.forEach(function (column) {
    column.forEach(function (cell) {
      if (cell && cell.value > max) max = cell.value;
    });
  });
  return max;
};

HTMLActuator.prototype.syncMilestones = function (max, metadata) {
  var self = this;

  if (!this.milestonesReady) {
    this.milestonesReady = true;

    if (this.freshStart || (metadata.score === 0 && max <= 4)) {
      this.freshStart = false;
      this.seenMilestones = {};
      this.showQuip(PeanutsTheme.quips.start);
      return;
    }

    PeanutsTheme.milestones.forEach(function (milestone) {
      self.seenMilestones[milestone] = max >= milestone;
    });

    if (metadata.over) {
      this.showQuip(PeanutsTheme.quips.lose);
    } else if (metadata.won) {
      this.showQuip(PeanutsTheme.quips[2048]);
    } else {
      this.showQuip(PeanutsTheme.quips.welcome);
    }
    return;
  }

  PeanutsTheme.milestones.forEach(function (milestone) {
    if (max >= milestone && !self.seenMilestones[milestone]) {
      self.seenMilestones[milestone] = true;
      self.showQuip(PeanutsTheme.quips[milestone]);
    }
  });

  if (metadata.over) {
    this.showQuip(PeanutsTheme.quips.lose);
  }
};

HTMLActuator.prototype.showQuip = function (quip) {
  if (!quip || !this.speechText || !this.speechArt) return;

  var same = this.speechText.textContent === quip.text &&
             this.speechArt.getAttribute("src") === quip.art;
  if (same && !this.forceQuip) return;

  this.forceQuip = false;
  this.speechText.textContent = quip.text;
  this.speechArt.src = quip.art;
  this.speechArt.alt = "";
  this.speech.classList.remove("is-fresh");
  // Restart the portrait wiggle when the line changes.
  void this.speech.offsetWidth;
  this.speech.classList.add("is-fresh");
};

HTMLActuator.prototype.resetMilestones = function () {
  this.milestonesReady = false;
  this.seenMilestones = {};
  this.freshStart = true;
  this.forceQuip = true;
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;
  var spec = PeanutsTheme.specFor(tile.value);

  var wrapper   = document.createElement("div");
  var inner     = document.createElement("div");
  var position  = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);
  wrapper.setAttribute("role", "img");
  wrapper.setAttribute("aria-label", tile.value + ", " + spec.label);
  wrapper.setAttribute("data-character", spec.name);

  inner.classList.add("tile-inner");
  inner.style.backgroundColor = spec.color;

  var art = document.createElement("img");
  art.className = "tile-art";
  art.src = spec.art;
  art.alt = "";
  art.draggable = false;
  art.addEventListener("error", function () {
    art.style.display = "none";
  });

  var value = document.createElement("span");
  value.className = "tile-value";
  value.textContent = tile.value;

  var name = document.createElement("span");
  name.className = "tile-name";
  name.textContent = spec.name;

  inner.appendChild(art);
  inner.appendChild(name);
  inner.appendChild(value);

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  var firstPaint = !this.scoreReady;
  this.scoreReady = true;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (!firstPaint && difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.setAttribute("aria-hidden", "true");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
    this.scoreContainer.classList.remove("is-bump");
    void this.scoreContainer.offsetWidth;
    this.scoreContainer.classList.add("is-bump");
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

HTMLActuator.prototype.message = function (won) {
  var type = won ? "game-won" : "game-over";
  var copy = won ? PeanutsTheme.quips.win : PeanutsTheme.quips.lose;
  var text = this.messageContainer.querySelector(".message-text");
  var sub = this.messageContainer.querySelector(".message-sub");
  var art = this.messageContainer.querySelector(".modal-art");

  this.messageContainer.classList.add(type);
  text.textContent = copy.title;
  sub.textContent = copy.sub;
  art.src = copy.art;
  art.alt = copy.name;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
