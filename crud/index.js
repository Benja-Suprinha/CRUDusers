const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Configuración de la conexión a la base de datos
const pool = new Pool({
  user: 'user',
  password: '2023',
  host: 'service_postgres',
  port: 5432,
  database: 'proyect',
});

app.get('/',(req,res) => {
    res.send("api beta 1.0 version")
})

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());

// Rutas y controladores

//CREATE USER
app.post('/users', async (req, res) => {
    const { ID_admin, username, password, type_user, name, mail, area, telefono } = req.body;
  
    try {
      await pool.query('BEGIN');
  
      const userResult = await pool.query(
        'INSERT INTO "user" (ID_admin, username, "password", type_user) VALUES ($1, $2, $3, $4) RETURNING ID',
        [ID_admin, username, password, type_user]
      );
  
      const userID = userResult.rows[0].ID;
  
      if (type_user === 'encargado_inventario') {
        await pool.query(
          'INSERT INTO encargado_inventario (ID_user, "name", "mail", telefono) VALUES ($1, $2, $3, $4)',
          [userID, name, mail, telefono]
        );
      } else if (type_user === 'personal_medico') {
        await pool.query(
          'INSERT INTO personal_medico (ID_user, "name", "area", "mail", telefono) VALUES ($1, $2, $3, $4, $5)',
          [userID, name, area, mail, telefono]
        );
      }
  
      await pool.query('COMMIT');
      res.status(201).send({ message: 'Usuario creado exitosamente' });
    } catch (error) {
      await pool.query('ROLLBACK');
      res.status(500).send({ message: 'Error al crear el usuario', error });
    }
  });
  
  //READ
  app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "user"');
        res.send(result.rows);
      } catch (error) {
        res.status(500).send({ message: 'Error al obtener los usuarios', error });
      }
  });
  
  //READ ONE
  app.get('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const result = await pool.query('SELECT * FROM "user" WHERE ID = $1', [id]);
  
      if (result.rows.length === 0) {
        res.status(404).send({ message: 'Usuario no encontrado' });
      } else {
        res.status(200).send(result.rows[0]);
      }
    } catch (error) {
      res.status(500).send({ message: 'Error al obtener el usuario', error });
    }
  });
  
  //UPDATE
  app.put('/users/:id', async (req, res) => {
    const { id } = req.params;
    const { ID_admin, username, password, type_user, name, mail, area, telefono } = req.body;
  
    try {
      await pool.query('BEGIN');
  
      const userResult = await pool.query(
        'UPDATE "user" SET ID_admin = $1, username = $2, "password" = $3, type_user = $4 WHERE ID = $5 RETURNING ID',
        [ID_admin, username, password, type_user, id]
      );
  
      if (userResult.rows.length === 0) {
        res.status(404).send({ message: 'Usuario no encontrado' });
      } else {
        const userID = userResult.rows[0].ID;
  
        if (type_user === 'encargado_inventario') {
          await pool.query(
            'UPDATE encargado_inventario SET "name" = $1, "mail" = $2, telefono = $3 WHERE ID_user = $4',
            [name, mail, telefono, userID]
          );
        } else if (type_user === 'personal_medico') {
          await pool.query(
            'UPDATE personal_medico SET "name" = $1, "area" = $2, "mail" = $3, telefono = $4 WHERE ID_user = $5',
            [name, area, mail, telefono, userID]
          );
        }
  
        await pool.query('COMMIT');
        res.status(200).send({ message: 'Usuario actualizado exitosamente' });
      }
    } catch (error) {
      await pool.query('ROLLBACK');
      res.status(500).send({ message: 'Error al actualizar el usuario', error });
    }
  });
  
  app.delete('/users/:id', async (req, res) => {
    const { id } = req.params;

    try {
      await pool.query('BEGIN');
  
      const userResult = await pool.query('DELETE FROM "user" WHERE ID = $1 RETURNING ID, type_user', [id]);
  
      if (userResult.rows.length === 0) {
        res.status(404).send({ message: 'Usuario no encontrado' });
      } else {
        const userID = userResult.rows[0].ID;
        const userType = userResult.rows[0].type_user;
  
        if (userType === 'encargado_inventario') {
          await pool.query('DELETE FROM encargado_inventario WHERE ID_user = $1', [userID]);
        } else if (userType === 'personal_medico') {
          await pool.query('DELETE FROM personal_medico WHERE ID_user = $1', [userID]);
        }
  
        await pool.query('COMMIT');
        res.status(200).send({ message: 'Usuario eliminado exitosamente' });
      }
    } catch (error) {
      await pool.query('ROLLBACK');
      res.status(500).send({ message: 'Error al eliminar el usuario', error });
    }
  });
  
app.listen(port, () => {
    console.log(`API escuchando en http://localhost:${port}`)
});