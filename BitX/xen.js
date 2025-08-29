const data = require("./data.js");

async function xen(query, ip) {
  if (!query) throw new Error("Query is required");
  if (!ip) throw new Error("IP is required");

  // Special query to reset all times and IPs
  if (query === "ebox") {
    for (const key in data) {
      if (key === "end") continue; // skip end object
      const item = data[key];
      item.times = item.maxtimesperip * 2; // or any default global times you want
      item.iptime = {};                  // clear IP counters
    }
    return { info: "All times and IP counters have been reset" };
  }

  // Normal processing
  if (!data[query]) {
    throw new Error("No item found for this query");
  }

  const item = data[query];

  if (item.times <= 0) {
    return data.end;
  }

  if (!item.iptime[ip]) {
    item.iptime[ip] = item.maxtimesperip;
  }

  if (item.iptime[ip] <= 0) {
    return {
      ...item,
      info: "This IP has no remaining views",
      iptime: 0,
      times: item.times
    };
  }

  item.times -= 1;
  item.iptime[ip] -= 1;

  if (item.times <= 0) {
    return data.end;
  }

  return {
    name: item.name,
    link: item.link,
    price: item.price,
    times: item.times,
    iptime: item.iptime[ip]
  };
}

module.exports = { xen };
