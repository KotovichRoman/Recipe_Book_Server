module.exports = function(app, database) {
    app.get('/recipes', async (req, res) => {
        try {
            const rows = await database.getAllPublicRecipes();
            console.log(rows);
            res.status(200).send(rows);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching users');
        }
    });

    app.get('/recipes/:user_id', async (req, res) => {
        try {
            const userId = req.params.user_id;
            const rows = await database.getAllUserRecipes(userId);
            console.log(rows);
            res.status(200).send(rows);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching users');
        }
    });

    app.get('/recipes/:user_id/public', async (req, res) => {
        try {
            const userId = req.params.user_id;
            const rows = await database.getAllUserPublicRecipes(userId);
            console.log(rows);
            res.status(200).send(rows);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching users');
        }
    });

    app.get('/recipe/:id/ingredients', async (req, res) => {
        try {
            const recipeId = req.params.id;
            const result = await database.getAllRecipeIngredients(recipeId);
            console.log(result);
            res.status(200).send(result);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error get a recipe');
        }
    });

    app.post('/recipe', async (req, res) => {
        const { title, description, is_public, owner_id, ingredientsId, weights } = req.body;

        const result = await database.addRecipe(title, description, Boolean(is_public), parseInt(owner_id), ingredientsId, weights);

        if (result) {
            console.log(result);
            res.status(200).json({message: 'Successfully added a recipe'});
        } else {
            console.log("Error");
            res.status(401).json({message: 'Error adding a recipe'});
        }
    });

    app.put('/recipe/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const { title, description, is_public, ingredientsId, weights } = req.body;
            const result = await database.updateRecipe(id, title, description, is_public, ingredientsId, weights);

            if (result) {
                console.log('Recipe updated successfully');
                res.status(201).send('Recipe updated successfully');
            } else {
                console.log('Error updating recipe');
                res.status(500).send('Error updating recipe');
            }
        } catch (error) {
            res.status(500).send('Error updating recipe');
        }
    });

    app.delete('/recipe/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const result = await database.deleteRecipe(id);

            if (result) {
                console.log(result);
                res.status(201).send('Recipe deleted successfully');
            } else {
                console.log("Error");
                res.status(500).send('Error deleting recipe');
            }
        } catch (error) {
            console.log(error);
            res.status(500).send('Error updating recipe');
        }
    });
}
