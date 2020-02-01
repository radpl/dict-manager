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
