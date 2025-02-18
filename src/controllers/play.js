const lib = require('../lib/play.js');

const plant = (req, res) => {
  try {
    const { player, fieldIndex } = req.body;
    const gameObject = lib.plant(player, fieldIndex);
    res.send({ message: 'Planted', gameObject });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
}

module.exports = {
  plant,
};