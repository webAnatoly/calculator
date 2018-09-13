import { connect } from 'react-redux'
import Drawer, { drawerWidth } from './Drawer.view'
import { drawerActions } from './Drawer.state'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import { signOut } from '../../redux/sessionState'

export { drawerWidth }
export default connect(
  ({ drawerState, session }) => ({
    drawerState
  }),
  dispatch => ({
    drawerActions: bindActionCreators(drawerActions, dispatch),
    push: bindActionCreators(push, dispatch),
    signOut: bindActionCreators(signOut, dispatch)
  })
)(Drawer)
