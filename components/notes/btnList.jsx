import React from "react";
import { motion } from "framer-motion";
import "../../sass/BtnList.scss";
import { v4 } from "uuid";

const BtnList = ({
  type,
  title,
  titleFunctions,
  propsTitle,
  options,
  optionsFunctions,
  propsOptions,
  iteratorOptionsName,
  iteratorOptionsValue,
}) => {
  const [validationTitle, setValidationTitle] = React.useState(true);
  const [validationOptions, setValidationOptions] = React.useState(true);
  const [validationType, setValidationType] = React.useState(true);
  const [stateBtn, setStateBtn] = React.useState("close");

  const validationFunctionsLocal = () => {
    const isObjectTitle =
      typeof title == "string" && typeof titleFunctions == "function";
    const isObjectOptions =
      typeof options == "object" && typeof optionsFunctions == "object";
    const isNull = isObjectTitle && isObjectOptions;

    if (isNull) {
      setValidationTitle(true);
      setValidationOptions(true);
      return;
    }

    if (!isObjectTitle) {
      setValidationTitle(false);
    } else setValidationTitle(true);

    if (!isObjectOptions || options.length != optionsFunctions.length) {
      setValidationOptions(false);
    } else setValidationOptions(true);
  };

  React.useEffect(() => {
    validationFunctionsLocal();
    if (type != "burger" && type != "arrow") setValidationType(false);
    else setValidationType(true);
  }, []);

  if (!validationTitle && !validationOptions) return null;

  return (
    <>
      <motion.div className="tool-general">
        {validationTitle ? (
          <BtnTitle
            title={title}
            functions={titleFunctions}
            setStateBtn={setStateBtn}
            propsTitle={propsTitle}
          />
        ) : null}

        {validationOptions && validationType ? (
          <Options
            type={type}
            options={options}
            functions={optionsFunctions}
            stateBtn={stateBtn}
            setStateBtn={setStateBtn}
            propsOptions={propsOptions}
            iteratorOptionsName={iteratorOptionsName}
            iteratorOptionsValue={iteratorOptionsValue}
          />
        ) : null}
      </motion.div>
    </>
  );
};

export default BtnList;

const BtnTitle = ({ title, functions, setStateBtn, propsTitle }) => {
  const click = () => {
    setStateBtn("close");
    functions(propsTitle);
  };

  return (
    <motion.button
      layout
      className="title-content"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 0.97 }}
      animate={{ scale: 1 }}
      onClick={click}
      dangerouslySetInnerHTML={{ __html: title }}
    ></motion.button>
  );
};

const Options = ({
  type,
  options,
  functions,
  stateBtn,
  setStateBtn,
  propsOptions,
  iteratorOptionsName,
  iteratorOptionsValue,
}) => {
  const changeStateBtn = () => {
    setStateBtn(stateBtn === "close" ? "open" : "close");
  };
  const functionality = (useFunction, i) => {
    setStateBtn("close");
    if (iteratorOptionsValue && propsOptions)
      useFunction(propsOptions[i][iteratorOptionsValue]);
    else if (propsOptions != "object") useFunction(propsOptions);
  };
  const insertOptions = () => {
    const html = [];
    for (let i = 0; i < options.length; i++) {
      html.push(
        <motion.div
          variants={li_hidden}
          className="li-hidden"
          onClick={() => functionality(functions[i], i)}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 0.97 }}
          dangerouslySetInnerHTML={{
            __html: iteratorOptionsName
              ? options[i][iteratorOptionsName]
              : options[i],
          }}
          key={v4()}
        ></motion.div>,
      );
    }
    return html;
  };

  const insertTypeBtn = () => {
    const html = [];
    if (type == "burger")
      html.push(
        <Burger
          stateBtn={stateBtn}
          changeStateBtn={changeStateBtn}
          key={v4()}
        />,
      );
    if (type == "arrow")
      html.push(
        <Arrow
          stateBtn={stateBtn}
          changeStateBtn={changeStateBtn}
          key={v4()}
        />,
      );
    return html;
  };

  return (
    <>
      <motion.div
        variants={options_content}
        initial={false}
        animate={stateBtn}
        className="options-content"
        onClick={changeStateBtn}
      >
        {insertTypeBtn()}

        {options ? (
          <motion.div
            variants={hidden_content}
            style={{ pointerEvents: stateBtn == "open" ? "auto" : "none" }}
            className="ul-hidden"
          >
            {insertOptions()}
          </motion.div>
        ) : null}
      </motion.div>
    </>
  );
};

const Burger = ({ stateBtn, changeStateBtn }) => {
  return (
    <motion.button
      layout
      variants={burger}
      onBlur={changeStateBtn}
      className="burger-content"
      onClick={changeStateBtn}
      whileTap={{ scale: 0.97 }}
    >
      <motion.div
        layout
        variants={sub_burger}
        animate={stateBtn}
        initial={"close"}
        custom={1}
        className="burger-filling"
      ></motion.div>
      <motion.div
        layout
        variants={sub_burger}
        animate={stateBtn}
        initial={"close"}
        custom={2}
        className="burger-filling"
      ></motion.div>
      <motion.div
        layout
        variants={sub_burger}
        animate={stateBtn}
        initial={"close"}
        custom={3}
        className="burger-filling"
      ></motion.div>
    </motion.button>
  );
};

const Arrow = ({ stateBtn, changeStateBtn }) => {
  return (
    <motion.button
      layout
      variants={arrow}
      className="arrow-content"
      onClick={changeStateBtn}
      onBlur={changeStateBtn}
      whileTap={{ scale: 0.97 }}
    >
      <motion.div
        layout
        variants={sub_arrow}
        animate={stateBtn}
        initial={"close"}
        custom={1}
        className="arrow-filling"
      ></motion.div>
      <motion.div
        layout
        variants={sub_arrow}
        animate={stateBtn}
        initial={"close"}
        custom={2}
        className="arrow-filling"
      ></motion.div>
    </motion.button>
  );
};

// contenedor de las opciones del botón
const options_content = {
  close: {
    width: "40px",
    height: "40px",
  },
  open: {
    width: "auto",
  },
};
// animaciones del botón hamburguesa
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
    width: "70%",
    height: "15%",
  },
};
// animaciones del botón flecha
const arrow = {
  open: {},
  close: {
    minWidth: "40px",
    minHeight: "40px",
  },
};
const sub_arrow = {
  open: type => {
    switch (type) {
      case 1: {
        return {
          width: "70%",
          height: "15%",
          rotate: "45deg",
          x: "-14%",
          y: "80%",
          scaleX: 0.5,
        };
      }
      case 2: {
        return {
          width: "70%",
          height: "15%",
          rotate: "-45deg",
          x: "14%",
          y: "-130%",
          scaleX: 0.5,
        };
      }
    }
  },
  close: type => {
    switch (type) {
      case 1: {
        return {
          width: "70%",
          height: "15%",
          rotate: "-45deg",
          x: "-14%",
          y: "80%",
          scaleX: 0.5,
        };
      }
      case 2: {
        return {
          width: "70%",
          height: "15%",
          rotate: "45deg",
          x: "14%",
          y: "-130%",
          scaleX: 0.5,
        };
      }
    }
  },
};
// animaciones de los elementos desplegables
const hidden_content = {
  open: {
    clipPath: "inset(0% 0% 0% 0% round 10px)",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.7,
      delayChildren: 0.3,
      staggerChildren: 0.05,
    },
  },
  close: {
    clipPath: "inset(10% 50% 90% 50% round 10px)",
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
    },
  },
};
const li_hidden = {
  open: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  close: { opacity: 0, y: 20, transition: { duration: 0.2 } },
};
