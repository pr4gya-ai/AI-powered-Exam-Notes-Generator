import NotesModel from "../models/notesModel.js";
import UserModel from "../models/userModel.js";
import { buildPrompt } from "../utils/promptBuilder.js";
import { generateGeminiResponse } from "../services/gemini.services.js";
import { error } from "console";

export const generateNotes = async (req, res) => {
  try {
    const {
      topic,
      classLevel,
      examType,
      revisionMode = false,
      includeDiagrams = false,
      includeCharts = false,
    } = req.body;

    // console.log("generateNotes request body:", req.body);
    if (!topic) {
      return res.status(400).json({ message: "Topic is required." });
    }

    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (user.credits < 10) {
      user.isCreditAvailable = false;
      await user.save();

      return res.status(403).json({
        error: "Insufficient credits",
        creditsLeft: user.credits,
        message: "You do not have enough credits to generate notes. Please purchase more credits to continue."
        
      });
    }

    const prompt = buildPrompt({
      topic,
      classLevel,
      examType,
      revisionMode,
      includeDiagrams,
      includeCharts,
    });

    const aiResponse = await generateGeminiResponse(prompt);

    const normalizeNotesResponse = (response) => {
      const defaults = {
        subTopics: { "⭐": [], "⭐⭐": [], "⭐⭐⭐": [] },
        importance: "⭐",
        notes: "",
        revisionPoints: [],
        questions: { short: [], long: [], diagram: "" },
        diagram: { type: "", data: "" },
        charts: [],
      };

      if (!response || typeof response !== "object") {
        return { ...defaults, notes: String(response || "") };
      }

      const normalized = {
        ...defaults,
        ...response,
      };

      // in case AI returned from fallback style { content: text }
      if (!normalized.notes && typeof normalized.content === "string") {
        normalized.notes = normalized.content;
      }

      if (!normalized.subTopics || typeof normalized.subTopics !== "object") {
        normalized.subTopics = defaults.subTopics;
      }
      if (!normalized.questions || typeof normalized.questions !== "object") {
        normalized.questions = defaults.questions;
      }
      if (!Array.isArray(normalized.revisionPoints)) {
        normalized.revisionPoints = defaults.revisionPoints;
      }
      if (!Array.isArray(normalized.charts)) {
        normalized.charts = defaults.charts;
      }

      return normalized;
    };

    const normalizedResponse = normalizeNotesResponse(aiResponse);

    const notes = await NotesModel.create({
      user: user._id,
      topic,
      classLevel,
      examType,
      revisionMode,
      includeDiagrams,
      includeCharts,
      content: normalizedResponse,
    });

    user.credits -= 10;

    if (user.credits <= 0) {
      user.isCreditAvailable = false;
    }

    if (!Array.isArray(user.notes)) {
      user.notes = [];
    }

    user.notes.push(notes._id);

    await user.save();

    return res.status(200).json({
      data: normalizedResponse,
      noteId: notes._id,
      creditsLeft: user.credits,
    });

  } catch (error) {
    console.error("generateNotes error:", error);

    res.status(500).json({
      error: "AI generation failed. Please try again later.",
      message: error?.message,
      stack: error?.stack,
    });
  }
};