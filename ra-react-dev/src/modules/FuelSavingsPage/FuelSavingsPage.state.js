import {
  SAVE_FUEL_SAVINGS,
  CALCULATE_FUEL_SAVINGS
} from '../../redux/actionTypes'
import calculator from '../../utils/fuelSavingsCalculator'
import objectAssign from 'object-assign'
import { getFormattedDateTime } from '../../utils/dateHelper'
import { fuelSavings } from '../../redux/initialState'

// IMPORTANT: Note that with Redux, state should NEVER be changed.
// State is considered immutable. Instead,
// create a copy of the state passed and set new values on the copy.
// Note that I'm using Object.assign to create a copy of current state
// and update values on the copy.
export default function fuelSavingsReducer (state = fuelSavings, action) {
  let newState

  switch (action.type) {
    case SAVE_FUEL_SAVINGS:
      // For this example, just simulating a save by changing date modified.
      // In a real app using Redux, you might use redux-thunk and handle the async call in fuelSavingsActions.js
      return objectAssign({}, state, { dateModified: action.dateModified })

    case CALCULATE_FUEL_SAVINGS:
      newState = objectAssign({}, state)
      newState[action.fieldName] = action.value
      newState.necessaryDataIsProvidedToCalculateSavings = calculator().necessaryDataIsProvidedToCalculateSavings(
        newState
      )
      newState.dateModified = action.dateModified

      if (newState.necessaryDataIsProvidedToCalculateSavings) {
        newState.savings = calculator().calculateSavings(newState)
      }

      return newState

    default:
      return state
  }
}

/* FUEL SAVINGS ACTIONS */

// example of a thunk using the redux-thunk middleware
export function saveFuelSavings (settings) {
  return function (dispatch) {
    // thunks allow for pre-processing actions, calling apis, and dispatching multiple actions
    // in this case at this point we could call a service that would persist the fuel savings
    return dispatch({
      type: SAVE_FUEL_SAVINGS,
      dateModified: getFormattedDateTime(),
      settings
    })
  }
}

export function calculateFuelSavings (settings, fieldName, value) {
  return {
    type: CALCULATE_FUEL_SAVINGS,
    dateModified: getFormattedDateTime(),
    settings,
    fieldName,
    value
  }
}

export const actions = {
  saveFuelSavings,
  calculateFuelSavings
}
