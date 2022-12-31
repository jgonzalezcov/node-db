const { Pool } = require('pg')
const credentials = require('../config/postgressql')
const pool = new Pool(credentials)

const respEroor = {
  status: 400,
  statusText: 'error',
  text: 'Info Server: No se han recibido todos los parametros',
}
const respOk = {
  status: 200,
  statusText: 'ok',
  text: 'La información se ha procesado correctamente',
}

const valida_usuario = (url) => {
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
  console.log(urlEnd, urlEnd2)
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
  const resultEr = valida_usuario(payload.url.toLowerCase())
  console.log(resultEr)
  if (
    payload.titulo === '' ||
    payload.url === '' ||
    payload.descripcion === ''
  ) {
    return (result = respEroor)
  } else if (resultDucplicate[0].num > 0) {
    return (result = respEroor)
  } else if (resultUrl === false) {
    return (result = respEroor)
  } else if (resultEr === false) {
    return (result = respEroor)
  } else {
    result = respOk
  }

  return result
}

module.exports = { validateInput }
