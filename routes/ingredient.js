module.exports = function(app, database) {
    app.get('/ingredients', async (req, res) => {
        try {
            const rows = await database.getAllIngredients();
            console.log(rows);
            res.status(200).send(rows);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching users');
        }
    })

    app.post('/ingredient', async (req, res) => {
        const { name } = req.body;

        const result = await database.addIngredient(name);
        if (result) {
            res.status(200).json({message: 'Successfully added an ingredient'});
        } else {
            res.status(401).json({message: 'Error adding an ingredient'});
        }
    });

    app.put('/ingredient/:id', async (req, res) => {
        const id = req.params.id;
        const { name } = req.body;

        const result = await database.updateIngredient(id, name);
        if (result) {
            res.status(200).json({message: 'Successfully updated an ingredient'});
        } else {
            res.status(401).json({message: 'Error updating an ingredient'});
        }
    });
}
