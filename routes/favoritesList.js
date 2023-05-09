module.exports = function(app, database) {
    app.get('/favoritesList', async (req, res) => {
        try {
            const userId = req.query.user_id;
            const rows = await database.getAllRecipesFromFavoritesList(userId);
            const recipesId = rows.map(row => parseInt(row.recipe_id));
            const result = await database.getRecipesById(recipesId);
            console.log(result);
            res.status(200).send(result);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching users');
        }
    });

    app.get('/favoritesList/check', async (req, res) => {
        try {
            const recipeId = req.query.recipe_id;
            const userId = req.query.user_id;
            const result = await database.getRecipeFromFavoritesList(recipeId, userId);

            res.status(200).json({isFavorite: result.rows[0].get_recipe_from_favorites_list});
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching users');
        }
    });

    app.post('/favoritesList', async (req, res) => {
        const userId = req.query.user_id;
        const recipeId = req.query.recipe_id;

        const result = await database.addRecipeToFavoritesList(userId, recipeId);
        if (result) {
            res.status(200).json({message: 'Successfully added a recipe to favorites list'});
        } else {
            res.status(401).json({message: 'Error adding a recipe to favorites list'});
        }
    });

    app.delete('/favoritesList', async (req, res) => {
        try {
            const userId = req.query.user_id;
            const recipeId = req.query.recipe_id;

            const result = await database.deleteRecipeFromFavoritesList(userId, recipeId);
            if (result) {
                res.status(201).send('Recipe deleted successfully from favorites list');
            } else {
                res.status(500).send('Error deleting recipe from favorites list');
            }
        } catch (error) {
            res.status(500).send('Error deleting recipe from favorites list');
        }
    });
}
