var assert = require('assert');

function attempt(available, allowed, preffered ) {
    let availableSet = new Set(available)
    let allowedSet = new Set(allowed)
    let prefferedSet = new Set(preffered)

    let allowedHasAny = allowed.includes('any')
    let prefferedHasAny = preffered.includes('any')
    
    let intersection
    if (allowedHasAny) {
        intersection = new Set(available)
    } else {
        intersection = new Set([...availableSet].filter(x => allowedSet.has(x)));
    }

    if (intersection.size == 0) {
        return []
    }

    let resultSet = new Set()

    if (prefferedHasAny) {
        intersection.forEach(resultSet.add, resultSet) 
    } else {
        for (let value of prefferedSet) {
            if (intersection.has(value)) {
                resultSet.add(value)
                continue
            } 
    
            let found = false
            for (let elem of intersection) {
                
                if (elem > value) {
                    resultSet.add(elem)
                    found = true
                    break
                }
            }
    
            if (found) {
                continue
            }
    
            let lastValue
            let temp = []
            for (let elem of intersection) {
                if (elem < value) {
                    temp.push(elem)
                }
            }
            lastValue = temp.pop()
            resultSet.add(lastValue)
    
            for (let elem of resultSet) {
                
                if (elem != value) {
                    resultSet.add(elem)
                    found = true
                    break
                }
            }
        }
    }

    return Array.from(resultSet)
}

function testAttempt() {
    assert.deepEqual(attempt([240, 360, 720], [360, 720], [1080]), [720])
    assert.deepEqual(attempt([240, 720], [360, 720], [1080]), [720])
    assert.deepEqual(attempt([240], [360, 720], [1080]), [])
    assert.deepEqual(attempt([240, 360, 720], [240, 360, 720, 1080], [240, 360]), [240, 360])
    assert.deepEqual(attempt([240, 720], [240, 360, 720, 1080], [240, 360]), [240, 720])
    assert.deepEqual(attempt([240, 720], [240, 360, 1080], [240, 360]), [240])
    assert.deepEqual(attempt([720], [240, 360, 1080], [240, 360]), [])
    assert.deepEqual(attempt([240, 360], [240, 360], [720, 1080]), [360])
    
    assert.deepEqual(attempt([240, 360, 720], [360, 'any'], [360, 720]), [360, 720])
    assert.deepEqual(attempt([240, 360, 720], [240, 360, 720], ['any', 720]), [240, 360, 720])
    assert.deepEqual(attempt([240, 360, 720], [360, 1080], ['any', 720]), [360])
    assert.deepEqual(attempt([240, 360, 720], [1080], ['any', 720]), [])
    
    console.log('Success') 
}

testAttempt()