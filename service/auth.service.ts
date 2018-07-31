import { Injectable } from '@angular/core'
import { SyncService } from './sync.service'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public account
  constructor (public syncService: SyncService) {
    this.account = Logic.account
    Helpers.bind = syncService.bind
    Helpers.remote = syncService.remote
    Helpers.local = syncService.local
  }

  public async isAuthenticated () {
    const prefix = `authService.isAuthenticated()`
    const session = await Logic.account.session()
    const isAuth = session.userCtx.name !== null
    if (Helpers.initial && isAuth) {
      await Helpers.bind('userdb-' + hexEncode(session.userCtx.name))
      Helpers.initial = false
    }
    return isAuth
  }
}

namespace Helpers {
  export let remote
  export let local
  export let bind
  export let initial = true
}

const hexEncode = (str: any) => {
  // utf8 to latin1
  var s = unescape(encodeURIComponent(str))
  var h = ''
  for (let i = 0; i < s.length; i++) h += s.charCodeAt(i).toString(16)

  return h
}
namespace Logic {
  export const account = {
    signUp: (username: string, password: string, meta: {} = {}) => {
      const prefix = `authService.account.signUp( name: ${ username }, password: *** )`
      return Helpers.remote.signUp(username, password, meta, (err, res) => {
        if (err)
          if (err.name === 'conflict') {
            console.warn(prefix, err.name, err)
          } else if (err.name === 'forbidden') {
            console.warn(prefix, err.name, err)
          } else {
            // HTTP error, cosmic rays, etc.
            console.error(prefix, err.name, err)
          }

        return res
      })
    },
    signIn: (username: string, password: string) => {
      const prefix = `authService.account.signIn( name: ${ username }, password: *** )`
      return Helpers.remote.logIn(username, password, (err, res) => {
        if (err)
          if (err.name === 'unauthorized' || err.name === 'forbidden') {
            console.warn(prefix, err.name, err)
          } else {
            console.error(prefix, err.name, err)
          }

        return res
      })
    },
    signOut: () => {
      const prefix = `authService.account.signOut( )`
      return Helpers.remote.logOut((err, res) => {
        if (err) console.error(prefix, err.name, err)
        else
          Helpers.initial = true


        return res
      })
    },
    session: () => {
      const prefix = `authService.account.session( )`
      return Helpers.remote.getSession((err, res) => {
        if (err) console.error(prefix, err.name, err)
        else if (!res.userCtx.name)
          console.warn(prefix, 'No user authenticated')

        return res
      })
    },
    authenticated: () => {
      const prefix = `authService.account.authenticated( )`
      return Logic.account.session().then(data => data.userCtx.name !== null)
    },
    user: (username: string) => {
      const prefix = `authService.account.user( name: ${ username } )`
      return Helpers.remote.getUser(username, (err, res) => {
        if (err)
          if (err.name === 'not_found') {
            console.warn(prefix, err.name, err)
          } else {
            console.error(prefix, err.name, err)
          }

        return res
      })
    },
    changeMeta: (username: string, meta: [string]) => {
      const prefix = `authService.account.updateMeta( name: ${ username }, meta: ${ JSON.stringify(meta) })`
      return Helpers.remote.putUser(
        username,
        {
          metadata: meta,
        },
        (err, res) => {
          if (err) console.error(prefix, err.name, err)

          return res
        }
      )
    },
    changePassword: (name: string, password: string) => {
      const prefix = `authService.account.changePassword( name: ${ name }, password: *** })`
      Helpers.remote.changePassword(name, password, (err, res) => {
        if (err)
          if (err.name === 'not_found') {
            console.error(prefix, err.name, err)
          } else {
            console.error(prefix, err.name, err)
          }

        return res
      })
    },
    changeUsername: (name: string, changed: string) => {
      const prefix = `authService.account.changeUsername( name: ${ name }, changed: ${ changed } })`
      return Helpers.remote.changeUsername(name, changed, (err, res) => {
        if (err)
          if (err.name === 'not_found') {
            console.error(prefix, err.name, err)
          } else if (err.taken) {
            console.error(prefix, 'Name taken', err)
          } else {
            console.error(prefix, err.name, err)
          }

        return res
      })
    },
  }
}
