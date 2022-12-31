const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.static('public'))
app.use(cors())
app.use(express.json())
const CsbInspector = require('csb-inspector')
CsbInspector()
require('dotenv').config()
const { obtenerPosts, agregarPosts } = require('./api/models/postModels')
const {
  validateInput,
  validateURL,
  validaformat,
} = require('./helpers/validate')
const errorServer = {
  status: 500,
  statusText: 'error',
  text: 'Error interno del servidor',
}

/**********************************Levanta el Servidor***************************************/
app.listen(process.env.PORT, () => {
  console.log('El servidor esta activo en el puerto', process.env.PORT)
})
/**************************Envia archivo a mostrar en el Home*******************************/
app.get('/', (req, res) => {
  try {
    return res.sendFile(__dirname + '/public/index.html')
  } catch (error) {
    res
      .status(errorServer.status)
      .send({ status: errorServer.statusText, data: errorServer.text })
  }
})
/****************************Endpoint para buscar los Posts**********************************/
app.get('/posts', async (req, res) => {
  try {
    const posts = await obtenerPosts()
    res.json(posts)
  } catch (error) {
    res
      .status(errorServer.status)
      .send({ status: errorServer.statusText, data: errorServer.text })
  }
})
/****************************Endpoint para crear Posts**********************************/
app.post('/posts', async (req, res) => {
  try {
    const payload = req.body
    resp = await validateInput(payload)
    if (resp.status === 200) {
      await agregarPosts(payload)
      res.send('Post creado con exito')
    }
  } catch (error) {
    res
      .status(errorServer.status)
      .send({ status: errorServer.statusText, data: errorServer.text })
  }
})
