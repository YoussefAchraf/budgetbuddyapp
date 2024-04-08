// UsrInpt.js
import React from 'react';
import Styles from "./UsrInpt.module.css";

const UsrInpt = (props) => {
  return(
    <div className={Styles.UsrInpt }>
      <div className={Styles.InptZone}>
        <input 
          type={props.InptTp}
          id={props.InptId}
          placeholder=" "
          value={props.value} 
          onChange={props.onChange} 
        />
        <label 
          className={Styles.label}
          htmlFor={props.InptId}
        >
          {props.InptLb}
        </label>
      </div>
      {props.error && <div className={Styles.ErrMsg}>{props.error}</div>}
    </div>
  );
}

export default UsrInpt;
