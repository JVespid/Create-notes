import React from "react";
import "../../sass/main.scss";

const Main = ({ setVisible }) => {
  React.useEffect(() => {
    setVisible(true);
  }, []);
  return (
    <>
      <MainComponent />
    </>
  );
};

export default Main;
// subcomponentes  de la pagina main

const MainComponent = () => {
  return (
    <>
      <header className="header">
        <div className="text">
          <h2>Todo List </h2>
          <h3> Descripción: </h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis
            optio voluptatum repellendus voluptas nulla velit consectetur enim,
            soluta quia tempore itaque, ea dicta alias minima? Deserunt debitis
            deleniti vel blanditiis. Tempora dolorum commodi a at doloribus
            molestias ad dignissimos earum sapiente, modi explicabo adipisci
            perferendis quas sequi quia voluptates accusantium maxime dolore nam
            iusto libero laudantium neque. Ex, provident sunt? Ut magnam, alias
            porro laboriosam, unde quasi vitae ullam ea, perspiciatis laudantium
            non? Recusandae exercitationem reprehenderit autem sit est incidunt.
            Magni veniam rem rerum inventore deleniti! Ad ea facilis laudantium.
          </p>
        </div>
        <div className="img">
          <img src="#" alt="imagen de fondo de presentación" />
        </div>
      </header>
      <main className="main">
        <section className="instructions">
          <h2>como usar la app</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem eum
            hic sequi officia cupiditate nesciunt quae, harum dicta voluptatum
            voluptatibus nihil, praesentium quam rerum est. Nam quod
            necessitatibus nesciunt deserunt! Nemo repellendus, eaque esse
            quaerat fugit ea minus, error voluptatem at expedita obcaecati.
            Mollitia ad, numquam quaerat sunt placeat odio, quam, expedita a
            quidem rem distinctio ea laudantium adipisci quas! Id non ab,
            cupiditate esse, veritatis modi eveniet eum assumenda voluptatibus
            ullam repellat laudantium nostrum quisquam odit minus nobis magnam
            beatae inventore in natus doloribus molestias repellendus hic sunt!
            Amet.
          </p>
        </section>

        <h1 id="bienvenido-al-chat">Bienvenido al chat</h1>
        <p>
          {" "}
          Escribe lo que quieras con el formato que <strong>quieras</strong> por
          ejemplo:
        </p>
        <ul>
          <li>
            Una lista de tareas
            <ul>
              <li>
                Esta puede tener mas opciones como{" "}
                <strong>
                  <em>sub listas</em>
                </strong>
              </li>
              <li>
                <input disabled="" type="checkbox" /> Listas de tipo{" "}
                <strong>
                  <em>check</em>
                </strong>
                O también puedes ordenar pendientes con las listas ordenadas;
                ejemplo:
              </li>
            </ul>
          </li>
        </ul>
        <ol>
          <li>Tarea 1</li>
          <li>Tarea 2</li>
        </ol>
        <p> También puedes citar a alguien</p>
        <blockquote>
          <p>Cita de juan peres &quot;el fin de todo es el limite&quot;</p>
        </blockquote>
        <p>
          {" "}
          Aunque si quieres hacer una pagina informativa, también puedes hacer
          links dinámicos
        </p>
        <p>
          {" "}
          <a href="https://images.unsplash.com/photo-1593288942460-e321b92a6cde?ixlib=rb-4.0.3">
            aquí_escribe_cualquier_texto
          </a>
        </p>
        <p> Aunque si quieres también puedes ingresar la imagen aquí mismo</p>
        <p>
          {" "}
          <img
            src="https://images.unsplash.com/photo-1593288942460-e321b92a6cde"
            alt="texto_si_la_imagen_no_carga"
          />
          y si eres programador también puedes usar la función de mostrar código
          de una forma muy sencilla como por ejemplo
        </p>
        <pre>
          <code>console.log(&#39;hola mundo&#39;)</code>
        </pre>
        <p>
          {" "}
          y todo esto lo puedes exportar a un archivo html con un solo click
          puedes abrirlo en tu navegador y compartirlo con tus amigos
        </p>
      </main>
    </>
  );
};
