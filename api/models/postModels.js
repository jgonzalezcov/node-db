const { Pool } = require('pg')
const credentials = require('../../config/postgressql')
const pool = new Pool(credentials)

/*******************Cominucación a bases de datos Postgressql para que trae todos los posts**********************/
const obtenerPosts = async () => {
  try {
    const { rows } = await pool.query(
      'SELECT id, title as titulo, img, description as descripcion, likes  FROM posts'
    )
    return rows
  } catch (e) {
    console.log('error al insertar datos en tabla product: ', e.code, e.message)
    throw new Error(e)
  }
}

const agregarPosts = async (payload) => {
  const SQLquery = {
    text: 'INSERT INTO posts (id, title, img, description, likes) VALUES (DEFAULT, $1, $2, $3, $4) RETURNING *',
    values: [payload.titulo, payload.url, payload.descripcion, payload.likes],
  }
  try {
    const result = await pool.query(SQLquery)
    return result.rows
  } catch (e) {
    console.log('error al insertar datos en tabla product: ', e.code, e.message)
    throw new Error(e)
  }
}

module.exports = { obtenerPosts, agregarPosts }
