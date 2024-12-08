let mongoose = require('mongoose');
let Assignment = require('../model/assignment');

// Récupérer tous les assignments (GET)
async function getAssignments(req, res) {
    console.log("Requête reçue pour récupérer tous les assignments");

    var aggregateQuery = Assignment.aggregate();

    Assignment.aggregatePaginate(aggregateQuery, {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
    }, (err, assignments) => {
        if (err) {
            console.log("Erreur lors de la récupération des assignments:", err);
            //res.status(500).send(err);
        } else {
            console.log("Assignments récupérés avec succès:", assignments);
            res.status(200).json(assignments);
        }
    });
}

// Récupérer un assignment par son id (GET)
async function getAssignment(req, res) {
    let assignmentId = parseInt(req.params.id, 10);
    //console.log("ID de l'assignment à récupérer:", assignmentId);

    if (isNaN(assignmentId)) {
        //console.log("ID de l'assignment invalide:", assignmentId);
        //return res.status(400).json({ message: 'Invalid assignment ID' });
    }

    try {
        let assignment = await Assignment.findOne({ id: assignmentId });
        if (!assignment) {
            console.log("Assignment non trouvé pour l'ID:", assignmentId);
            return res.status(404).json({ message: 'Assignment not found' });
        }
        console.log("Assignment récupéré avec succès:", assignment);
        res.status(200).json(assignment);
    } catch (err) {
        //console.log("Erreur lors de la récupération de l'assignment:", err);
        //res.status(500).send(err);
    }
}

// Ajout d'un assignment (POST)
async function postAssignment(req, res) {
    console.log("Requête reçue pour ajouter un assignment");
    console.log("Corps de la requête:", req.body);

    let assignmentId = parseInt(req.body.id, 10);
    console.log("ID de l'assignment après conversion:", assignmentId);

    if (isNaN(assignmentId)) {
        //console.log("ID de l'assignment invalide:", assignmentId);
        //return res.status(400).json({ message: 'Invalid assignment ID' });
    }

    let assignment = new Assignment();
    assignment.id = req.body.id || Math.floor(Math.random() * 1000000);
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;

    console.log("POST assignment reçu :");
    console.log(assignment);

    try {
        await assignment.save();
        console.log("Assignment sauvegardé avec succès:", assignment);
        res.status(201).json({ message: `${assignment.nom} saved!` });
    } catch (err) {
        console.log("Erreur lors de la sauvegarde de l'assignment:", err);
        res.status(500).send('cant post assignment ', err);
    }
}

// Update d'un assignment (PUT)
async function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);

    let assignmentId = req.body._id;

    if (!assignmentId) {
        console.log("ID de l'assignment invalide:", assignmentId);
        return res.status(400).json({ message: 'Invalid assignment ID' });
    }

    try {
        let assignment = await Assignment.findByIdAndUpdate(assignmentId, req.body, { new: true });
        if (!assignment) {
            console.log("Assignment non trouvé pour l'ID:", assignmentId);
            return res.status(404).json({ message: 'Assignment not found' });
        }
        console.log("Assignment mis à jour avec succès:", assignment);
        res.status(200).json({ message: 'updated' });
    } catch (err) {
        console.log("Erreur lors de la mise à jour de l'assignment:", err);
        res.status(500).send(err);
    }
}

// Suppression d'un assignment (DELETE)
async function deleteAssignment(req, res) {
    let assignmentId = req.params.id;
    console.log("ID de l'assignment à supprimer:", assignmentId);

    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
        console.log("ID de l'assignment invalide:", assignmentId);
        return res.status(400).json({ message: 'Invalid assignment ID' });
    }

    try {
        let assignment = await Assignment.findByIdAndDelete(assignmentId);
        if (!assignment) {
            console.log("Assignment non trouvé pour l'ID:", assignmentId);
            return res.status(404).json({ message: 'Assignment not found' });
        }
        console.log("Assignment supprimé avec succès:", assignment);
        res.status(200).json({ message: `${assignment.nom} deleted` });
    } catch (err) {
        console.log("Erreur lors de la suppression de l'assignment:", err);
        res.status(500).send(err);
    }
}

module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };