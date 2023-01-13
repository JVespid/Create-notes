import React, { createContext, useReducer } from "react";
import { globalContext } from "./context";
import { v4 as uuidv4 } from "uuid";

const methods = {
  RESET_GLOBAL_SATE: `RESET_GLOBAL_SATE`,
  GET_GLOBAL_SATE: `GET_GLOBAL_SATE`,
  CHANGE_GLOBAL_SATE: `CHANGE_GLOBAL_SATE`,
};

//export const globalContext = createContext();

const GlobalState = ({ children }) => {
  const InitialState = {
    pageMain: {
      pages: [
        { id: uuidv4(), type: "mainPage", name: `Inicio`, href: `/` },
        { id: uuidv4(), type: "notesPage", name: `Notes`, href: `/Notes` },
        {
          id: uuidv4(),
          type: "manageSessionPage",
          name: `Inicia sesión`,
          href: `/Session`,
        },
      ],
    },
    changes: {},
    tools: [
      {
        id: uuidv4(),
        name: "heading",
        value: "#",
        link: "https://jvespid.github.io/apis/todoList/img/svg/heading.svg",
        data: [
          { id: uuidv4(), html: "<h1>Heading</h1>", value: "#" },
          { id: uuidv4(), html: "<h2>Heading</h2>", value: "##" },
          { id: uuidv4(), html: "<h3>Heading</h3>", value: "###" },
          { id: uuidv4(), html: "<h4>Heading</h4>", value: "####" },
          { id: uuidv4(), html: "<h5>Heading</h5>", value: "#####" },
          { id: uuidv4(), html: "<h6>Heading</h6>", value: "######" },
        ],
      },
      {
        id: uuidv4(),
        name: "uList",
        value: "-",
        link: "https://jvespid.github.io/apis/todoList/img/svg/list.svg",
        data: [
          {
            id: uuidv4(),
            //html: `<img class="img-list" src="https://jvespid.github.io/apis/todoList/img/svg/list.svg" alt="imagen de lista no ordenada" />`,
            html: `
            <ul>
              <li>Lista no ordenada</li>
            </ul>
            `,
            value: "-",
          },
          {
            id: uuidv4(),
            //html: `<img class="img-list-sub" src="https://jvespid.github.io/apis/todoList/img/svg/subList.svg" alt="imagen de sub lista no ordenada" />`,
            html: `
            <ul>
              <ul>
                <li>Sublista no ordenada</li>
              </ul>
            </ul>`,
            value: "\n  -",
          },
          {
            id: uuidv4(),
            //html: `<img class="img-list-check" src="https://jvespid.github.io/apis/todoList/img/svg/checkList.svg" alt="imagen de check lista no ordenada" />`,
            html: `
            <ul>
              <li>  <input disabled="" type="checkbox"> check list</li>
            </ul>
            `,
            value: "\n- [ ]",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "oList",
        value: "1.",
        link: "https://jvespid.github.io/apis/todoList/img/svg/orderList.svg",
        data: [
          {
            id: uuidv4(),
            //html: `<img class="img-list" src="https://jvespid.github.io/apis/todoList/img/svg/orderList.svg" alt="imagen de lista no ordenada" />`,
            html: `
            <ol>
              <li>Lista ordenada</li>
            </ol>
            `,
            value: "1.",
          },
          {
            id: uuidv4(),
            //html: `<img class="img-list-sub" src="https://jvespid.github.io/apis/todoList/img/svg/subList.svg" alt="imagen de sub lista no ordenada" />`,
            html: `
            <ol>
              <ul>
                <li>Sublista ordenada</li>
              </ul>
            </ol>`,
            value: "\n  -",
          },
          {
            id: uuidv4(),
            //html: `<img class="img-list-check" src="https://jvespid.github.io/apis/todoList/img/svg/checkList.svg" alt="imagen de check lista no ordenada" />`,
            html: `
            <ol>
              <li>  <input disabled="" type="checkbox"> check list</li>
            </ol>
            `,
            value: "\n1. [ ]",
          },
        ],
      },
      {
        id: uuidv4(),
        name: "bold",
        value: "**",
        link: "https://jvespid.github.io/apis/todoList/img/svg/bold.svg",
        data: [],
      },
      {
        id: uuidv4(),
        name: "italic",
        value: "*",
        link: "https://jvespid.github.io/apis/todoList/img/svg/italik.svg",
        data: [],
      },
      {
        id: uuidv4(),
        name: "citas",
        value: ">",
        link: "https://jvespid.github.io/apis/todoList/img/svg/citas.svg",
        data: [],
      },
      {
        id: uuidv4(),
        name: "code",
        value: "```",
        link: "https://jvespid.github.io/apis/todoList/img/svg/code.svg",
        data: [],
      },
      {
        id: uuidv4(),
        name: "link",
        value: "[]()",
        link: "https://jvespid.github.io/apis/todoList/img/svg/link.svg",
        data: [],
      },
      {
        id: uuidv4(),
        name: "img",
        value: "![]()",
        link: "https://jvespid.github.io/apis/todoList/img/svg/img.svg",
        data: [],
      },
      {
        id: uuidv4(),
        name: "table",
        value: "***",
        link: "https://jvespid.github.io/apis/todoList/img/svg/table.svg",
        data: [],
      },
    ],

    GroupsAndNotes: [
      {
        id: uuidv4(),
        nameGroup: `name-group`,
        notes: [{ title: "", contentMD: "", contentHtml: "" }],
      },
    ],
  };

  const [state, dispatch] = useReducer(LocalReducer, InitialState);

  // ejemplo de como se puede usar el dispatch -- borrar
  const changeState = DATA_ => {
    dispatch({
      type: methods.CHANGE_GLOBAL_SATE,
      payload: DATA_,
    });
  };

  const resetGlobalState = () => {
    const initialState = InitialState;
    dispatch({
      type: methods.RESET_GLOBAL_SATE,
      payload: initialState,
    });
  };

  return (
    <globalContext.Provider
      value={{
        state,
        pageMain: state.pageMain,
        tools: state.tools,
        changeState,
        resetGlobalState,
      }}
    >
      <>{children}</>
    </globalContext.Provider>
  );
};

export default GlobalState;

const LocalReducer = (state, action) => {
  const { payload, type } = action;

  switch (type) {
    case methods.CHANGE_GLOBAL_SATE: {
      return {
        changes: payload,
        ...state,
      };
    }
    case methods.RESET_GLOBAL_SATE: {
      return {
        ...state,
        ...payload,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};
