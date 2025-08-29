const data = require("./dta.js");
const ipRequests = new Map(); // Track requests per IP

async function xen(query, ip) {
  if (!query) throw new Error("Query is required");
  if (!ip) throw new Error("IP is required");

  const key = "start"; // current main key

  // If already ended
  if (data[key].times <= 0) {
    return data.end;
  }

  // Track IP usage
  if (!ipRequests.has(ip)) {
    ipRequests.set(ip, 0);
  }

  // If IP already viewed, don’t reduce again
  if (ipRequests.get(ip) >= 1) {
    return {
      ...data[key],
      info: "Already viewed from this IP"
    };
  }

  // Reduce view count
  data[key].times -= 1;
  ipRequests.set(ip, ipRequests.get(ip) + 1);

  // If times ended
  if (data[key].times <= 0) {
    return data.end;
  }

  return {
    name: data[key].name,
    link: data[key].link,
    price: data[key].price,
    times: data[key].times
  };
}

module.exports = { xen };
