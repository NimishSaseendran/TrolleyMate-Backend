const User = require('../Model/user');

// Signup Controller
exports.signup = async (req, res) => {
    try {
        const { strName, strEmail, strPhone, strPassword } = req.body;

        if (!strName || !strPassword || (!strEmail && !strPhone)) {
            return res.status(400).json({ message: 'Name, password, and either email or phone are required.' });
        }

        // Check if email or phone already exists
        const existingUser = await User.findOne({
            $or: [{ strEmail }, { strPhone }]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Email or phone already in use.' });
        }

        const newUser = new User({ strName, strEmail, strPhone, strPassword });
        const savedUser = await newUser.save();

        res.status(201).json({
            message: 'Signup successful',
            user: {
                pkUserId: savedUser.pkUserId,
                strName: savedUser.strName,
                strEmail: savedUser.strEmail,
                strPhone: savedUser.strPhone
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Signup failed', error: error.message });
    }
};

// Login Controller
exports.login = async (req, res) => {
    try {
        const { strEmail, strPhone, strPassword } = req.body;

        if (!strPassword || (!strEmail && !strPhone)) {
            return res.status(400).json({ message: 'Password and either email or phone are required.' });
        }

        const user = await User.findOne({
            $or: [
                { strEmail: strEmail || null },
                { strPhone: strPhone || null }
            ]
        });

        if (!user) {
            return res.status(401).json({ message: 'User not found.' });
        }

        if (user.strPassword !== strPassword) {
            return res.status(401).json({ message: 'Invalid password.' });
        }

        res.status(200).json({
            message: 'Login successful',
            user: {
                pkUserId: user.pkUserId,
                strName: user.strName,
                strEmail: user.strEmail,
                strPhone: user.strPhone
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};
