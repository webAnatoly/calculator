/* eslint-disable flowtype/require-valid-file-annotation */

import React, { Component } from 'react'
import Header from './Components/DrawerHeader'
import HiddenMenu from './Components/DrawerHiddenMenu'
import CenterMenu from './Components/DrawerCenterMenu'
import BottomMenu from './Components/DrawerBottomMenu'
import { withStyles } from 'material-ui/styles'
import Drawer from 'material-ui/Drawer'
import Hidden from 'material-ui/Hidden'
import { styles } from './theme'

import HomeIcon from 'material-ui-icons/Home'
import DeleteIcon from 'material-ui-icons/Delete'
import HelpIcon from 'material-ui-icons/HelpOutline'
import FeaturedVideoIcon from 'material-ui-icons/FeaturedVideo'
import ExitToAppIcon from 'material-ui-icons/ExitToApp'
import SettingsIcon from 'material-ui-icons/Settings'

export class ResponsiveDrawer extends Component {
  constructor (props) {
    super(props)
    const { push, signOut } = props
    this.menuItems = {
      center: [
        {
          label: 'Home',
          Icon: HomeIcon,
          onClick: () => push('/')
        },
        {
          label: 'Demo app',
          Icon: DeleteIcon,
          onClick: () => push('/fuel-savings')
        },
        {
          label: 'About',
          Icon: HelpIcon,
          onClick: () => push('/about')
        },
        {
          label: 'Dialog',
          Icon: FeaturedVideoIcon,
          onClick: () => push('/dialog')
        }
      ],
      bottom: [
        {
          label: 'Sign out',
          Icon: ExitToAppIcon,
          onClick: () => signOut()
        }
      ],
      hidden: [
        {
          label: 'Settings',
          Icon: SettingsIcon,
          onClick: () => push('/settings')
        }
      ]
    }
  }

  render () {
    const { classes, drawerActions, drawerState } = this.props
    const { toggleDrawer, toggleHiddenBlock } = drawerActions
    const { showedHiddenBlock, opened } = drawerState

    const drawer = (
      <div className={classes.flexWrapper}>
        <Header
          toggleHiddenBlock={toggleHiddenBlock}
          primary='Name Surname'
          secondary='surname@gmail.com'
        />

        {showedHiddenBlock ? (
          <HiddenMenu
            opened={opened}
            toggleDrawer={toggleDrawer}
            items={this.menuItems.hidden}
          />
        ) : null}

        <CenterMenu
          opened={opened}
          toggleDrawer={toggleDrawer}
          items={this.menuItems.center}
        />

        <BottomMenu
          opened={opened}
          toggleDrawer={toggleDrawer}
          items={this.menuItems.bottom}
        />
      </div>
    )

    return (
      <div>
        <Hidden>
          <Drawer
            type='temporary'
            open={opened}
            classes={{
              paper: opened ? classes.drawerPaperDis : classes.drawerPaper
            }}
            onRequestClose={() => {
              if (showedHiddenBlock) {
                toggleHiddenBlock()
              }
              return toggleDrawer()
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden mdDown implementation='css'>
          <div className={opened ? classes.insideHide : classes.inside} />
          <Drawer
            type='persistent'
            open={!opened}
            classes={{
              paper: opened ? classes.drawerPaperDis : classes.drawerPaper
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer)
