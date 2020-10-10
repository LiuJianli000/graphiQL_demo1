/**
 * 查询
 */

const express = require('express')
const { buildSchema } = require('graphql')
const { graphqlHTTP } = require('express-graphql')

const schema = buildSchema(`
  type Account {
    name: String
    age: Int
    salary(city: String): Int
  }

  type Query {
    getClassMate(classNo: Int!): [String]
    account(name: String): Account
  }
`)

const root = {
  getClassMate({ classNo }) {
    const obj = {
      31: ['张三', '李四', '王五'],
      61: ['张大三', '李大四', '王大五']
    }

    return obj[classNo]
  },
  account({ name }) {
    const _name = name
    const age = 18
    const salary = ({city}) => {
      if (city == 'beijing') {
        return 10000
      }

      return 3000
    }

    return {
      name: _name,
      age,
      salary,
    }
  }
}

const app = express()

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

app.use(express.static('public'))

app.listen(4000, () => {
  console.log('listen http://localhost:4000')
})