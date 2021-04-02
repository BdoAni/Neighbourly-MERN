const ProjectController = require("../controllers/project.controller");

module.exports = app => {
    // Creating a new author
    app.post("/api/user", ProjectController.createNewUser);
    app.post("/api/user/:id/tool", ProjectController.createNewTool);
    app.post("/api/user/:id/review", ProjectController.createNewReview);
    app.post("/api/user/login", ProjectController.loginUser);
    // app.post("/api/:id/:tool", ProjectController.getOneToolPrice);
    // Read
    app.get("/api/user", ProjectController.getAllUsers);
    app.get("/api/user/:id", ProjectController.getOneUser);
    app.get("/api/tool/:id", ProjectController.getOneTool);
    app.get("/api/tool/", ProjectController.getAllTools);
    app.get("/api/review/:id", ProjectController.getOneReview);
    app.get("/api/tool/:id/price", ProjectController.getOneToolPrice);
    // Update
    app.put("/api/user/:id", ProjectController.updateUser);
    app.put("/api/tool/:id", ProjectController.updateTool);
    app.put("/api/review/:id", ProjectController.updateReview);
    app.put("/api/tool/:id/:tool_id", ProjectController.deleteTool);
    app.put("/api/review/:id/:review_id", ProjectController.deleteReview);
    // Delete
    app.delete("/api/user/:id", ProjectController.deleteUser);
};