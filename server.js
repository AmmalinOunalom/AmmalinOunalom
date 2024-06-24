const express = require('express')
const app = express()
const port = 3000
const mysql2 = require('mysql2')
const bcrypt = require('bcrypt')
const saltRounds = 10

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const conn = mysql2.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'exercise'
});


app.get('/users', async(req, res) => {
    let sql = "SELECT * FROM user"

    await conn.execute(sql, 
        (err, result) => {
            if(err) {
                res.status(500).json({
                    message : err.message
                })
                return
            }
            res.status(200).json({
                message:'ern khor moun sum let jraa',
                data : result
            })
        })
})
app.post('/users', async(req, res) => {
    const { username, email, password } = req.body

    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(password, salt)

    let sql = "INSERT INTO user (username, email, password) VALUES (?,?,?)"
    await conn.execute(sql,
        [username, email, hashedPassword],
        (err, result) => {
            if(err){
                res.status(500).json({
                    message : err.message
                })
                return
            }
            res.status(201).json({
                message : "ern khor moun sum let",
                data : result
            })
        })
  
    
})

app.get('/users',async(req, res) => {
    const {id} = req.params
    let sql = "SELECT * FROM user WHERE id =?"
    await conn.execute(sql,
        [id],
        (err, result) => {
            if(err){
                res.status(500).json({
                    message : err.message
                })
                return
            }
            res.status(200).json({
                message : "ern khor moun sum let",
                data : result
            })
        })
})
app.put('/users/:id', async(req, res) => {
    const {id} = req.params
    const{ email, password } = req.body

   bcrypt.genSalt(saltRounds, async (err, salt) => {
        await bcrypt.hash(password, salt, (err, hash) => {
            let sql = "UPDATE user SET username = ? email = ?, password = ? WHERE id = ?"
            conn.execute(sql,
                [email, hash, id],
                (err, result) => {
                    if (err) {
                        res.status(500).json({
                            message: err.message
                        })
                        return
                    }
                    res.status(201).json({
                        message: "user updated successfully",
                        data: result
                    })
                })
        })
    })
})

app.delete('/users/:id', async(req, res) => {
    const {id} = req.params
    let sql = "DELETE FROM user WHERE id =?"
    await conn.execute(sql,
        [id],
        (err, result) => {
            if (err) {
                res.status(500).json({
                    message: err.message
                })
                return
            }
            res.status(200).json({
                message: "user deleted successfully",
                data: result
            })
        })

})


app.listen(port, () => {
  console.log(`Server listening on ${port} `)
})