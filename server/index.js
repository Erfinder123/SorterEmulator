const express = require('express');
const app = express();

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Привет от Express!' });
});

app.listen(3000, () => {
    console.log('Сервер запущен: http://localhost:3000');
});
