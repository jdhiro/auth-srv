import Joi from 'joi'
import bcrypt from 'bcrypt'
import jsonwebtoken from 'jsonwebtoken'

const {sign} = jsonwebtoken

const getToken = async (ctx) => {

    const TOKEN_EXPIRATION = 120 // 120 seconds, 2 minutes, etc.
  
    const schema = Joi.object({
      grant_type: Joi.string(),
      client_id: Joi.string(),
      client_secret: Joi.string(),
      scope: Joi.string(),
    })
  
    const body = schema.validate(ctx.request.body)
    if (body.error) ctx.throw(400, body.error)
  
    /* Example client DB lookup.
    const query = {
      text: 'SELECT * FROM store_user WHERE username = $1 LIMIT 1',
      values: [body.client_id]
    }
  
    // Query the db, and catch timeouts.
    let data = {}
    try {
      let { rows } = await pool.query(query)
      if (rows[0]) data = rows[0]
    } catch(err) {
      console.log(err)
      ctx.throw(500)
    }
    */
  
    const DB_RESULT = {
      id: "f9d842b4-ed0b-4e2f-ae76-df003a251fec",
      secret: "$2y$12$80cKNflM9U3QwcXnaizMmesUFRdnBSCL9D3MpErKxhVQEaowjZ8qm", // ABC123
    }
  
    const match = await bcrypt.compare(body.value.client_secret, DB_RESULT.secret)
    if (!match) ctx.throw(401)
  
    const jwtBody = {client_id: body.value.client_id, expires_at: ''}
    const token = sign(jwtBody, '6d7a&gwVm2@*%Rdp8mqPp2DdJqaBb#?v*3xWL3e+8KP2$nrw5m6x2k4yv3tpewWg', {expiresIn: TOKEN_EXPIRATION})
  
    const responseBody = {
      access_token: token,
      token_type: 'Bearer',
      expires_in: TOKEN_EXPIRATION,
    }
    ctx.body = { token }
  }

  export default getToken