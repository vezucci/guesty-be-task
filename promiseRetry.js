const tryToSayHi = () => { 
  return new Promise((resolve, reject) => {
    const ok = Math.random() > 0.9;
    setTimeout(() => {
      if (ok) {
        resolve('hello');
        console.log('resolve');
      } else {
        reject('error');
        console.log('reject')
      }
    }, 1000);
  });
}

const calculateNumber = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(Math.random());
    }, 1000);
  })
}


// tryToSayHi()
//   .then(x => console.log(x))
//   .catch(err => console.log(err))

//retryPromise(tryToSayHi, 3).then(() => console.log('at last'));

function retryPromise(promiseMaker, count) {
  return promiseMaker()
    .then(value => {
      return Promise.resolve(value);
    })
    .catch(err => {
      if (count === 0) {
        return Promise.reject(err);
      }
      return retryPromise(promiseMaker, count - 1);
    })
}

retryWhen(calculateNumber, (n) => n < 0.9)
  .then(n => console.log(n));

function retryWhen(promiseMaker, predicate) {
  return promiseMaker()
    .then(value => {
      if(predicate(value)) {
        return retryWhen(promiseMaker, predicate);  
      }
      return Promise.resolve(value);
    })
    .catch(err => {
      return Promise.reject(err);
    });
}
