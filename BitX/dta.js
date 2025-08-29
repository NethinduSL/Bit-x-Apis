// dta.js
const data = {
  "87-==(": {
    name: "hi",
    link: "link1",
    price: "40RS",
    times: 10,             // total global times
    maxtimesperip: 5,      // per-IP max views
    iptime: {}             // per-IP counters
  },
  "99-@@": {
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
