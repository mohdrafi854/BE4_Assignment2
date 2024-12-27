const express = require("express");
const app = express();



const { initializeDatabase } = require("./db/db.connect");
const Recipe = require("./models/recipe.models");

app.use(cors())
app.use(express.json());

initializeDatabase();

async function createRecipe(newRecipe) {
  try {
    const recipe = new Recipe(newRecipe);
    const saveRecipe = await recipe.save();
   // console.log("Recipe data", saveRecipe);
  } catch (error) {
    throw error;
  }
}

app.post("/recipes", async (req, res) => {
  try {
    const saveRecipe = createRecipe(req.body);
    res
      .status(201)
      .json({ message: "Recipe Added Successfully", movie: saveRecipe });
  } catch (error) {
    res.status(500).json({ error: "Failed to add recipe" });
  }
});

//get all recipe from Database
async function allRecipe() {
  try {
    const recipe = await Recipe.find();
    return recipe;
  } catch (error) {
    throw error;
  }
}

app.get("/", async (req, res) => {
  try {
    const recipe = await allRecipe();
    if (recipe.length != 0) {
      res.json(recipe);
    } else {
      res.status(404).json({ error: "recipe does not exist" });
    }
  } catch (error) {
    res.status(500).json({ error: "failed to fech recipe" });
  }
});


//get a recipe's details by its title
async function readRecipeByTitle(recipeTitle){
  try {
    const recipe = await Recipe.find({title: recipeTitle});
    return recipe
  } catch (error) {
    throw error
  }
}

app.get("/recipes/title/:titleId", async (req, res) => {
  try {
    const recipeTitle = await readRecipeByTitle(req.params.titleId);
    if(recipeTitle){
      res.json(recipeTitle)
    }else{
      res.status(404).json({error: "recipe does not exist."})
    }
  } catch (error) {
    res.status(500).json({error:"Failed to fetch recipe"})
  }
})

// get details of all the recipes by an author
async function readRecipeByAuthor(recipeAuthor){
  try {
    const recipe = await Recipe.find({author : recipeAuthor});
    return recipe
  } catch (error) {
    throw error;
  }
}

app.get("/recipes/author/:authorId", async(req, res) => {
  try {
    const recipe = await readRecipeByAuthor(req.params.authorId);
    if(recipe.length != 0){
      res.json(recipe)
    }else{
      res.status(404).json({error : "recipe author does not exist."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to fetch recipe"});
  }
})

// get all the recipes which is difficulty level "Easy"
async function readRecipeByLevel(difficultyLevel){
  try {
    const getLevel = await Recipe.find({difficulty : difficultyLevel})
    return getLevel
  } catch (error) {
    throw error
  }
}

app.get("/recipes/level/:difficultyLevel", async (req, res) => {
  try {
    const recipe = await readRecipeByLevel(req.params.difficultyLevel);
    if(recipe){
      res.json(recipe)
    }else{
      res.status(404).json({error : "difficulty level does not exist."})
    }
  } catch (error) {
    res.status(500).json({error: "Failed to fetch recipe"})
  }
})

// recipe difficulty level update by id
async function readRecipeByUpdateId(recipeId, dataToUpdate){
  try {
    const recipeUpdate = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate, {new:true})
    return recipeUpdate
  } catch (error) {
    throw error;
  }
}

app.post("/recipes/:recipeId", async (req, res) => {
  try {
    const recipe = await readRecipeByUpdateId(req.params.recipeId, req.body);
    if(recipe){
      res.status(200).json({message: "recipe updated successfully"})
    }else{
      res.status(404).json({error: "Recipe not found"})
    }
  } catch (error) {
    res.status(500).json({error:"Failed to update recipe"})
  }
})

// update a recipe with the help of its title
async function readRecipeUpdateByTitle(recipeTitle, dataToUpdate){
  try {
    const updateByTitle = await Recipe.findOneAndUpdate({title:recipeTitle}, dataToUpdate, {new:true});
    return updateByTitle
  } catch (error) {
    throw error
  }
}

app.post("/recipes/title/:titleName", async(req, res) => {
  try {
    const recipe = await readRecipeUpdateByTitle(req.params.titleName, req.body);
    if(recipe){
      res.status(200).json({message: "recipe update successfully"})
    }else{
      res.status(404).json({error: "Recipe not found"})
    }
  } catch (error) {
    res.status(500).json({error:"Failed to fetch recipe"})
  }
})

//delete a recipe with the help of a recipe id
async function readRecipeDeleteById(recipeId){
  try {
    const deletebyId = await Recipe.findByIdAndDelete(recipeId)
    return deletebyId
  } catch (error) {
    throw error
  }
}

app.delete("/recipes/:id", async (req, res) => {
  try {
    const recipe = await readRecipeDeleteById(req.params.id);
    if(recipe){
      res.status(200).json({message: "Recipe Delete Successfully."})
    } 
  } catch (error) {
    res.status(500).json({error : "Failed to delete recipe."})
  }
})

const PORT = 3000;
app.listen(PORT, () => {
  console.log("server running on port", PORT);
});
