const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/:id', async (req, res, next) => {

  const response = await callGet(req.params.id);
  const { data } = response;
  const { name, height, moves } = data;
  const filteredMoves = moves.map(m => {
    return m.move.name

  });

  res.send({
    id: req.params.id,
    name,
    height,
    moves: filteredMoves
  });
});

const callGet = id => {
  return axios(`https://pokeapi.co/api/v2/pokemon/${id}`);
};

module.exports = router;