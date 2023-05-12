const postgres = require('pg');

class DB {
    // constructor() {
    //     this.pool = new postgres.Pool({
    //         user: 'db_9k06_user',
    //         host: 'dpg-ch14gfb3cv203bup33lg-a',
    //         database: 'db_9k06',
    //         password: 'TlMB32ghlgVWCPjeL4TdGecc0IiJHE9e',
    //         port: 5432,
    //     });
    // }

    constructor() {
        this.pool = new postgres.Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'Recipe Book',
            password: '614523',
            port: 5432,
        });
    }

    // users
    async checkUserForUniqueness(login, email) {
        try {
            return await this.pool.query(`select find_user_by_login_or_email('${login}', '${email}')`);
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async registrationUser(login, email, name, password) {
        try {
            await this.pool.query('begin');

            const query = 'call registration_user($1, $2, $3, $4)';
            const values = [ login, email, name, password ];
            await this.pool.query(query, values);

            await this.pool.query('commit');
            return true;
        } catch (error) {
            await this.pool.query('rollback');
            console.log(error);
            return false;
        }
    }

    async getUserByLogin(login) {
        try {
            const { rows } = await this.pool.query(`select * from get_user_by_login('${login}')`);
            return rows;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async getUserById(id) {
        try {
            const { rows } = await this.pool.query(`select * from get_user_by_id('${id}')`);
            return rows;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async getUsersById(usersId) {
        try {
            const { rows } = await this.pool.query(`select * from get_user_by_ids(array[${usersId}])`);
            return rows;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    // recipes
    async getAllPublicRecipes() {
        try {
            const { rows } = await this.pool.query(`select * from get_all_public_recipes()`);
            return rows;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async getAllUserRecipes(userId) {
        try {
            const { rows } = await this.pool.query(`select * from get_all_user_recipes(${userId})`);
            return rows;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async getAllUserPublicRecipes(userId) {
        try {
            const { rows } = await this.pool.query(`select * from get_all_user_public_recipes(${userId})`);
            return rows;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async getRecipesById(recipesId) {
        try {
            const { rows } = await this.pool.query(`select * from get_recipes_by_id(array[${recipesId}])`);
            return rows;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async addRecipe(title, description, is_public, owner_id, ingredientsId, weights) {
        try {
            await this.pool.query('begin');

            const queryText = 'call add_recipe($1, $2, $3, $4, $5, $6)';
            const values = [title, description, is_public, owner_id, ingredientsId, weights];
            await this.pool.query(queryText, values);

            await this.pool.query('commit');
            return true;
        } catch (error) {
            await this.pool.query('rollback');
            console.log(error);
            return false;
        }
    }

    async updateRecipe(id, title, description, is_public, ingredientsId, weights) {
        try {
            const queryText = 'call update_recipe($1, $2, $3, $4, $5, $6)';
            const values = [id, title, description, is_public, ingredientsId, weights];
            await this.pool.query(queryText, values);

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async deleteRecipe(id) {
        try {
            const queryText = 'call delete_recipe($1)';
            const values = [id];
            await this.pool.query(queryText, values);

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // recipes_ingredient
    async getAllRecipeIngredients(recipeId) {
        try {
            const { rows } = await this.pool.query(`select * from get_all_recipe_ingredients_by_recipe_id(${recipeId})`);
            return rows;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    // ingredients
    async getAllIngredients() {
        try {
            const { rows } = await this.pool.query(`select * from get_all_ingredients()`);
            return rows;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async addIngredient(name) {
        try {
            await this.pool.query('begin');

            const queryText = `call add_ingredient($1)`;
            const values = [name];
            await this.pool.query(queryText, values);

            await this.pool.query('commit');
            return true;
        } catch (error) {
            await this.pool.query('rollback');
            console.log(error);
            return false;
        }
    }

    async updateIngredient(id, name) {
        try {
            const queryText = 'call update_ingredient($1, $2)';
            const values = [id, name];
            await this.pool.query(queryText, values);

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // favoritesLists
    async getAllRecipesFromFavoritesList(userId) {
        try {
            const { rows } = await this.pool.query(`select * from get_all_recipes_from_favorites_list_by_user_id(${userId})`);
            return rows;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async getRecipeFromFavoritesList(recipeId, userId) {
        try {
            return await this.pool.query(`select get_recipe_from_favorites_list('${recipeId}', '${userId}')`);
        } catch (error) {
            console.log(error);
            return error;
        }
    }


    async addRecipeToFavoritesList(userId, recipeId) {
        try {
            const queryText = 'call add_recipe_to_favorites_list($1, $2)';
            const values = [userId, recipeId];
            await this.pool.query(queryText, values);

            return true
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async deleteRecipeFromFavoritesList(userId, recipeId) {
        try {
            const queryText = 'call delete_recipe_from_favorites_list($1, $2)';
            const values = [userId, recipeId];
            await this.pool.query(queryText, values);

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    // comments
    async getAllRecipeComments(recipeId) {
        try {
            const { rows } = await this.pool.query(`select * from get_all_recipe_comments_by_recipe_id(${recipeId})`);
            return rows;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async addCommentToRecipe(description, userId, recipeId) {
        try {
            const queryText = 'call add_comment_to_recipe($1, $2, $3)';
            const values = [description, userId, recipeId];
            await this.pool.query(queryText, values);

            return true
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async deleteCommentToRecipe(commentId) {
        try {
            const queryText = 'call delete_comment_from_recipe($1)';
            const values = [commentId];
            await this.pool.query(queryText, values);

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

module.exports = DB;
