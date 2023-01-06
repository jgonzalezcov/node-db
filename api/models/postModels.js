const pool = require('../../helpers/connectDb').getInstance()
/*******************Comunicación a bases de datos Postgressql para que trae todos los posts**********************/
const readPosts = async () => {
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
/*******************Comunicación a bases de datos Postgressql Agregar posts**********************/
const addPosts = async (payload) => {
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

/*******************Comunicación a bases de datos Postgressql para actualiza numero de posts**********************/

const addLike = async (id) => {
  const SQLquery = {
    text: 'UPDATE posts SET likes = CASE WHEN likes IS NULL THEN 1 ELSE likes +1 END WHERE id=$1 RETURNING *',
    values: [id],
  }
  try {
    const result = await pool.query(SQLquery)
    return result.rows
  } catch (e) {
    console.log('error al actulizar numero de likes: ', e.code, e.message)
    throw new Error(e)
  }
}
/*******************Comunicación a bases de datos Postgressql para eliminar posts**********************/
const deletePosts = async (id) => {
  const SQLquery = {
    text: 'DELETE FROM posts WHERE id = $1 RETURNING *',
    values: [id],
  }
  try {
    const result = await pool.query(SQLquery)
    return result.rows
  } catch (error) {
    console.log('error al eliminar posts: ', e.code, e.message)
    throw new Error(e)
  }
}

module.exports = { readPosts, addPosts, addLike, deletePosts }
