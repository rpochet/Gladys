const { init } = require('./graph.init');

const GraphManager = function GraphManager(variable) {
  this.variable = variable;
  init.call(this);
};

module.exports = GraphManager;