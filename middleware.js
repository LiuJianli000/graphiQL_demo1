/**
 * 中间件 如需要权限管理
 */

const express = require('express')
const { buildSchema } = require('graphql')
const { graphqlHTTP } = require('express-graphql')

const schema = buildSchema(`
  input AccountInput {
    name: String
    age: Int
    sex: String
    department: String
  }

  type Account {
    name: String
    age: Int
    sex: String
    department: String
  }

  type Mutation {
    createAccount(input: AccountInput): Account
    updateAccount(id: ID!, input: AccountInput): Account
  }

  type Query {
    accounts: [Account]
  }
`)

const fakeDb = {}

const root = {
  accounts() {
    let arr = []

    for(const key in fakeDb) {
      arr.push(fakeDb[key])
    }
    
    return arr
  },
  
  createAccount({ input }) {
    fakeDb[input.name] = input

    return fakeDb[input.name]
  },
  updateAccount({ id, input }) {
    const updatedAccount = {...fakeDb[id], ...input}
    // const updatedAccount = Object.assign({}, fakeDb[id], input)
    
    fakeDb[id] = updatedAccount

    return updatedAccount
  }
}

const app = express()

const middleware = (req, res, next) => {
  if(req.url.indexOf('/graphql') !== -1 && req.headers.cookie.indexOf('auth') === -1) {
    res.send(JSON.stringify({
      error: '您没有访问权限'
    }))
    return
  }
  next()
}

app.use(middleware)

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

app.listen(4000, () => {
  console.log('listen http://localhost:4000')
})