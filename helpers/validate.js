const pool = require('./connectDb').getInstance()

const errorMessage = async (v) => {
  let message = ''
  let code = 400
  let messageText = 'error'
  if (v === 1) {
    message = 'Info Server: No se han recibido todos los parametros'
  } else if (v === 2) {
    message = 'Info Server: Registro ya existe'
  } else if (v === 3) {
    message = 'Info Server: Extención de imagen no es valida'
  } else if (v === 4) {
    message = 'Info Server: El formato de url no es valida'
  } else if (v === 5) {
    message = 'Info Server: El id no existe'
  } else if (v === 6) {
    message = 'Info Server: La información se ha procesado correctamente'
    code = 200
    messageText = 'ok'
  } else if (v === 7) {
    message = 'Info Server: El id es correcto'
    code = 200
    messageText = 'ok'
  }
  return {
    status: code,
    statusText: messageText,
    text: message,
  }
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
    return (result = await errorMessage(1))
  } else if (resultDucplicate[0].num > 0) {
    return (result = await errorMessage(2))
  } else if (resultUrl === false) {
    return (result = await errorMessage(3))
  } else if (resultEr === false) {
    return (result = await errorMessage(4))
  } else {
    result = await errorMessage(6)
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
    result = await errorMessage(5)
  } else {
    result = await errorMessage(7)
  }
  return result
}

module.exports = { validateInput, validateId }
