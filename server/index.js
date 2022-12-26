//const { createServer } = require('vite')
const { marked } = require('marked')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

const socketIo = require('socket.io')
const server = require('http').createServer(app)
const io = socketIo(server)

// borrar despues
const cors = require('cors')

const path = require('path')
const publicPath = path.join(__dirname, '..', 'dist')

app.use(express.static(publicPath))

// código markdown para convertir a html
const routeMain = require('./routes/routeMain')
const markdownString = 'TextMK'
const htmlString = marked(markdownString)
console.log(htmlString) // Imprime: <h1>Mi título en Markdown</h1>

app.use(
  cors({
    origin: '*'//['http://127.0.0.1:5173/', 'http://localhost:5173/'],
  }),
)

app.use('/', routeMain)



io.on('connection', (socket) => {
  let limit = 0
  console.log('a user connected in this server')

  socket.on('client on', (msg) => {
    console.log('client on', msg, limit)
    if (msg == 'true' && limit == 0) {
      limit++

      socket.emit('text markdown last save', TextMK)
      socket.emit('text html last save', TextHTML)
    }
  })

  socket.on('client off', (type) => {
    limit = 0
  })

  socket.on('disconnect', (type) => {
    limit = 0
    console.log('user disconnected')
  })
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`http://localhost:${PORT}`)
})

//module.exports = server;

/*
import React from 'react';

function MyComponent() {
  const html = '<p>Soy un párrafo de texto con <strong>negrita</strong></p>';
  const text = 'Soy un párrafo de texto con negrita';

  return (
    <div>
      {/* Agregar el código HTML como contenido del elemento }
      <div dangerouslySetInnerHTML={{ __html: html, __text: text }} />
    </div>
  );
}


*/

const TextHTML = `<h1>Bienvenido al chat</h1>`

const TextMK =
  `# Bienvenido al chat

  Escribe lo que quieras con el formato que **quieras** por ejemplo:
  
  - Una lista de tareas
    - Esta puede tener mas opciones como **_sub listas_**
    - [ ] Listas de tipo **_check_**
          O también puedes ordenar pendientes con las listas ordenadas; ejemplo:
  
  1. Tarea 1
  1. Tarea 2
  
  También puedes citar a alguien
  
  > Cita de juan peres "el fin de todo es el limite"
  
  Aunque si quieres hacer una pagina informativa, también puedes hacer links dinámicos
  
  [aquí_escribe_cualquier_texto](https://images.unsplash.com/photo-1593288942460-e321b92a6cde?ixlib=rb-4.0.3)
  
  Aunque si quieres también puedes ingresar la imagen aquí mismo
  
  ![texto_si_la_imagen_no_carga](https://images.unsplash.com/photo-1593288942460-e321b92a6cde)
  y si eres programador también puedes usar la función de mostrar código de una forma muy sencilla como por ejemplo
  ` +
  "\n```js\nconsole.log('hola mundo')\n```\n" +
  `
  
  y todo esto lo puedes exportar a un archivo html con un solo click puedes abrirlo en tu navegador y compartirlo con tus amigos
  `
