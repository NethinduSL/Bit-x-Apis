// dta.js
const data = {
  "2356(": {
    name: "hi",
    link: "link1",
    price: "40RS",
    times: 10,             // global times (all IPs combined)
    maxtimesperip: 5,      // how many times one IP can view
    iptime: {}             // per-IP counters
  },
  "99-((": {
    name: "hello",
    link: "link2",
    price: "100RS",
    times: 15,
    maxtimesperip: 3,
    iptime: {}
  },
  end: {
    name: "ended",
    link: "link",
    price: "N/A",
    times: 0
  }
};

module.exports = data;
