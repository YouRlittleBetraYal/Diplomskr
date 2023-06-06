import React, { useReducer, useEffect } from "react";
import "./_inputStyles.scss";
const INPUT_CHANGE = "INPUT_CHANGE";
const INPUT_BLUR = "INPUT_BLUR";

const inputReducer = (state, action) => {

  switch (action.type) {
    case INPUT_CHANGE: 
      return {
        ...state,
        value: action.value,
        isValid: action.isValid,
      };
    case INPUT_BLUR: 
      return {
        ...state,
        touched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialvalue ? props.initialvalue : "", 
    isValid: props.initiallyvalid,
    touched: false,
  });

  const { inputchange, id, Icon } = props; 

  useEffect(() => {
    if (inputState.touched) {
      inputchange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, inputchange, id]);

  const textChangeHandler = (chnageprop) => {
    const text = chnageprop.target.value;

 
    const emailRegex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // Email formatt is correct or not
    let isValid = true;
    if (props.required && text.trim().length === 0) {
 
      isValid = false; 
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
    
      isValid = false; 
    }
    if (props.max != null && +text > props.max) {
      
      isValid = false; 
    }
    if (props.minLength != null && text.length < props.minLength) {
      
      isValid = false; 
    }
    dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid });
  };

  const lostFocusHandler = () => {

    dispatch({ type: INPUT_BLUR }); 
  };

  return (
    <>
      <div className="Custom_Input">
        <div className="icon">
          <Icon size={18} />
        </div>
        {props.textarea ? (
          <textarea
            required
            autoFocus
            placeholder={props.label}
            value={inputState.value}
            onBlur={lostFocusHandler}
            onChange={textChangeHandler}
            className="flex-grow-1"
          />
        ) : (
          <input
            required
            type={props.type}
            value={inputState.value}
            onChange={textChangeHandler}
            onBlur={lostFocusHandler}
            placeholder={props.label}
          />
        )}
      </div>
      {!inputState.isValid && inputState.touched && (
        <div className="errorContainer">
          <strong>будьласка введіть правильну назву {id}</strong>
        </div>
      )}
    </>
  );
};

export default Input;
