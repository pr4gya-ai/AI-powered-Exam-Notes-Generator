import mongoose from 'mongoose';


const notesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    
    classLevel: String,
    examType: String, 

    revisionMode: {
        type: Boolean,
        default: false
    },

    includeDiagrams: Boolean,
    includeCharts: Boolean,

    content:{
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
}, {timestamps: true });

const NotesModel = mongoose.model("Notes", notesSchema);

export default NotesModel;

