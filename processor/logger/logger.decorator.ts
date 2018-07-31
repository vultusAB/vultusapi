import * as _ from 'lodash'
import * as lgCol from 'colors/safe'
import * as lgFig from 'figures'
import * as moment from 'moment'

// const loop = length => Array.apply(null, Array(length + 1)).map((v, k) => k)

// Candidate for solving stack trace issue
/*
const Stack = () => {
  Stack.prototype.bucket = () => {
    return Stack.prototype.content
  }
  Stack.prototype.content = {}
  Stack.prototype.push = (...args) => {
    const Con = () => {}
    Con.prototype = Stack.prototype.content
    Stack.prototype.content = new Con()
    _.merge(Stack.prototype.content, ...args)
  }
} */
/*
const Stack = () => {
  Stack.prototype = Array.prototype
  Stack.prototype.last = () => {
    return this.slice(-1).pop()
  }
} */
namespace Print {
  const prettyArgs = args => {
    return args.map(arg => [ arg, Object.prototype.toString.call(arg).slice(8, -1) ])
  }

  const typeDecoration = arg => {
    const symbols = {
      undefined: [ lgFig.cross, false ],
      object:    [ lgFig.squareSmall, true ],
      boolean:   [ lgFig.bullet, true ],
      number:    [ lgFig.bullet, true ],
      string:    [ lgFig.bullet, true ],
      function:  [ lgFig.squareSmallFilled, true ],
    }
    try {
      return symbols[typeof arg]
    } catch (error) {
      return symbols.undefined
    }
  }

  const staticArgs = args => {
    const argsList = prettyArgs(args)
    return argsList
      .map(item => {
        const dec = typeDecoration(item.shift())
        return lgCol[dec.pop() ? 'cyan' : 'red'](dec.slice(-1).pop()) + ' ' + lgCol.gray(item.pop())
      })
      .join(', ')
  }
  const printTimestamp = datetime => `[${ moment(datetime).format('HH:mm:ss.SSS') }]`

  const prefixStyle = arg => {
    return `%c${ arg }%c`
  }
  const typeStyle = (logType, small = false) => {
    const genericStyle = small ? 'padding: -2px 14px -2px 14px; cursor:pointer; font-weight: bold;' : 'padding: 2px 9px 2px 9px; cursor:pointer;'

    const style = {
      function: 'background-color: #ebebeb;',
      info:     'background-color: #ebebeb;',
      success:  'background-color: #bffec7;',
      warn:     'background-color: #fff6a2;',
      error:    'background-color: #ffd1d1;',
    }
    const normalStyle = ''
    return [ `${ style[logType] }${ genericStyle }`, normalStyle ]
  }

  const borderStyle = color => {
    return `border-color: ${ color }; border-width: 1px; border-style: solid; border-left-width: 0; border-right-width: 0;`
  }
  const logFunctionArgs = args => {
    const dynamicArgs = prettyArgs(args)
    dynamicArgs.forEach(item => {
      console.log(`${ lgFig.arrowRight } ${ item.pop() } | `, item.pop())
    })
  }

  const logStack = (className, methodName) => {
    return `${ printTimestamp(new Date().toISOString()) } @Stack | ${ className }::${ methodName }`.padEnd(70)
  }

  export const logFunctionGroup = (datetime, className, methodName, args) => {
    const typedArgs = staticArgs(args)
    console.groupCollapsed(`%c${ className }::${ methodName }( ${ typedArgs } )`.padEnd(63), `${ typeStyle('function').shift() } ${ borderStyle('#d9d9d9') }`)
    logFunctionArgs(args)
    console.groupEnd()
  }

  const logRecord = (logType, args) => {
    const desc = args.filter(arg => {
      return typeof arg === 'string'
    })
    console.groupCollapsed(`${ prefixStyle(' L | ') } ${ desc.join(' | ') || 'Fuzzy' }`, ...typeStyle(logType, true))
    args.forEach(arg => {
      console.log(`${ staticArgs([ arg ]) } |`, arg)
    })
    console.groupEnd()
  }

  const watchRecord = (logType, className, methodName, args) => {
    const label = args.shift()
    const functionName = args.shift()
    const inputArgs = args.filter((arg, key) => {
      return !(args.length - 1 === key)
    })

    console.groupCollapsed(`${ prefixStyle(' W | ') } ${ label } | ${ functionName }( ${ staticArgs(inputArgs) } )`, ...typeStyle(logType, true))
    const symbol = args.map((arg, key) => {
      return args.length - 1 === key ? lgFig.arrowLeft : lgFig.arrowRight
    })
    args.forEach((arg, key) => {
      console.log(`${ symbol[key] } ${ staticArgs([ arg ]) } |`, arg)
    })
    console.groupEnd()
  }

  const conclusionRecord = (conclusion, className, methodName) => {
    const isSuccess = conclusion.pop()
    const typeName = isSuccess ? 'success' : 'error'
    const consoleName = isSuccess ? 'log' : 'error'

    console.groupCollapsed(
      `%c@Stack ${ className }::${ methodName } - ${ typeName.toUpperCase() }`.padEnd(70),
      `${ typeStyle(typeName).shift() } ${ borderStyle('#9acfa1') }`
    )
    console[consoleName](lgFig.arrowLeft, conclusion.pop()) // isSuccess ? resultObject : errorStack
    console.groupEnd()
  }

  export const toConsole = (functionsTrace, className, methodName, conclusion: boolean = false) => {
    const entries = {
      function: {
        run:  logFunctionGroup,
        bind: record => [ record[1], record[2], record[3], ...record[4] ],
      },

      log: {
        run:  logRecord,
        bind: record => [ record[0], ...record[4] ],
      },

      watcher: {
        run:  watchRecord,
        bind: record => [ record[0], record[2], record[3], ...record[4] ],
      },
    }
    const isSuccess = conclusion[1]
    const typeName = isSuccess ? 'success' : 'error'
    console.groupCollapsed(`%c${ logStack(className, methodName) }`, `${ typeStyle(typeName).shift() } ${ borderStyle('#9acfa1') }`)
    functionsTrace.forEach(functionTrace => {
      functionTrace.pop().forEach(events => {
        const target = entries[events.shift()]

        target.run(...target.bind(events))
      })
    })
    conclusionRecord(conclusion, className, methodName)
    console.groupEnd()
  }
}

namespace Log {
  export const createLogger = (insertRecord, levels = [ [ 'd', 'debug' ], [ 'i', 'info' ], [ 'w', 'warn' ], [ 'e', 'error' ] ], useLevel = 1) => {
    const methodComponent = {
      log: undefined,
    }

    methodComponent.log = insertRecord(levels[useLevel].slice(-1).pop())

    _.merge(
      methodComponent.log,
      ..._.flatten(levels.map(level => {
          return level.map(prefix => {
            return [ prefix, insertRecord(level.slice(-1).pop()) ]
          })
        })).map((item: any) => {
        return { [item.shift()]: item.shift() }
      })
    )

    delete methodComponent.log.name
    delete methodComponent.log.length
    return methodComponent.log
  }

  export const bindLogger = classInstance => {
    return (level, type = 'log') => {
      return (...args) => {
        const instance = classInstance.stack.last()
        instance.push([ type, level, new Date().toISOString(), instance.className, instance.methodName, [ args ] ])
      }
    }
  }
}

namespace Watcher {
  export const createWatcher = (insertWatcher: Function) => {
    const watcherComponent = {
      create: {
        watcher: undefined,
      },
    }

    watcherComponent.create.watcher = insertWatcher

    return watcherComponent
  }

  export const saveWatcher = (insertRecord, classAnchor, ...extensions) => {
    return name => {
      const instanceWatcher = (callback: any, ...args) => {
        const [ insertInfo, insertError ] = [ 'info', 'warn' ].map(level => insertRecord(level, 'watcher'))
        const prepareEntry = [ name, callback.name, args, null ]
        let executionResult
        try {
          executionResult = callback.apply(classAnchor.classInstance, args)
          prepareEntry.pop()
          prepareEntry.push(executionResult)
          insertInfo(...prepareEntry)
        } catch (error) {
          prepareEntry.push(error)
          insertError(...prepareEntry)

          // Flush gathered data from abstract method instance
          classAnchor.classInstance.list.push(classAnchor.classInstance.stack.flush())
          const conclusion = [ error, false ] // Data Success?
          printStacktrace(classAnchor, '_watcher', callback.name, conclusion)
        }

        return executionResult
      }

      // Add extensions to watcher prototype
      _.merge(instanceWatcher, ...extensions)
      return instanceWatcher
    }
  }
}

export function Trace (): Function {
  // eslint-disable-next-line
  return function(target, methodName: string, descriptor) {
    target[methodName].prototype.observe = true

    return descriptor
  }
}

export function Logger (): Function {
  return target => {
    const classAnchor = {
      classConstructor: target,
      classInstance:    {},
    }

    const classConstructor = classAnchor.classConstructor
    Object.assign(
      classConstructor.prototype,
      ...Object.entries(classConstructor.prototype).map((entry: any) => {
        return { [entry[0]]: extendMethod(classAnchor, entry.pop(), entry.pop()) }
      })
    )

    const f = extendConstructor(classAnchor)
    f.prototype = classConstructor.prototype

    return f
  }
}

const extendConstructor = classAnchor => {
  const classConstructor = classAnchor.classConstructor
  // eslint-disable-next-line
  return function(...args) {
    classAnchor.classInstance = this
    return classConstructor.apply(this, args)
  }
}

// Constructor for abstract method instance (relation 1..*)
const createStack = () => {
  const stackSchema = {
    // eslint-disable-next-line
    push: function(arg) {
      this.records.push(arg)
    },
    // eslint-disable-next-line
    last: function() {
      return this.records[this.records.length - 1]
    },
    // eslint-disable-next-line
    flush: function() {
      return this.records.pop()
    },
  }
  const stack = {
    records: [],
  }
  return _.merge(
    stack,
    ...Object.keys(stackSchema).map(key => {
      return { [key]: stackSchema[key].bind(stack) }
    })
  )
}

const extendInstance = classAnchor => {
  const insertRecord = Log.bindLogger(classAnchor.classInstance)

  const instanceComponent = {
    stack:    createStack(),
    log:      Log.createLogger(insertRecord),
    list:     [],
    observed: false,
  }
  const insertWatcher = Watcher.saveWatcher(insertRecord, classAnchor)
  _.merge(instanceComponent.log, Watcher.createWatcher(insertWatcher))

  _.merge(classAnchor.classInstance, instanceComponent)
}

// Create abstract log instance for abstract method instance (relation 1..1)
const createInstance = (className, methodName) => {
  const instanceSchema = {
    // eslint-disable-next-line
    push: function(...args) {
      this.records.push.apply(this.records, args)
    },
    // eslint-disable-next-line
    last: function() {
      return this.records.slice(-1).pop()
    },
  }
  const instance = {
    className:  className,
    methodName: methodName,
    records:    [],
  }
  return _.merge(
    instance,
    ...Object.keys(instanceSchema).map(key => {
      return { [key]: instanceSchema[key].bind(instance) }
    })
  )
}

const onFirstAppearance = classAnchor => {
  if ('_lock' in classAnchor.classInstance) return false
  // DANGER - Extends class object
  extendInstance(classAnchor)
  classAnchor.classInstance._lock = true
  return true
}

const printStacktrace = (classAnchor, className, methodName, conclusion) => {
  const stacktrace = classAnchor.classInstance.list.map(item => [ item.className, item.methodName, item.records ]).reverse()
  classAnchor.classInstance.list = []

  if (conclusion[0] === undefined) conclusion[0] = 'undefined | Void function'

  Print.toConsole(stacktrace, className, methodName, conclusion)
}

const extendMethod = (classAnchor, method: Function, methodName: string): Function => {
  // eslint-disable-next-line
  return function(...args) {
    const className = classAnchor.classConstructor.name
    // Append necessary data to parent instance (the class instance)
    onFirstAppearance(classAnchor)
    // Keep track of stack trace owner @Trace
    const observeOwner = (method.prototype.observe && !classAnchor.classInstance.observed) || false
    classAnchor.classInstance.observed = method.prototype.observe || classAnchor.classInstance.observed
    // Create abstract method instance
    classAnchor.classInstance.stack.push(createInstance(className, methodName))
    // Create function init entry
    const earliestRecord = Log.bindLogger(classAnchor.classInstance)
    earliestRecord('info', 'function')(...args)
    try {
      // Execute method
      const result = method.apply(classAnchor.classInstance, args)

      // Following executed on Success

      // Flush gathered data from abstract method instance
      classAnchor.classInstance.list.push(classAnchor.classInstance.stack.flush())
      // When stack trace owner is done report the stack and update parent instance
      const conclusion = [ result, true ] // Data Success?
      if (observeOwner) printStacktrace(classAnchor, className, methodName, conclusion)
      if (observeOwner) classAnchor.classInstance.observed = !observeOwner

      return result
    } catch (error) {
      // Flush gathered data from abstract method instance
      classAnchor.classInstance.list.push(classAnchor.classInstance.stack.flush())
      const conclusion = [ error, false ] // Data, Success?
      printStacktrace(classAnchor, className, methodName, conclusion)

      return undefined
    }
  }
}
