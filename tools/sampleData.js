const dictionaries = [
  {
    id: 1,
    title: "Colors",
  },
];

const entries = [
  { dictId: 1, id: 1, domain: "Blue", range: "Red" },
  { dictId: 1, id: 2, domain: "Green", range: "White" },
  { dictId: 1, id: 3, domain: "Grey", range: "Pink" },
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