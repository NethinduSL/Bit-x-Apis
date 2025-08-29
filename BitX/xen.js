// xen.js
const data = require("./dta.js");

async function xen(query, ip) {
  if (!query) throw new Error("Query is required");
  if (!ip) throw new Error("IP is required");

  // Check if query exists in data
  if (!data[query]) {
    throw new Error("No item found for this query");
  }

  const item = data[query];

  // If global times ended
  if (item.times <= 0) {
    return data.end;
  }

  // Initialize iptime if not set
  if (!item.iptime[ip]) {
    item.iptime[ip] = item.maxtimesperip;
  }

  // If this IP’s times ended
  if (item.iptime[ip] <= 0) {
    return {
      ...item,
      info: "This IP has no remaining views",
      iptime: 0,
      times: item.times
    };
  }

  // Reduce both global and IP-specific counts
  item.times -= 1;
  item.iptime[ip] -= 1;

  // If global ended after this request
  if (item.times <= 0) {
    return data.end;
  }

  return {
    name: item.name,
    link: item.link,
    price: item.price,
    times: item.times,       // global remaining
    iptime: item.iptime[ip]  // this IP’s remaining
  };
}

module.exports = { xen };
