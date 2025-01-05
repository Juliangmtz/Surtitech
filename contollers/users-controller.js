const User = require('../models/users');
const bcrypt = require('bcrypt');

// Iniciar sesión
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }

        // Actualiza la fecha de login
        user.fechaLogin = new Date();
        await user.save();

        // Responder con datos básicos del usuario
        res.status(200).json({
            userId: user._id,
            email: user.email
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const { userId } = req.body; // El cliente envía el userId como parte de la solicitud
        console.log("userId recibido:", userId);  // Verifica si el userId se recibe correctamente

        if (!userId) {
            return res.status(401).json({ message: 'No autorizado: No hay userId' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Actualiza la fecha de logout
        user.fechaLogout = new Date();
        await user.save();

        return res.status(200).json({ message: 'Cierre de sesión exitoso' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};



exports.register = async (req, res) => {
    const { email, password, name, last_name } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, last_name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).send('User registered');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

