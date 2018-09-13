import log from '../../utils/log'

export default async ({ payload = {}, emitAction, db, sessionData }) => {
  let buyersList
  try {
    /* waits for resolving of promise and writes here result like in .then */
    buyersList = await db.model('Buyers').find({})
    // usersList = await db.model('Users').find({})
  } catch (error) {
    emitAction('SNACK', {
      message: 'Something went wrong...'
    })
    log.err(error)
  }
  emitAction('BUYERS_LIST', { buyersList, canLoadMore: false })
  // emitAction('USERS_LIST', {usersList, 'canLoadMore':false})
}
