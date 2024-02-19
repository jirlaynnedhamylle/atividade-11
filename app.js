const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;

const users = [
    { email: 'user1@example.com', password: 'password1', name: 'Usuário 1' },
    { email: 'user2@example.com', password: 'password2', name: 'Usuário 2' }
];

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.get('/login', (req, res) => {
    res.render('index', { error: null });
}); 

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    const user = users.find(user => user.email === email && user.password === password);
    
    if (user) {
        res.redirect(/profile/${user.email});
    } else {
        res.render('index', { error: 'E-mail ou senha inválidos' });
    }
});

app.get('/profile/:email', (req, res) => {
    const email = req.params.email;
    const user = users.find(user => user.email === email);
    
    if (user) {
        res.render('profile', { user });
    } else {
        res.status(404).send('Usuário não encontrado');
    }
});

app.listen(PORT, () => {
    console.log(Servidor rodando na porta ${PORT});
});

app.get('/register', (req, res) => {
    res.render('register', { error: null });
});

app.post('/register', (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        return res.render('register', { error: 'Todos os campos são obrigatórios' });
    }

    if (password !== confirmPassword) {
        return res.render('register', { error: 'As senhas não coincidem' });
    }

    if (users.some(user => user.email === email)) {
        return res.render('register', { error: 'E-mail já registrado' });
    }

    users.push({ name, email, password });

    res.redirect('/login');
});

app.get('/users', (req, res) => {
    res.render('users', { users });
});
