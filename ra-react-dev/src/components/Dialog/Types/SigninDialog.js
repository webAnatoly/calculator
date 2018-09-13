import React, { Component } from 'react'
import TextField from 'material-ui/TextField'
import {
  DialogActions,
  DialogContent,
  DialogContentText
} from 'material-ui/Dialog'
import Button from 'material-ui/Button'

class SigninDialog extends Component {
  render () {
    const { dialogProps, actions } = this.props

    return (
      <div>
        <DialogContent>
          <DialogContentText>{dialogProps.title}</DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Email Address'
            type='email'
            fullWidth
          />
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Password'
            type='email'
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={actions.hideDialog} color='primary'>
            Cancel
          </Button>
          <Button onClick={actions.hideDialog} color='primary'>
            Log in
          </Button>
        </DialogActions>
      </div>
    )
  }
}

export default SigninDialog
