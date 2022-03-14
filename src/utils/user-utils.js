const uuid4 = require('uuid4')

const setExternalUID = () => {
    let externalUID = uuid4()
    return externalUID
}


module.exports = { setExternalUID }