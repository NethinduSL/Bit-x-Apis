const data = require("dta.js");

async function xen(query, ip) {
  if (!query) throw new Error("Query is required");
  if (!ip) throw new Error("IP is required");

  const key = "start";

  // If global ended → return end
  if (data[key].times <= 0) {
    return data.end;
  }

  // Initialize IP times if not set
  if (!data[key].iptime[ip]) {
    data[key].iptime[ip] = data[key].maxtimesperip; // use config from dta.js
  }

  // If IP already ended
  if (data[key].iptime[ip] <= 0) {
    return {
      ...data[key],
      info: "This IP has no remaining views",
      iptime: 0,
      times: data[key].times
    };
  }

  // Reduce both
  data[key].times -= 1;
  data[key].iptime[ip] -= 1;

  // If global ended after this request
  if (data[key].times <= 0) {
    return data.end;
  }

  return {
    name: data[key].name,
    link: data[key].link,
    price: data[key].price,
    times: data[key].times,       // global remaining
    iptime: data[key].iptime[ip]  // IP remaining
  };
}

module.exports = { xen };
