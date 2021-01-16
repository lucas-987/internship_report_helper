const mongoose = require('mongoose');

const ReportableSchema = function(paths) {
    let schema = new mongoose.Schema({
        title: String,
        description: String,
        start_date: {type: Date},
        end_date: {type: Date}
    });

    if(paths != undefined) {
        schema.add(paths);
    }

    return schema;
}

const taskSchema = new ReportableSchema({actions: [new ReportableSchema()]});

const internshipSchema = new ReportableSchema({tasks: [taskSchema]});

const internshipModel = mongoose.model('Internship', internshipSchema);

module.exports = internshipModel;