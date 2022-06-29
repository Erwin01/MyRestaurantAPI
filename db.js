

const sql = require('mssql')

var config = {
    user: 'Administrador',
    password: '123456',
    server: 'DESKTOP-LQIPPQT',
    database: 'MyRestaurant',
    options: {
        encrypt: false, // Use this if you're on Windows Azure = true / "enableArithAbort": true
        
    }
}


const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL')
        return pool
    }).catch(err => console.log('Database connection failed! Bad config: ', err))

module.exports = { sql, poolPromise }

