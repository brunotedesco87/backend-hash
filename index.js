const express = require('express');
const multer = require('multer');
const { imageHash } = require('image-hash');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Habilitar CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/hash', upload.single('image'), (req, res) => {
  const filePath = req.file.path;

  imageHash(filePath, 8, true, (error, data) => {
    fs.unlinkSync(filePath);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Error al calcular hash' });
    }

    res.json({ hash: data });
  });
});

// Puerto dinámico para hosting
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de hash corriendo en puerto ${PORT}`);
});
