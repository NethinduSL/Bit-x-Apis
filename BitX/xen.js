// old: const data = require("./dta.js");
const data = require("./data.js");  // <-- updated to data.js

async function xen(query, ip) {
  if (!query) throw new Error("Query is required");
  if (!ip) throw new Error("IP is required");

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
