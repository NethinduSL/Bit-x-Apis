const data = require("./BitX/dta.js");

async function xen(query, ip) {
  if (!query) throw new Error("Query is required");
  if (!ip) throw new Error("IP is required");

  // Check if query exists
  if (!data[query]) {
    throw new Error("No item found for this query");
  }

  const item = data[query];

  // If global ended
  if (item.times <= 0) {
    return data.end;
  }

  // Initialize IP if not set
  if (!item.iptime[ip]) {
    item.iptime[ip] = item.maxtimesperip;
  }

  // If IP ended
  if (item.iptime[ip] <= 0) {
    return {
      ...item,
      info: "This IP has no remaining views",
      iptime: 0,
      times: item.times
    };
  }

  // Reduce counts
  item.times -= 1;
  item.iptime[ip] -= 1;

  // If global ended after this
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
