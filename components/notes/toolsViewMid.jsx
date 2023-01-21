import React from "react";
import { globalContext } from "../../context/global/context";
import "../../sass/toolsViewMid.scss";

const ToolsViewMid = ({ actionCssView }) => {
  const { btn_pageNotes_viewport } = React.useContext(globalContext);
  return (
    <>
      <div className={`tools-views `}>
        <div className="content-data-t-views">
          {btn_pageNotes_viewport
            ? btn_pageNotes_viewport.map(item => (
                <img
                  src={item.src}
                  className="item"
                  key={item.id}
                  onClick={() => actionCssView(item.action)}
                />
              ))
            : null}
        </div>
      </div>
    </>
  );
};

export default ToolsViewMid;
