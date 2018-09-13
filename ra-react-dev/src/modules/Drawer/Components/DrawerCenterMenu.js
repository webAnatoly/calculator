import React, { Component } from 'react'
import Divider from 'material-ui/Divider'
import List from 'material-ui/List'
import { withStyles } from 'material-ui/styles'
import { styles } from '../theme'
import DrawerMenuItem from './DrawerMenuItem'

export class CenterBlock extends Component {
  render () {
    const { classes, opened, toggleDrawer, items } = this.props

    return (
      <div className={classes.flexCenter}>
        <List
          className={classes.centerList}
          onClick={() => (opened ? toggleDrawer() : null)}
        >
          {items.map(item => (
            <DrawerMenuItem key={`center_${item.label}`} {...item} />
          ))}
        </List>
        <Divider />
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(CenterBlock)
