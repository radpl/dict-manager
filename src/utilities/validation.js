export const validateEntryStatus = entries => {
  const domainRangeKeys = {};
  const rangeDomainKeys = {};
  const domainKeys = {};
  const rangeKeys = {};

  const duplicates = {};
  const cycles = {};
  const domains = {};
  const ranges = {};

  for (let i = 0; i < entries.length; i++) {

    //identify duplicates
    if (domainRangeKeys[entries[i].drKey]) {
      domainRangeKeys[entries[i].drKey].push(i);
      for (let j = 0; j < domainRangeKeys[entries[i].drKey].length; j++) {
        duplicates[domainRangeKeys[entries[i].drKey][j]] = true;
      }
    } else {
      domainRangeKeys[entries[i].drKey] = [i];
    }
    //populate ids for cycles identification
    if (rangeDomainKeys[entries[i].rdKey]) {
      rangeDomainKeys[entries[i].rdKey].push(i);
    } else {
      rangeDomainKeys[entries[i].rdKey] = [i];
    }

    //identify duplicate domains
    if (domainKeys[entries[i].domain]) {
      domainKeys[entries[i].domain].push(i);
      for (let j = 0; j < domainKeys[entries[i].domain].length; j++) {
        domains[domainKeys[entries[i].domain][j]] = true;
      }
    } else {
      domainKeys[entries[i].domain] = [i];
    }

    //populate ids for chains identification
    if (rangeKeys[entries[i].range]) {
      rangeKeys[entries[i].range].push(i);
    } else {
      rangeKeys[entries[i].range] = [i];
    }

    //pupulate initial status
    entries[i].status = "Valid";
  }

  //identify cycles
  const drKeys = Object.keys(domainRangeKeys);
  for (let i = 0; i < drKeys.length; i++) {
    let rdKey = rangeDomainKeys[drKeys[i]];
    if (rdKey) {
      for (let j = 0; j < rdKey.length; j++) {
        cycles[rdKey[j]] = true;
      }
    }
  }

  //identify chains
  const rKeys = Object.keys(rangeKeys);
  for (let i = 0; i < rKeys.length; i++) {
    let dKey = domainKeys[rKeys[i]];
    if (dKey) {
      for (let j = 0; j < dKey.length; j++) {
        ranges[dKey[j]] = true;
      }
    }
  }

  const dKeys = Object.keys(domainKeys);
  for (let i = 0; i < dKeys.length; i++) {
    let rKey = rangeKeys[dKeys[i]];
    if (rKey) {
      for (let j = 0; j < rKey.length; j++) {
        ranges[rKey[j]] = true;
      }
    }
  }

  //update status for all errors
  const domainsKeys = Object.keys(domains);
  const duplicateKeys = Object.keys(duplicates);
  const rangesKeys = Object.keys(ranges);
  const cycleKeys = Object.keys(cycles);

  for (let i = 0; i < domainsKeys.length; i++) {
    if (entries[domainsKeys[i]].status === "Valid") {
      entries[domainsKeys[i]].status = "Forks";
    } else {
      entries[domainsKeys[i]].status += " Forks";
    }
  }

  for (let i = 0; i < duplicateKeys.length; i++) {
    if (entries[duplicateKeys[i]].status === "Valid") {
      entries[duplicateKeys[i]].status = "Duplicate";
    } else if (entries[duplicateKeys[i]].status.includes("Forks")) {
      entries[duplicateKeys[i]].status = entries[duplicateKeys[i]].status.replace("Forks", "Duplicate");
    } else {
      entries[duplicateKeys[i]].status += " Duplicate";
    }
  }

  for (let i = 0; i < rangesKeys.length; i++) {
    if (entries[rangesKeys[i]].status === "Valid") {
      entries[rangesKeys[i]].status = "Chain";
    } else {
      entries[rangesKeys[i]].status += " Chain";
    }
  }

  for (let i = 0; i < cycleKeys.length; i++) {
    if (entries[cycleKeys[i]].status === "Valid") {
      entries[cycleKeys[i]].status = "Cycle";
    } else if (entries[cycleKeys[i]].status.includes("Chain")) {
      entries[cycleKeys[i]].status = entries[cycleKeys[i]].status.replace("Chain", "Cycle");
    } else {
      entries[cycleKeys[i]].status += " Cycle";
    }
  }

  return entries;
};

export const calculateValidationErrors = (entries) => {
  const errors = {};
  for (let i = 0; i < entries.length; i++) {
    errors[entries[i].status] = errors[entries[i].status] ? errors[entries[i].status] + 1 : 1;
  }

  return errors;
}
