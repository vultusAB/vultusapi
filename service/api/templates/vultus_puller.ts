import Promise from 'bluebird'

const promiseWhile = (condition, action) => {
  var resolver = Promise.defer()

  var loop = () => {
    if (!condition()) return resolver.resolve()
    return Promise.cast(action())
      .then(loop)
      .catch(resolver.reject)
  }

  process.nextTick(loop)

  return resolver.promise
}

export const Puller = () => {
  let sum = 0
  let stop = 10

  promiseWhile(
    () => {
      // Condition for stopping
      return sum < stop
    },
    () => {
      // The function to run, should return a promise
      return new Promise((resolve, reject) => {
        // Arbitrary 250ms async method to simulate async process
        setTimeout(() => {
          sum += 1
          // Print out the sum thus far to show progress
          console.log(sum)
          resolve()
        }, 250)
      })
    }
  )
    .then(() => {
      // Notice we can chain it because it's a Promise, this will run after completion of the promiseWhile Promise!
      console.log('Done')
      return true
    })
    .catch(error => {
      console.error('Issue in Vultus Puller', error)
    })
}
