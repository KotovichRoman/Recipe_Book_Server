module.exports = function(app, database) {
    app.get('/comments/:recipe_id', async (req, res) => {
        try {
            const recipeId = req.params.recipe_id;

            const rows = await database.getAllRecipeComments(recipeId);
            res.status(200).send(rows);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error getting comments');
        }
    });

    app.post('/comment', async (req, res) => {
        const { description, userId, recipeId } = req.body;

        const result = await database.addCommentToRecipe(description, userId, recipeId);
        if (result) {
            res.status(200).json({message: 'Successfully added a comment to recipe'});
        } else {
            res.status(401).json({message: 'Error adding a comment to recipe'});
        }
    });

    app.delete('/comment/:id', async (req, res) => {
        try {
            const id = req.params.id;

            const result = await database.deleteCommentToRecipe(id);
            if (result) {
                res.status(201).send('Comment deleted successfully from recipe');
            } else {
                res.status(500).send('Error deleting comment from recipe');
            }
        } catch (error) {
            res.status(500).send('Error  deleting comment from recipe');
        }
    });
}
