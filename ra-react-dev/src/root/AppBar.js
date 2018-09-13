import React, { Component } from 'react'
import { connect } from 'react-redux'
import { drawerActions } from '../modules/Drawer/Drawer.state'
import { withStyles } from 'material-ui/styles'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Typography from 'material-ui/Typography'
import IconButton from 'material-ui/IconButton'
import MenuIcon from 'material-ui-icons/Menu'
import Hidden from 'material-ui/Hidden'
import Drawer from './../modules/Drawer/Drawer.container'
import { appBar as styles } from './theme'
import { bindActionCreators } from 'redux'

class AppBarComponent extends Component {
  render () {
    const { classes, drawerActions, opened, isLoggedIn } = this.props
    const { toggleDrawer } = drawerActions
    const icon = opened ? null : (
      <Hidden mdUp>
        <IconButton
          color='contrast'
          aria-label='open drawer'
          onClick={toggleDrawer}
          className={classes.navIconHide}
        >
          <MenuIcon />
        </IconButton>
      </Hidden>
    )
    return (
      <div>
        <AppBar className={!opened ? classes.appBarFull : classes.appBar}>
          <Toolbar>
            {isLoggedIn && icon}
            <Typography type='title' color='inherit' className={classes.flex}>
              Title
            </Typography>
          </Toolbar>
        </AppBar>
        {isLoggedIn && <Drawer />}
      </div>
    )
  }
}

export default withStyles(styles)(
  connect(
    ({ drawerState: { opened }, session: { isLoggedIn } }) => ({
      opened,
      isLoggedIn
    }),
    dispatch => ({
      drawerActions: bindActionCreators(drawerActions, dispatch)
    })
  )(AppBarComponent)
)
