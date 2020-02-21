const express = require('express');
const mysqlDb = require('../mysqlDb');

const router = express.Router();

router.get('/', async (req, res) => {
    const items = await mysqlDb.getConnection().query('SELECT * FROM `places`');
    res.send(items);
});

router.get('/:id', async (req, res) => {
    const item = await mysqlDb.getConnection().query('SELECT * FROM `places` WHERE `id` = ?', req.params.id);
    const itemElement = item[0];
    if (!itemElement) {
        return res.status(404).send({message: 'Not Found Place'});
    }
    res.send(itemElement);
});


//JSON
router.post('/', async (req, res) => {
    const object = req.body;

    if (!object.name) {
        res.send('Please add name of this place');
    } else {
        const result = await mysqlDb.getConnection().query(
            'INSERT INTO `places` (`name`, `description`) VALUES ' +
            '(?, ?)',
            [object.name, object.description]
        );

        object.id = result.insertId;

        res.send(object);
    }
});

router.delete('/:id', async (req, res) => {
    const item = await mysqlDb.getConnection().query('DELETE FROM `places` WHERE `id` = ?', req.params.id);

    if (item.affectedRows === 0) {
        return res.status(404).send({message: 'No Object Found'});
    } else {
        res.send('Place deleted successfully');
    }
});


module.exports = router;