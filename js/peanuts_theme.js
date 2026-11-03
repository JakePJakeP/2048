// Central Peanuts theme. Swap any illustration by replacing the SVG
// in assets/characters/ or by pointing `art` at a new file.
var PeanutsTheme = (function () {
  var tiles = {
    2: {
      name: "Woodstock",
      label: "Woodstock",
      color: "#fff3c4",
      art: "assets/characters/woodstock.svg"
    },
    4: {
      name: "Snoopy",
      label: "Snoopy",
      color: "#f7f4ee",
      art: "assets/characters/snoopy.svg"
    },
    8: {
      name: "Charlie Brown",
      label: "Charlie Brown",
      color: "#ffe7a8",
      art: "assets/characters/charlie-brown.svg"
    },
    16: {
      name: "Linus",
      label: "Linus",
      color: "#d7ecf8",
      art: "assets/characters/linus.svg"
    },
    32: {
      name: "Lucy",
      label: "Lucy",
      color: "#f8d0dc",
      art: "assets/characters/lucy.svg"
    },
    64: {
      name: "Sally",
      label: "Sally",
      color: "#fde3c8",
      art: "assets/characters/sally.svg"
    },
    128: {
      name: "Peppermint Patty",
      label: "Peppermint Patty",
      color: "#d9eecb",
      art: "assets/characters/peppermint-patty.svg"
    },
    256: {
      name: "Marcie",
      label: "Marcie",
      color: "#e6d6f6",
      art: "assets/characters/marcie.svg"
    },
    512: {
      name: "Schroeder",
      label: "Schroeder",
      color: "#f6e0bf",
      art: "assets/characters/schroeder.svg"
    },
    1024: {
      name: "Franklin",
      label: "Franklin",
      color: "#d5eee4",
      art: "assets/characters/franklin.svg"
    },
    2048: {
      name: "Flying Ace",
      label: "Snoopy as the Flying Ace",
      color: "#f7d6d1",
      art: "assets/characters/flying-ace.svg"
    }
  };

  var extras = [
    {
      name: "Joe Cool",
      label: "Snoopy as Joe Cool",
      color: "#d9e4f8",
      art: "assets/characters/joe-cool.svg"
    },
    {
      name: "Beagle Scout",
      label: "Snoopy the Beagle Scout",
      color: "#f0e2c4",
      art: "assets/characters/beagle-scout.svg"
    },
    {
      name: "Astronaut",
      label: "Snoopy the Astronaut",
      color: "#e4e6f8",
      art: "assets/characters/astronaut.svg"
    },
    {
      name: "Superstar",
      label: "Snoopy the Superstar",
      color: "#f8ebc8",
      art: "assets/characters/superstar.svg"
    }
  ];

  function specFor(value) {
    if (tiles[value]) return tiles[value];
    var index = Math.round(Math.log(value) / Math.LN2) - 12;
    if (index < 0 || !isFinite(index)) index = 0;
    return extras[index % extras.length];
  }

  var quips = {
    start: {
      text: "Here we go!",
      art: tiles[2].art,
      name: "Woodstock"
    },
    welcome: {
      text: "Welcome back!",
      art: tiles[4].art,
      name: "Snoopy"
    },
    128: {
      text: "You're doing great!",
      art: tiles[128].art,
      name: "Peppermint Patty"
    },
    512: {
      text: "Good grief, that's impressive!",
      art: tiles[512].art,
      name: "Schroeder"
    },
    1024: {
      text: "Almost there!",
      art: tiles[1024].art,
      name: "Franklin"
    },
    2048: {
      text: "You did it! Happiness is a high score.",
      art: tiles[2048].art,
      name: "Flying Ace"
    },
    4096: {
      text: "Good grief, still going!",
      art: extras[0].art,
      name: "Joe Cool"
    },
    win: {
      title: "You did it!",
      sub: "Happiness is a high score.",
      art: tiles[2048].art,
      name: "Snoopy as the Flying Ace"
    },
    lose: {
      text: "Good grief! Give it another try.",
      title: "Good grief!",
      sub: "Give it another try.",
      art: tiles[8].art,
      name: "Charlie Brown"
    }
  };

  return {
    specFor: specFor,
    quips: quips,
    milestones: [128, 512, 1024, 2048, 4096]
  };
})();
