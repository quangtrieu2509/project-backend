import 'mocha'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import jwt from 'jsonwebtoken'
import httpStatus from 'http-status'

import app from '..'
import { roles } from '../constants'
import { accessTokenSettings } from '../configs'

const genAdminToken = (): string => {
  return jwt.sign(
    {
      role: roles.ADMIN
    },
    accessTokenSettings.secret,
    { expiresIn: '1day' }
  )
}

const adminToken = genAdminToken()

chai.use(chaiHttp)

describe('GET /v1/users', () => {
  it('Get user by email', done => {
    void chai
      .request(app)
      .get('/landing-pages/v1/users')
      .auth(adminToken, { type: 'bearer' })
      .end((err, res) => {
        expect(err).to.eq(null)
        expect(res).to.have.status(httpStatus.OK)
        done()
      })
  })
})
