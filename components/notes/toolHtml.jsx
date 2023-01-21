import React from "react";
import { motion } from "framer-motion";
import "../../sass/toolHtml.scss";

const ToolHtml = ({ refSelect, changeStyle, socket }) => {
  const [stateBurger, setStateBurger] = React.useState("close");

  const changeStateBurger = () => {
    setStateBurger(stateBurger === "close" ? "open" : "close");
  };
  return (
    <>
      <div className="tool-html">
        <div className="content-select">
          <select
            name="type_css"
            id="typeCss"
            onChange={changeStyle}
            ref={refSelect}
          >
            <option value="1">estilo 1</option>
            <option value="2">estilo 2</option>
            <option value="3">estilo 3</option>
            <option value="4">estilo 4</option>
          </select>
        </div>

        <motion.div
          variants={burger_content}
          initial={"close"}
          animate={stateBurger}
          className="close-btn-html"
        >
          <motion.button
            layout
            variants={burger}
            initial={"close"}
            animate={stateBurger}
            className="burger-content"
            onClick={changeStateBurger}
          >
            <motion.div
              layout
              variants={sub_burger}
              animate={stateBurger}
              initial={"close"}
              custom={1}
              className="burger-filling"
            ></motion.div>
            <motion.div
              layout
              variants={sub_burger}
              animate={stateBurger}
              initial={"close"}
              custom={2}
              className="burger-filling"
            ></motion.div>
            <motion.div
              layout
              variants={sub_burger}
              animate={stateBurger}
              initial={"close"}
              custom={3}
              className="burger-filling"
            ></motion.div>
          </motion.button>

          <motion.ul
            layout
            variants={hidden_content}
            animate={stateBurger}
            initial={"close"}
            className="hidden"
          >
            <motion.li
              layout
              variants={li_hidden}
              animate={stateBurger}
              initial={"close"}
              custom={"change-id"}
              className="li-hidden"
            >
              <motion.button layout className="change-id">
                Cambiar id
              </motion.button>
            </motion.li>

            <motion.li
              layout
              variants={li_hidden}
              animate={stateBurger}
              initial={"close"}
              custom={"what-is-id"}
              className="li-hidden"
            >
              <motion.button layout className="what-is-id">
                ¿Para que sirve el id?
              </motion.button>
            </motion.li>

            <motion.li
              layout
              variants={li_hidden}
              animate={stateBurger}
              initial={"close"}
              custom={"download"}
              className="li-hidden"
            >
              <motion.button className="download">Descargar</motion.button>
            </motion.li>
          </motion.ul>
        </motion.div>
      </div>
    </>
  );
};

export default ToolHtml;

// animaciones del botón hamburguesa
const burger_content = {
  close: {
    width: "40px",
    height: "40px",
  },
  open: {
    width: "auto",
  },
};
const burger = {
  open: {},
  close: {
    minWidth: "40px",
    minHeight: "40px",
  },
};

const sub_burger = {
  open: type => {
    switch (type) {
      case 1: {
        return {
          y: "50%",
          height: "0%",
        };
      }
      case 2: {
        return {
          rotate: "45deg",
          x: "0%",
          y: "50%",
        };
      }
      case 3: {
        return {
          rotate: "-45deg",
          x: "0%",
          y: "-150%",
        };
      }
    }
  },
  close: {
    width: "100%",
    height: "15%",
  },
};

// animaciones de los elementos desplegables del botón hamburguesa
const hidden_content = {
  open: {},
  close: {},
};

const li_hidden = {
  open: type => {
    switch (type) {
      case "change-id": {
        return {};
      }
      case "what-is-id": {
        return {};
      }
      case "download": {
        return {};
      }
    }
  },
  close: {
    width: "100%",
    height: "15%",
  },
};
