import Notes from "../models/notesModel.js";

export const getMyNotes = async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.userId })
            .select("topic classLevel examType revisionMode includeDiagrams includeCharts diagrams charts createdAt")
            .sort({ createdAt: -1 });

        if (!notes) {
            return res.status(404).json({
                error: "Note not found"
            });
        }

        // Normalize notes so UI can rely on includeDiagrams/includeCharts regardless of how notes were saved.
        const normalized = notes.map((note) => {
            const obj = note.toObject();

            return {
                ...obj,
                includeDiagrams: Boolean(obj.includeDiagrams ?? obj.diagrams),
                includeCharts: Boolean(obj.includeCharts ?? obj.charts),
            };
        });

        return res.status(200).json(normalized);

    } catch (error) {
        return res.status(500).json({ message: `getMyNotes error ${error}` });
    }
};

export const getSingleNotes = async (req, res) => {
    try {
        const notes = await Notes.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!notes) {
            return res.status(404).json({
                error: "Note not found"
            });
        }

        const noteObj = notes.toObject();

        const contentAtom = noteObj.content || {}

        const resultPayload = typeof contentAtom === 'object'
            ? {
                ...contentAtom,
                topic: noteObj.topic,
                createdAt: noteObj.createdAt,
                classLevel: noteObj.classLevel,
                examType: noteObj.examType,
                revisionMode: Boolean(noteObj.revisionMode),
                includeDiagrams: Boolean(noteObj.includeDiagrams),
                includeCharts: Boolean(noteObj.includeCharts)
            }
            : {
                notes: contentAtom,
                topic: noteObj.topic,
                createdAt: noteObj.createdAt,
                classLevel: noteObj.classLevel,
                examType: noteObj.examType,
                revisionMode: Boolean(noteObj.revisionMode),
                includeDiagrams: Boolean(noteObj.includeDiagrams),
                includeCharts: Boolean(noteObj.includeCharts)
            }

        return res.json(resultPayload);

    } catch (error) {
        return res.status(500).json({ message: `getSingleNotes error ${error}` });
    }
};