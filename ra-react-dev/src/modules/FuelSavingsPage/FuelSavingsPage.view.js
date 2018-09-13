import React from 'react'
import PropTypes from 'prop-types'
import FuelSavingsForm from '../../components/FuelSavingsForm'

export const FuelSavingsPage = props => {
  return (
    <FuelSavingsForm
      saveFuelSavings={props.actions.saveFuelSavings}
      calculateFuelSavings={props.actions.calculateFuelSavings}
      fuelSavings={props.fuelSavings}
    />
  )
}

FuelSavingsPage.propTypes = {
  actions: PropTypes.object.isRequired,
  fuelSavings: PropTypes.object.isRequired
}
