const dictionaries = [
  {
    id: 1,
    title: "Colors"
  }
];

const entries = [
  {
    dictId: 1,
    id: 1,
    domain: "Blue",
    range: "Red",
    drKey: "BlueRed",
    rdKey: "RedBlue"
  },
  {
    dictId: 1,
    id: 2,
    domain: "Green",
    range: "White",
    drKey: "GreenWhite",
    rdKey: "WhiteGreen"
  },
  {
    dictId: 1,
    id: 3,
    domain: "Grey",
    range: "Pink",
    drKey: "GreyPink",
    rdKey: "PinkGrey"
  },
  {
    dictId: 1,
    id: 4,
    domain: "Stonegrey",
    range: "Dark Grey",
    drKey: "StonegreyDark Grey",
    rdKey: "Dark GreyStonegrey"
  },
  {
    dictId: 1,
    id: 5,
    domain: "Stonegrey",
    range: "Dark Grey",
    drKey: "StonegreyDark Grey",
    rdKey: "Dark GreyStonegrey"
  },
  {
    dictId: 1,
    id: 6,
    domain: "Stonegrey",
    range: "Anthracite",
    drKey: "StonegreyAnthracite",
    rdKey: "AnthraciteStonegrey"
  },
  {
    dictId: 1,
    id: 7,
    domain: "Dark Grey",
    range: "Stonegrey",
    drKey: "Dark GreyStonegrey",
    rdKey: "StonegreyDark Grey"
  },
  {
    dictId: 1,
    id: 8,
    domain: "Dark Grey",
    range: "Anthracite",
    drKey: "Dark GreyAnthracite",
    rdKey: "AnthraciteDark Grey"
  }
];

const newDictionary = {
  id: null,
  title: ""
};

module.exports = {
  newDictionary,
  dictionaries,
  entries
};
