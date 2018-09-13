import createReducer from '../../utils/createReducer'

export const DrawerState = {
  opened: false,
  showedHiddenBlock: false
}

const TOGGLE_DRAWER = 'TOGGLE_DRAWER'
const TOGGLE_HIDDEN_BLOCK = 'TOGGLE_HIDDEN_BLOCK'

const drawerReducer = {
  [TOGGLE_DRAWER]: state => ({ ...state, opened: !state.opened }),
  [TOGGLE_HIDDEN_BLOCK]: state => ({
    ...state,
    showedHiddenBlock: !state.showedHiddenBlock
  })
}

export const toggleDrawer = () => ({
  type: TOGGLE_DRAWER
})

const toggleHiddenBlock = () => ({
  type: TOGGLE_HIDDEN_BLOCK
})

export const drawerActions = {
  toggleDrawer,
  toggleHiddenBlock
}

export const drawerState = createReducer(drawerReducer, DrawerState)
