const mongoStore = require("./mongoStore");
const memoryStore = require("./memoryStore");

let active = memoryStore;
let mode = "memory";

module.exports = {
  use(useMongo) {
    active = useMongo ? mongoStore : memoryStore;
    mode = useMongo ? "mongodb" : "memory";
  },
  mode: () => mode,
  list: (...a) => active.list(...a),
  get: (...a) => active.get(...a),
  create: (...a) => active.create(...a),
  update: (...a) => active.update(...a),
  remove: (...a) => active.remove(...a),
  count: (...a) => active.count(...a)
};
