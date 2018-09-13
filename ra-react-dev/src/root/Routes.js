import React, { Component } from 'react'
import { Switch, Route } from 'react-router-dom'
import FuelSavingsPage from './../modules/FuelSavingsPage'
import AboutPage from './../components/AboutPage'
import NotFoundPage from './../components/NotFoundPage'
import DialogPage from './../modules/Dialog'
import SignIn from './../modules/SignIn'
import { WithAuth, userIsNotAuthenticated } from './Auth'
import AvatarLoaderPage from './../modules/AvatarLoaderPage'

export default class Routes extends Component {
  render () {
    return (
      <Switch>
        <Route exact path='/' component={userIsNotAuthenticated(SignIn)} />
        <WithAuth>
          <Route path='/fuel-savings' component={FuelSavingsPage} />
          <Route path='/about' component={AboutPage} />
          <Route path='/dialog' component={DialogPage} />
          <Route path='/settings' component={AvatarLoaderPage} />
        </WithAuth>
        <Route component={NotFoundPage} />
      </Switch>
    )
  }
}
