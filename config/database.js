const sql = require('mssql/msnodesqlv8')

const config = {
    connectionString: 'Driver={ODBC Driver 17 for SQL Server};Server=TBS0676772W11-1\\SQLEXPRESS;Database=ProjetoCinema;Trusted_Connection=yes;'
}

module.exports = { sql, config }