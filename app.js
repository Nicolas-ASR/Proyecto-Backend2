const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');

// Middleware para analizar JSON y URL encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Crear el pool de conexión a MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'xexpress',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Ruta principal
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Ruta para el registro de usuarios
app.post('/registro', (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
  
    pool.getConnection((err, connection) => {
      if (err) {
        console.log("Error de conexión a la base de datos:", err);
        res.status(500).send('Error de conexión a la base de datos');
      } else {
        connection.query('INSERT INTO usuarios (usuario, clave) VALUES (?, ?)', [user, pass], (err, result) => {
          if (err) {
            console.log("Error al registrar usuario:", err);
            res.status(500).send('Error al registrar usuario');
          } else {
            res.send('Usuario registrado correctamente');
          }
          connection.release();
        });
      }
    });
  });
  

// Ruta POST para el inicio de sesión del usuario
app.post('/login', (req, res) => {
  const user = req.body.user;
  const pass = req.body.pass;

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error de conexión a la base de datos');
    } else {
      // Consulta SQL para verificar usuario y contraseña
      connection.query('SELECT * FROM usuarios WHERE usuario = ? AND clave = ?', [user, pass], (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).send('Error al verificar usuario');
        } else {
          if (results.length > 0) {
            res.send('Inicio de sesión exitoso');
          } else {
            res.send('Usuario o contraseña incorrectos');
          }
        }
        connection.release();
      });
    }
  });
});


// Nueva ruta GET para el inicio de sesión del usuario (si prefieres usar GET para pruebas)
app.get('/login', (req, res) => {
  const user = req.query.user;
  const pass = req.query.pass;

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error de conexión a la base de datos');
    } else {
      // Consulta SQL para verificar usuario y contraseña
      connection.query('SELECT * FROM usuarios WHERE usuario = ? AND clave = ?', [user, pass], (err, results) => {
        if (err) {
          console.log(err);
          res.status(500).send('Error al verificar usuario');
        } else {
          if (results.length > 0) {
            res.send('Inicio de sesión exitoso');
          } else {
            res.send('Usuario o contraseña incorrectos');
          }
        }
        connection.release();
      });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);

});