import { Hono } from 'hono'
import { drizzle } from 'drizzle-orm/d1'
import { Environment } from '../bindings'
import { usersTable } from './db/schema'
import { eq } from 'drizzle-orm'

const app = new Hono<Environment>()

app.get('/api/users/:id', async c => {
  try {
    const db = drizzle(c.env.DB)
    const userId = c.req.param('id')

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, Number(userId)))
      .get()

    if (!user) return c.json({ error: 'User not found' }, 404)

    return c.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

app.get('/api/users', async c => {
  try {
    const db = drizzle(c.env.DB)
    const allUsers = await db.select().from(usersTable).all()

    return c.json(allUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

app.post('/api/users', async c => {
  try {
    const db = drizzle(c.env.DB)
    const userData = await c.req.json()
    const newUser = await db.insert(usersTable).values(userData).returning().get()

    return c.json(newUser, 201)
  } catch (error) {
    console.error('Error creating user:', error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

app.get('/api/seed', async c => {
  try {
    const db = drizzle(c.env.DB)
    await db.delete(usersTable)
    const users = [
      { name: 'John Doe', email: 'john@example.com', test: 'test1' },
      { name: 'Jane Smith', email: 'jane@example.com', test: 'test2' },
      { name: 'Bob Johnson', email: 'bob@example.com', test: 'test3' }
    ]

    await db.insert(usersTable).values(users)

    return c.json({ message: 'Database seeded successfully' })
  } catch (error) {
    console.error('Error seeding database:', error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})

export default app
