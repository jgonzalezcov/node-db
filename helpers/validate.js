const pool = require('./connectDb').getInstance()

const respEroor = {
  status: 400,
  statusText: 'error',
  text: 'Info Server: No se han recibido todos los parametros',
}
const respEroor2 = {
  status: 400,
  statusText: 'error',
  text: 'Info Server: Registro ya existe',
}
const respEroor3 = {
  status: 400,
  statusText: 'error',
  text: 'Info Server: Extención de imagen no es valida',
}
const respEroor4 = {
  status: 400,
  statusText: 'error',
  text: 'Info Server: El formato de url no es valida',
}
const respOk = {
  status: 200,
  statusText: 'ok',
  text: 'La información se ha procesado correctamente',
}
const validaEr = (url) => {
  return /^https?:\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/.test(url)
}
//Funcion muestra si existe registro con los mismos datos que queremos agregar//
const duplicatePost = async (payload) => {
  const SQLquery = {
    text: 'SELECT COUNT(*) as NUM FROM posts WHERE title=$1 AND img=$2 AND description=$3',
    values: [payload.titulo, payload.url, payload.descripcion],
  }
  const { rows } = await pool.query(SQLquery)
  return rows
}
const validateUrl = async (url) => {
  const urlEnd = url.slice(-4)
  const urlEnd2 = url.slice(-5)
  if (
    urlEnd === '.jpg' ||
    urlEnd === '.png' ||
    urlEnd === '.bmp' ||
    urlEnd === '.cmp' ||
    urlEnd === '.gif' ||
    urlEnd2 === '.jpeg' ||
    urlEnd2 === '.tiff' ||
    urlEnd2 === '.webp' ||
    urlEnd2 === '.avif'
  ) {
    return true
  } else {
    return false
  }
}
const validateInput = async (payload) => {
  let result = ''
  const resultDucplicate = await duplicatePost(payload)

  const resultUrl = await validateUrl(payload.url.toLowerCase())
  const resultEr = validaEr(payload.url.toLowerCase())
  if (
    payload.titulo === '' ||
    payload.url === '' ||
    payload.descripcion === ''
  ) {
    return (result = respEroor)
  } else if (resultDucplicate[0].num > 0) {
    return (result = respEroor2)
  } else if (resultUrl === false) {
    return (result = respEroor3)
  } else if (resultEr === false) {
    return (result = respEroor4)
  } else {
    result = respOk
  }
  return result
}

/*Validacion de actualizar like*/
const idExists = async (id) => {
  const SQLquery = {
    text: 'SELECT CAST (COUNT(*) AS INT) as NUM FROM posts WHERE id=$1',
    values: [id],
  }
  const { rows } = await pool.query(SQLquery)
  return rows
}

const validateId = async (id) => {
  result = ''
  const resultId = await idExists(id)
  if (resultId[0].num === 0) {
    result = {
      status: 400,
      statusText: 'error',
      text: 'Info Server: El id no existe',
    }
  } else {
    result = {
      status: 200,
      statusText: 'ok',
      text: 'Info Server: El id es correcto',
    }
  }
  return result
}

module.exports = { validateInput, validateId }
