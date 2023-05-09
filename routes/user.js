const crypto = require("crypto");

module.exports = function(app, database) {
    app.post('/user/registration', async (req, res) => {
        try {
            const { login, email, name, password } = req.body;

            const checkResult = await database.checkUserForUniqueness(login, email);
            console.log(checkResult.rows[0].find_user_by_login_or_email);
            if (checkResult.rows[0].find_user_by_login_or_email) {
                res.status(401).json({test: 'A user with the same login or email already exist'});
            }
            else {
                const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
                const result = await database.registrationUser(login, email, name, passwordHash);
                console.log(result);
                if (result) {
                    res.status(200).json({text: 'User added successfully'});
                } else {
                    res.status(500).json({text: 'Error added users'});
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({text: 'Error added users'});
        }
    });

    app.post('/user/login', async (req, res) => {
        console.log(req.body);
        const { login, password } = req.body;
        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

        const user = await database.getUserByLogin(login);

        console.log(user);
        if (user && user.find_user_by_login.password === passwordHash) {
            res.status(200).json(user.find_user_by_login);
        } else {
            res.status(401).json({message: 'Invalid credentials'});
        }
    });
}
