import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { FuelSavingsPage } from './FuelSavingsPage.view'
import { actions } from './FuelSavingsPage.state'

export default connect(
  state => ({
    fuelSavings: state.fuelSavings
  }),
  dispatch => ({
    actions: bindActionCreators(actions, dispatch)
  })
)(FuelSavingsPage)
