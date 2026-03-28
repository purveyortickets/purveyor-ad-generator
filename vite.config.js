import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      {
        name: 'local-auth-api',
        configureServer(server) {
          server.middlewares.use('/api/auth', (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.end(JSON.stringify({ error: 'Method not allowed' }))
              return
            }

            let body = ''
            req.on('data', (chunk) => { body += chunk })
            req.on('end', () => {
              try {
                const { password } = JSON.parse(body)
                const masterPw = env.MASTER_PASSWORD || 'Purveyor2026'

                res.setHeader('Content-Type', 'application/json')

                if (password === masterPw) {
                  res.statusCode = 200
                  res.end(JSON.stringify({ success: true }))
                } else {
                  res.statusCode = 401
                  res.end(JSON.stringify({ success: false, error: 'Invalid password' }))
                }
              } catch (e) {
                res.statusCode = 400
                res.end(JSON.stringify({ error: 'Bad request' }))
              }
            })
          })
        },
      },
    ],
  }
})
