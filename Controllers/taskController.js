const Task = require('../Models/task');

exports.tasksController = {

    getTasks(req, res) {
        const { body } = req;
        const queryPar = req.query;
        if (Object.keys(queryPar).length == 0) {              // if there is'nt query
            Task.find({ userEmail: (body.email) })
                .then(result => { res.json(result) })
                .catch(err => console.log(`Error getting Task from db: ${err}`));
        }
        else if (queryPar.category) {                            // in case we want to filter category with query request
            Task.find({ category: queryPar.category, userEmail: (body.email) })
                .then(result => { res.json(result) })
                .catch(err => console.log(`Error getting restaurant from db: ${err}`));
        }
    },

    getTask(req, res) {
        Task.findOne({ _id: req.params.taskId })
            .then(result => { res.json(result) })
    },

    addTask(req, res) {
        const { body } = req;
        console.log(body);
        const newTask = new Task(body);
        const result = newTask.save();
        if (result) {
            res.json(newTask);
        } else {
            res.status(404).send("Error saving a restaurant");
        }
    },

    searchTask(req, res) {
        const { email, searchBy } = req.body;
        if (searchBy) {
            let result = Task.search(searchBy);
            Task.find(result).find({ userEmail: email })
                .then(result => { res.json(result) });
        }
    },

    deleteTask(req, res) {
        Task.deleteOne({ _id: req.params.taskId })
            .then(docs => { res.json(docs) })
            .catch(err => console.log(`Error deleting restaurant from db: ${err}`));
    },

    updateTask(req, res) {
        const { body } = req;
        Task.findOneAndUpdate({ _id: body._id }, body, { new: true, useFindAndModify: false }, (err, task) => {
            if (err) return res.status(500).send(err);
            return res.send({
                message: "succesful"
            });
        })
    },
    getTasksByCategory(req, res) {
        const body = req.body;
        let countBy = [
            { "name": "Education", "all": 0, "done": 0 },
            { "name": "Training", "all": 0, "done": 0 },
            { "name": "Meeting", "all": 0, "done": 0 },
            { "name": "Home", "all": 0, "done": 0 },
            { "name": "General", "all": 0, "done": 0 }
        ];
        // const inc = a => a + 1;
        Task.find({ userEmail: (body.email) })
            .then(result => {
                result.map(task => {
                    if (task.category === "Education") {
                        countBy[0]["all"] += 1;
                        if (task.status === "Done")
                            countBy[0]["done"] += 1;
                    }
                    else if (task.category === "Training") {
                        countBy[1].all += 1;
                        if (task.status === "Done")
                            countBy[1].done += 1;
                    }
                    else if (task.category === "Meeting") {
                        countBy[2].all += 1;
                        if (task.status === "Done")
                            countBy[2].done += 1;
                    }
                    else if (task.category === "Home") {
                        countBy[3].all += 1;
                        if (task.status === "Done")
                            countBy[3].done += 1;
                    }
                    else if (task.category === "General") {
                        countBy[4].all += 1;
                        if (task.status === "Done")
                            countBy[4].done += 1;
                    }      
                })
                countBy.map(item=> {
                    console.log(item);
                })
                res.json(countBy);
            })
            .catch(err => console.log(`Error getting Task from db: ${err}`));
    }
};
