const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors()); // Permitir peticiones desde el frontend
app.use(express.json()); // Para manejar JSON

app.get('/', (req, res) => {
    res.send({ message: '¡Servidor Express en funcionamiento!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
