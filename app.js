// Importar o módulo Express
const express = require('express');

// Criar uma instância do aplicativo Express
const app = express();

// Definir a porta do servidor
const PORT = process.env.PORT || 3000;

// Array de usuários fictícios
const users = [
    { email: 'user1@example.com', password: 'password1', name: 'Usuário 1' },
    { email: 'user2@example.com', password: 'password2', name: 'Usuário 2' }
];

// Configurar o mecanismo de visualização e o diretório de visualização
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Middleware para servir arquivos estáticos
app.use(express.static('public'));

// Middleware para análise do corpo da solicitação
app.use(express.urlencoded({ extended: true }));

// Rota para a página de login
app.get('/login', (req, res) => {
    res.render('index', { error: null });
}); 

// Rota para processar o formulário de login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        res.redirect(/profile/${user.email});
    } else {
        res.render('index', { error: 'E-mail ou senha inválidos' });
    }
});

// Rota para a página de perfil do usuário
app.get('/profile/:email', (req, res) => {
    const email = req.params.email;
    const user = users.find(user => user.email === email);
    
    if (user) {
        res.render('profile', { user });
    } else {
        res.status(404).send('Usuário não encontrado');
    }
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(Servidor rodando na porta ${PORT});
});

// Rota para a página de registro
app.get('/register', (req, res) => {
    res.render('register', { error: null });
});

// Rota para processar o formulário de registro
app.post('/register', (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    // Validação dos campos do formulário
    if (!name || !email || !password || !confirmPassword) {
        return res.render('register', { error: 'Todos os campos são obrigatórios' });
    }

    if (password !== confirmPassword) {
        return res.render('register', { error: 'As senhas não coincidem' });
    }

    // Verificar se o e-mail já está registrado
    if (users.some(user => user.email === email)) {
        return res.render('register', { error: 'E-mail já registrado' });
    }

    // Se todos os campos forem válidos, adicionar o usuário ao array de usuários
    users.push({ name, email, password });

    // Redirecionar para a página de login após o registro bem-sucedido
    res.redirect('/login');
});

// Rota para listar todos os usuários cadastrados
app.get('/users', (req, res) => {
    res.render('users', { users });
});