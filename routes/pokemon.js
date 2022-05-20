const express = require('express');
const axios = require('axios');
const router = express.Router();
const Joi = require('joi');
const Stream = require('stream');

router.get('/:id', async (req, res, next) => {
  const numberValidator = Joi.number();
  const id = req.params.id;

  try {
    await numberValidator.validateAsync(id);

    const response = await callGet(id);
    const { data } = response;
    const { name, height, moves, types, stats } = data;
    const filteredMoves = moves.map(m => m.move.name);
    const filteredTypes = types.map(t => t.type.name);
    const filteredStats = stats.map(s => {
      return {
        stat: s.base_stat,
        name: s.stat.name
      }
    });

    res.send({
      success: true,
      data: {
        id: req.params.id,
        name,
        height,
        moves: filteredMoves,
        types: filteredTypes,
        stats: filteredStats
      },
      error: null
    });
    
  } catch (error) {
    console.log("Error getting data. ", error)
    res.send({
      success: false,
      data: null,
      error
    });
  }

});

router.get('/:id/picture', async (req, res, next) => {
  const numberValidator = Joi.number();
  const id = req.params.id;

  try {
    await numberValidator.validateAsync(id);

    const response = await callGet(id);
    const { data } = response;
    const { sprites } = data;
    const imageUrl = sprites.other['official-artwork'].front_default;

    const imageData = await getImage(imageUrl);

    res.setHeader('content-type', imageData.headers['content-type']);
    res.setHeader('content-length', imageData.headers['content-length']);

    imageData.data.pipe(res);
  } catch (error) {
    console.log("Error getting data. ", error)
    res.send({
      success: false,
      data: null,
      error
    });
  }

});

const callGet = id => {
  return axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
};

const getImage = url => {
  return axios({
    method: 'get',
    url,
    responseType: 'stream'
  });
};

module.exports = router;