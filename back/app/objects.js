const path = require('path');
const express = require('express');
const multer  = require('multer');
const nanoid = require('nanoid');
const mysqlDb = require('../mysqlDb');
const config = require('../config');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

const router = express.Router();

router.get('/', async (req, res) => {
    const items = await mysqlDb.getConnection().query('SELECT * FROM `objects`');
    res.send(items);
});

router.get('/:id', async (req, res) => {
    const item = await mysqlDb.getConnection().query('SELECT * FROM `objects` WHERE `id` = ?', req.params.id);
    const itemElement = item[0];
    if (!itemElement) {
        return res.status(404).send({message: 'Not Found Object'});
    }
    res.send(itemElement);
});

router.post('/', upload.single('image'), async (req, res) => {
    const object = req.body;

    if (req.file) {
        object.image = req.file.filename;
    }

    const result = await mysqlDb.getConnection().query(
        'INSERT INTO `objects` (`category_id`, `place_id`, `name`, `description`, `image`) VALUES ' +
        '(?, ?, ?, ?, ?)',
        [object.categoryId, object.placeId, object.name, object.description, object.image]
    );

    res.send({id: result.insertId});
});

router.delete('/:id', async (req, res) => {
    const item = await mysqlDb.getConnection().query('DELETE FROM `objects` WHERE `id` = ?', req.params.id);

    if (item.affectedRows === 0) {
        return res.status(404).send({message: 'No Object Found'});
    } else {
        res.send('Object deleted successfully');
    }
});


module.exports = router;