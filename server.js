const express = require('express')
const app = express()
const port = 3000
const mssql = require('mssql/msnodesqlv8');

app.use(express.json());

const conn = new mssql.ConnectionPool({
    driver: "msnodesqlv8",
    server: 'SISTEMA-SSD\\SQLEXPRESS',
    database: 'Bomboniere',
    user: 'sa',
    password: '_43690'
})

app.get('/con', (req,res) => {
  try{
    if(conn){
      res.status(200).send('Conectado');
    }
  }catch(e){
    res.status(404).send(`Falha ao conectar. ${e.message}`);
  }
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/doces', (req, res) => {
  conn.connect().then((pool) => {
    const queryStr = 'SELECT * FROM Doces'
    pool.query(queryStr).then((rows) => {
      res.send(rows.recordset)
    })
  })
})

app.get('/doces/:id', (req, res) => {
  conn.connect().then((pool) => {
    const id = req.params.id;
    const queryStr = `SELECT * FROM Doces WHERE Codigo = ${id}`
    pool.query(queryStr).then((rows) => {
      res.send(rows.recordset)
    })
  })
})

app.delete('/doces/:id', (req, res) => {
  conn.connect().then((pool) => {
    const id = req.params.id;
    const queryStr = `DELETE FROM Doces WHERE Codigo = ${id}`
    pool.query(queryStr).then((rows) => {
      res.status(204).send('ok')
    })
  })
})

app.post('/doces', (req, res) => {
  const nome = '\'' + req.body.Nome + '\'';
  const tipo = '\'' + req.body.Tipo + '\'';
  const quantidade = '\'' + req.body.Quantidade + '\'';
  conn.connect().then((pool) => {
    const queryStr = `INSERT INTO Doces (Nome, Tipo, Quantidade) VALUES(${nome}, ${tipo}, ${quantidade})`
    pool.query(queryStr).then((rows) => {
      res.status(201).send(rows.recordset)
    })
  })
})

app.put('/doces/:id', (req, res) => {
  const id = req.params.id;
  const nome = '\'' + req.body.Nome + '\'';
  const tipo = '\'' + req.body.Tipo + '\'';
  const quantidade = '\'' + req.body.Quantidade + '\'';
  conn.connect().then((pool) => {
    const queryStr = `UPDATE Doces SET Nome = ${nome}, Tipo = ${tipo}, Quantidade = ${quantidade} WHERE Codigo = ${id}`
    pool.query(queryStr).then((rows) => {      
        res.send(rows.recordset);
    })
  })
})

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}/`);
})
