import {ACTIONS} from "../App.js"

export default function OperatorButton({operator, dispatch}) {
    return  <button onClick={()=>dispatch({type : ACTIONS.CHOOSE_OPERATOR, payload : {operator}})}>{operator}</button>
}