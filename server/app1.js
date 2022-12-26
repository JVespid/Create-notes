const { createServer } = require('vite')
const app = require('.')

createServer(app).listen(3000, () => {
  console.log('Servidor iniciado en el puerto 3000')
})
