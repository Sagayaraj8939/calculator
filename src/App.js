import "./App.css";
import { useReducer } from "react";
import DigitButton from "./components/DigitButton.jsx";
import OperatorButton from "./components/OperatorButton.jsx";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CLEAR: "clear",
  CHOOSE_OPERATOR: "choose-operator",
  EVALUATE: "evaluate",
  DELETE: "delete"
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (
        (payload.digit === "0" && state.currentOperand === "0") ||
        (payload.digit === "." &&
          state.currentOperand !== undefined &&
          state.currentOperand !== null &&
          state.currentOperand.includes("."))
      )
        return state;
      else {
        if (state.overwrite) {
          return {
            ...state,
            overwrite: false,
            currentOperand: `${payload.digit}`
          };
        }
        return {
          ...state,
          currentOperand: `${state.currentOperand || ""}${payload.digit}`
        };
      }

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.CHOOSE_OPERATOR:
      if (state.previousOperand == null && state.currentOperand == null) {
        return state;
      } else if (state.previousOperand == null) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          operator: payload.operator,
          currentOperand: null
        };
      } else if (state.currentOperand == null) {
        if (state.operator1 != null || state.operator1 !== undefined) {
          if (payload.operator === "+" || payload.operator === "-") {
            return {
              ...state,
              operator: payload.operator,
              previousOperand1: null,
              operator1: null,
              previousOperand: evaluate(
                state.previousOperand,
                state.previousOperand1,
                state.operator
              )
            };
          }
          return {
            ...state,
            operator1: payload.operator
          };
        } else {
          return {
            ...state,
            operator: payload.operator
          };
        }
      } else if (payload.operator === "+" || payload.operator === "-") {
        if (
          state.previousOperand1 === null ||
          state.previousOperand1 === undefined
        ) {
          return {
            ...state,
            previousOperand: evaluate(
              state.previousOperand,
              state.currentOperand,
              state.operator
            ),
            operator: payload.operator,
            currentOperand: null
          };
        } else {
          let res = evaluate(
            state.previousOperand1,
            state.currentOperand,
            state.operator1
          );
          return {
            ...state,
            operator: payload.operator,
            previousOperand: evaluate(
              state.previousOperand,
              res,
              state.operator
            ),
            currentOperand: null,
            previousOperand1: null,
            operator1: null
          };
        }
      } else {
        // if (
        //   state.previousOperand.includes("+") ||
        //   state.previousOperand.includes("-")
        if (state.operator1 === "*" || state.operator1 === "/") {
          return {
            ...state,
            previousOperand1: evaluate(
              state.previousOperand1,
              state.currentOperand,
              state.operator1
            ),
            operator1: payload.operator,
            currentOperand: null
          };
        }
        // ) {
        return {
          ...state,
          // previousOperand : state.previousOperand,
          previousOperand1: state.currentOperand,
          operator1: payload.operator,
          currentOperand: null
        };
        // }
        // return { ...state };
      }

    case ACTIONS.EVALUATE:
      if (
        (state.currentOperand != null || state.currentOperand !== undefined) &&
        (state.previousOperand != null || state.currentOperand !== undefined)
      ) {
        return {
          ...state,
          operator: null,
          operator1: null,
          overwrite: true,
          previousOperand: null,
          previousOperand1: null,
          currentOperand: `${
            (state.operator1 == null &&
              evaluate(
                state.previousOperand,
                state.currentOperand,
                state.operator
              )) ||
            evaluate(
              state.previousOperand,
              evaluate(
                state.previousOperand1,
                state.currentOperand,
                state.operator1
              ),
              state.operator
            )
          }`
        };
      } else {
        return state;
      }

    case ACTIONS.DELETE:
      if (state.currentOperand == null || undefined) return state;
      if (state.currentOperand.length === 1 || state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null
        };
      } else {
        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1)
        };
      }
    default:
      return state;
  }
}

function evaluate(previousOperand, currentOperand, operator) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  let result;
  if (isNaN(prev) || isNaN(current)) return;
  else {
    switch (operator) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "*":
        result = prev * current;
        break;
      case "/":
        result = prev / current;
        break;
      default:
    }
    return result.toString();
  }
}

const INTEGER_FORMATTER = new Intl.NumberFormat("hi-IN", {
  max: 0
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (!decimal) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;

  // if(decimal == null) return parseFloat(operand).toLocaleString("hi-IN");
  // return `${parseFloat(integer).toLocaleString("hi-IN")}.${decimal}`
}

export default function App() {
  const [
    { previousOperand, currentOperand, operator, previousOperand1, operator1 },
    dispatch
  ] = useReducer(reducer, {});

  return (
    <div className="App">
      <div className="calculator-grid">
        <div className="output">
          <div className="previous-operand">
            {formatOperand(previousOperand)}
            {operator}
            {formatOperand(previousOperand1)}
            {operator1}
          </div>
          <div className="current-operand">{formatOperand(currentOperand)}</div>
        </div>
        <button
          className="span2"
          onClick={() => {
            dispatch({ type: ACTIONS.CLEAR });
          }}
        >
          AC
        </button>
        {/* <DigitButton digit="1" dispatch={dispatch}/> */}
        <button
          className="DEL"
          onClick={() => dispatch({ type: ACTIONS.DELETE })}
        >
          DEL
        </button>
        <OperatorButton operator="/" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperatorButton operator="*" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperatorButton operator="-" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperatorButton operator="+" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button
          className="span2 equals"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </div>
  );
}
