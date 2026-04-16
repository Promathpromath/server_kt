const fastify = require('fastify')({ logger: true });
const path = require('path');

fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/',
});

fastify.register(require('@fastify/view'), {
  engine: { pug: require('pug') },
  root: path.join(__dirname, 'views'),
  includeViewExtension: true,
});

fastify.register(require('@fastify/formbody'));

let users = [
  { id: 1, name: 'Иван Петров', email: 'ivan@example.com' },
  { id: 2, name: 'Мария Смирнова', email: 'maria@example.com' },
];

fastify.get('/api', async (request, reply) => {
  return { message: 'Запрос прошел успешно' };
});

fastify.get('/', async (request, reply) => {
  return reply.view('index', { users });
});

fastify.get('/users', (request, reply) => reply.redirect('/'));
fastify.get('/users/create', (request, reply) => reply.redirect('/'));

fastify.post('/users', async (request, reply) => {
  const { name, email } = request.body;
  const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
  users.push({ id: newId, name, email });
  reply.redirect('/');
});

fastify.post('/users/delete/:id', async (request, reply) => {
  const { id } = request.params;
  const userId = parseInt(id, 10);
  users = users.filter(user => user.id !== userId);
  reply.redirect('/');
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Сервер запущен на http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
