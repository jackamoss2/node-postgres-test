const Pool = require('pg').Pool
const pool = new Pool({ 
    host: process.env.PSQL_HOST,
    user: process.env.PSQL_USER,
    password: process.env.PSQL_PASSWORD,
//   database: process.env.PSQL_DATABASE,
    port: process.env.PSQL_PORT
});

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.AppendHeader("Access-Control-Allow-Origin", "*").status(200).json(results.rows)
    });
}

const getUserById = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    });
}

const createUser = (request, response) => {
    const { name, email, password } = request.body
  
    pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *', [name, email, password], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).AppendHeader("Access-Control-Allow-Origin", "*").send(`User added with ID: ${results.rows[0].id}`)
    });
}

const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email, password } = request.body
  
    pool.query(
        'UPDATE users SET name = $1, email = $2, password =$3 WHERE id = $4',
        [name, email, password, id],
        (error, results) => {
            if (error) {
            throw error
            }
            response.status(200).send(`User modified with ID: ${id}`)
        }
    );
}

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).send(`User deleted with ID: ${id}`)
    });
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}