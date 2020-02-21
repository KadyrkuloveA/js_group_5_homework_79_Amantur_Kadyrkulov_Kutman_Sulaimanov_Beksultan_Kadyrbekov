const express = require('express');
const mysqlDb = require('../mysqlDb');

const router = express.Router();

router.get('/', async (req, res) => {
    const items = await mysqlDb.getConnection().query('SELECT * FROM `categories`');
    res.send(items);
});

router.get('/:id', async (req, res) => {
    const item = await mysqlDb.getConnection().query('SELECT * FROM `categories` WHERE `id` = ?', req.params.id);
    const itemElement = item[0];
    if (!itemElement) {
        return res.status(404).send({message: 'Not Found Category'});
    }
    res.send(itemElement);
});


//JSON
router.post('/', async (req, res) => {
    const object = req.body;

    const result = await mysqlDb.getConnection().query(
        'INSERT INTO `categories` (`name`, `description`) VALUES ' +
        '(?, ?)',
        [object.name, object.description]
    );

    res.send({id: result.insertId});
});

router.delete('/:id', async (req, res) => {
    const item = await mysqlDb.getConnection().query('DELETE FROM `categories` WHERE `id` = ?', req.params.id);

    if (item.affectedRows === 0) {
        return res.status(404).send({message: 'No Object Found'});
    } else if (item.affectedRows > 0) {
        res.send('Category deleted successfully');
    }
});


module.exports = router;