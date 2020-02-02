export const convertEntriesToCSV = (entries) => {

  let lines = entries.map(entry => {
    return Object.values(entry).join(",");
  });
  let linesCSV = lines.join("\n");
  const csvData = new Blob([linesCSV], { type: "text/csv;charset=utf-8;" });
  return csvData;
};

export const convertCSVToEntries = (csv, nextId, dictId) => {
  const linesRaw = csv.split(/\r\n|\n/);
  const newEntries = linesRaw.map((data, index) => {
    const [domain, range] = data.split(";");
    return {
      id: nextId + index,
      dictId: dictId,
      domain,
      range,
      drKey: domain + range,
      rdKey: range + domain
    };
  });

  return newEntries;

}