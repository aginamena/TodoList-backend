const express = require('express');
const app = express();
// converting the http request body to json format
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4000;
// To setup the endpoints we need to create an instance of the Express Router by adding the following line of code:
const todoRoutes = express.Router();
const TodoModel = require("./model");
require("dotenv").config


app.use(cors());
app.use(bodyParser.json());
// The router will be added as a middleware and will take control of request starting with path /Tddo:
app.use('/Todo', todoRoutes);



// adding endpoints

//adding get request to get all todo's
todoRoutes.route("/").get(async (req, res) => {
    const allTodos = await TodoModel.find({});
    res.send(allTodos);
})

//getting all active todo's
todoRoutes.route("/active").get(async (req, res) => {
    const activeTodos = await TodoModel.find({ isActive: true });
    if (activeTodos.length == 0) {
        // if there is no active todo, we return an empty array
        return res.send([]);
    }
    res.send(activeTodos);
})


//getting all completed todo's
todoRoutes.route("/completed").get(async (req, res) => {
    const activeTodos = await TodoModel.find({ isCompleted: true });
    if (activeTodos.length == 0) {
        // if there is no completed todo, we return an empty array
        return res.send([]);
    }
    res.send(activeTodos);

})


//clear completed todo's
todoRoutes.route("/clearAllCompleted").delete(async (req, res) => {
    const activeTodos = await TodoModel.find({ isCompleted: true });
    if (activeTodos.length == 0) {
        return res.send([]);
    }
    activeTodos.map(async todo => { await TodoModel.findByIdAndRemove(todo._id) });
    // fetching all todo's from the database
    const allTodos = await TodoModel.find({});
    res.send(allTodos);
})

//delete specific todo by id
todoRoutes.route("/:id").delete(async (req, res) => {
    await TodoModel.findByIdAndRemove(req.params.id);
    res.send("todo item has been deleted");
})

// adding new todo item to database
todoRoutes.route("/add").post((req, res) => {
    //do not add duplicate todo items
    let todo = new TodoModel(req.body);
    todo.save()
        .then(() => {
            return res.status(200).json({ name: todo.description, id: todo._id, completed: false });
        })
        .catch(() => {
            return res.status(400).send('adding new todo failed');
        })
})

//mark todo as completed. Order matters. This route has to be below the add route
//because of the dynamic id
todoRoutes.route("/:id").post((req, res) => {
    TodoModel.findByIdAndUpdate(req.params.id, { isCompleted: true, isActive: false }, (err, data) => {
        if (err) {
            return res.send("Can't mark todo as completed")
        }
        return res.send("Todo is marked as completed");
    });
})

mongoose.connect('mongodb://127.0.0.1:27017/TODO', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
})



app.listen(PORT || process.env.PORT, function () {
    console.log("Server is running on Port: " + PORT);
});