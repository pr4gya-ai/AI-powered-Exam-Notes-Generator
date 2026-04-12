import React from 'react'
import ReactMarkdown from 'react-markdown'
import { motion } from "framer-motion"
import { useState } from 'react'
import MermaidSetup from './MermaidSetup'
import RechartSetUp from './RechartSetUp'
import html2pdf from 'html2pdf.js'

const markDownComponent = {
    h1: ({ children }) => (
        <h1 className="text-2xl font-bold text-indigo-700 mt-6 mb-4 border-b pb-2">
            {children}
        </h1>
    ),
    h2: ({ children }) => (
        <h2 className="text-xl font-semibold text-indigo-600 mt-5 mb-3">
            {children}
        </h2>
    ),
    h3: ({ children }) => (
        <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
            {children}
        </h3>
    ),
    p: ({ children }) => (
        <p className="text-gray-700 leading-relaxed mb-3">
            {children}
        </p>
    ),
    ul: ({ children }) => (
        <ul className="list-disc ml-6 space-y-1 text-gray-700">
            {children}
        </ul>
    ),
    li: ({ children }) => (
        <li className="marker:text-indigo-500">{children}</li>
    ),
}

const downloadPdf = async (result) => {
    try {
        // Create HTML content for PDF
        let htmlContent = `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #4f46e5; text-align: center; margin-bottom: 30px;">📒 Generated Notes</h1>
        `;

        // Add subtopics
        if (result.subTopics) {
            htmlContent += `<h2 style="color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 5px;">⭐ Sub Topics</h2>`;
            Object.entries(result.subTopics).forEach(([star, topics]) => {
                htmlContent += `<h3 style="color: #4f46e5;">${star} Priority</h3>`;
                htmlContent += `<ul>`;
                topics.forEach(topic => {
                    htmlContent += `<li>${topic}</li>`;
                });
                htmlContent += `</ul>`;
            });
        }

        // Add detailed notes
        if (result.notes) {
            htmlContent += `<h2 style="color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 5px;">📝 Detailed Notes</h2>`;
            htmlContent += `<div style="line-height: 1.6;">${result.notes.replace(/\n/g, '<br>')}</div>`;
        }

        // Add revision points if available
        if (result.revisionPoints && result.revisionPoints.length > 0) {
            htmlContent += `<h2 style="color: #059669; border-bottom: 2px solid #059669; padding-bottom: 5px;">⚡ Exam Quick Revision Points</h2>`;
            htmlContent += `<ul>`;
            result.revisionPoints.forEach(point => {
                htmlContent += `<li>${point}</li>`;
            });
            htmlContent += `</ul>`;
        }

        // Add questions
        if (result.questions) {
            htmlContent += `<h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 5px;">❓ Important Questions</h2>`;

            if (result.questions.short && result.questions.short.length > 0) {
                htmlContent += `<h3 style="color: #dc2626;">Short Answer Questions</h3>`;
                htmlContent += `<ol>`;
                result.questions.short.forEach(question => {
                    htmlContent += `<li>${question}</li>`;
                });
                htmlContent += `</ol>`;
            }

            if (result.questions.long && result.questions.long.length > 0) {
                htmlContent += `<h3 style="color: #dc2626;">Long Answer Questions</h3>`;
                htmlContent += `<ol>`;
                result.questions.long.forEach(question => {
                    htmlContent += `<li>${question}</li>`;
                });
                htmlContent += `</ol>`;
            }

            if (result.questions.diagram) {
                htmlContent += `<h3 style="color: #dc2626;">Diagram-Based Question</h3>`;
                htmlContent += `<p>${result.questions.diagram}</p>`;
            }
        }

        htmlContent += `</div>`;

        // PDF options
        const options = {
            margin: 1,
            filename: `exam-notes-${result.topic || 'notes'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        // Generate and download PDF
        await html2pdf().set(options).from(htmlContent).save();

    } catch (error) {
        console.error('PDF generation failed:', error);
        alert('Failed to generate PDF. Please try again.');
    }
};

function normalizeMermaidDiagram(rawDiagram) {
    if (!rawDiagram || typeof rawDiagram !== 'string') return '';

    let value = rawDiagram.trim();
    value = value.replace(/```mermaid\s*/gi, '').replace(/```/g, '').trim();

    // extract and preserve header
    let header = 'graph TD';
    const headerMatch = value.match(/^\s*(graph\s+(TD|LR))\b/i);
    if (headerMatch) {
        header = headerMatch[1];
        value = value.slice(headerMatch[0].length).trim();
    }

    // if single-line path, extract explicit nodes/edges
    const nodePattern = /[A-Za-z0-9_]+\s*\[[^\]]+\]/g;
    const edgePattern = /[A-Za-z0-9_]+\s*--\s*>\s*[A-Za-z0-9_]+/g;

    const nodes = Array.from(new Set((value.match(nodePattern) || []).map((n) => n.trim())));
    const edges = Array.from(new Set((value.match(edgePattern) || []).map((e) => e.replace(/\s+/g, ' ').trim().replace(/\s*--\s*>\s*/, ' --> '))));

    if (nodes.length > 0 || edges.length > 0) {
        return [header, ...nodes, ...edges].join('\n');
    }

    // fallback to line normalization
    value = value
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.replace(/\s*--\>\s*/g, ' --> '))
        .join('\n');

    return value ? `${header}\n${value}` : '';
}

function FinalResult({ result }) {
    const [quickRevision, setQuickRevision] = useState(false)
    const hasStructuredData = result && result.subTopics && result.questions && result.questions.short && result.questions.long && result.revisionPoints;
    const hasNotesText = result && (typeof result.notes === 'string' && result.notes.trim().length > 0);

    if (!result || (!hasStructuredData && !hasNotesText)) {
        return null
    }

    const diagramInput = normalizeMermaidDiagram(result.diagram?.data || result.questions?.diagram);

    return (
        <div className='mt-6 p-3 space-y-10 bg-white'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <h2 className='text-3xl font-bold text-purple-700'>
                    📒 Generated Notes
                </h2>
                <div className='flex gap-3'>
                    <button onClick={() => setQuickRevision(!quickRevision)} className={`px-4 py-2 rounded-lg text-sm font-medium transition
                     ${quickRevision ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                        {quickRevision ? 'Exit Revision Mode' : 'Quick Revision (5 mins)'}  </button>

                    <button onClick={() => downloadPdf(result)  } className='px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700'>
                        ⬇️  Download PDF
                    </button>
                </div>
            </div>

            {!quickRevision && <section>
                <SectionHeader icon="⭐" title="Sub Topics" color="indigo" />
                {
                    Object.entries(result.subTopics).map(([star, topics]) => (
                        <div key={star} className='mb-4 rounded-lg bg-gray-50 border border-gray-200 p-3'>
                            <p className='font-medium text-indigo-600 mb-1'>
                                {star} Priority
                            </p>
                            <ul className='list-disc ml-4 text-gray-700'>
                                {topics.map((t, i) => (
                                    <li key={i}>{t}</li>
                                ))}
                            </ul>
                        </div>
                    ))
                }
            </section>}

            {!quickRevision &&
                <section>
                    <SectionHeader icon="📝" title="Detailed Notes" color="purple" />
                    <div className='bg-white border border-gray-200 rounded-xl p-6'>
                        <ReactMarkdown components={markDownComponent}>
                            {result.notes}
                        </ReactMarkdown>
                    </div>
                </section>}

            {quickRevision &&
                <section className='rounded-xl bg-gradient-to-r from-green-100 to-green-50 border border-green-200 p-6'>
                    <h3 className='font-bold text-green-700 mb-4 text-lg'>
                        ⚡ Exam Quick Revision Points
                    </h3>
                    <ul className='list-disc ml-6 space-y-1 text-gray-800'>
                        {result.revisionPoints.map((t, i) => (
                            <li key={i}>{t}</li>
                        ))}
                    </ul>
                </section>}

            {diagramInput && <section>
                <SectionHeader icon="📊" title="Diagram" color="cyan" />
                <MermaidSetup diagram={diagramInput} />
                <p className="mt-3 text-xs text-gray-500 italic">
                    ℹ️ If you need this diagram for future reference or revision,
                    you can save it by taking a screenshot.
                </p>
            </section>}

            {!diagramInput && (result.diagram?.data || result.questions?.diagram) && (
                <section>
                    <p className='text-sm text-gray-500'>Diagram text could not be rendered (invalid Mermaid syntax).</p>
                </section>
            )}

            {result.charts?.length > 0 && (
                <section>
                    <SectionHeader icon="📈" title="Visual Charts" color="indigo" />
                    <RechartSetUp charts={result.charts} />
                    <p className="mt-3 text-xs text-gray-500 italic">
                        ℹ️ If you need this Chart for future reference or revision,
                        you can save it by taking a screenshot.
                    </p>
                </section>
            )}

            {result.charts && result.charts.length === 0 && (
                <p className="text-sm text-gray-400 italic">
                    📉 Charts are not relevant for this topic.
                </p>
            )}

            <section>
                <SectionHeader icon="❓" title="Important Questions" color="rose" />
                <div className='space-y-4'>
                    {result.questions.short && result.questions.short.length > 0 && (
                        <div>
                            <h4 className='font-semibold text-rose-700 mb-2'>Short Answer Questions</h4>
                            <ul className='list-decimal ml-6 space-y-1 text-gray-700'>
                                {result.questions.short.map((q, i) => (
                                    <li key={i}>{q}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {result.questions.long && result.questions.long.length > 0 && (
                        <div>
                            <h4 className='font-semibold text-rose-700 mb-2'>Long Answer Questions</h4>
                            <ul className='list-decimal ml-6 space-y-1 text-gray-700'>
                                {result.questions.long.map((q, i) => (
                                    <li key={i}>{q}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {result.questions.diagram && (
                        <div>
                            <h4 className='font-semibold text-rose-700 mb-2'>Diagram-Based Question</h4>
                            <p className='text-gray-700'>{result.questions.diagram}</p>
                        </div>
                    )}
                </div>
            </section>

        </div>
    )
}

function SectionHeader({ icon, title, color }) {
    const colors = {
        indigo: "from-indigo-100 to-indigo-50 text-indigo-700",
        purple: "from-purple-100 to-purple-50 text-purple-700",
        blue: "from-blue-100 to-blue-50 text-blue-700",
        green: "from-green-100 to-green-50 text-green-700",
        cyan: "from-cyan-100 to-cyan-50 text-cyan-700",
        rose: "from-rose-100 to-rose-50 text-rose-700",
    };

    return (
        <div
            className={`mb-4 px-4 py-2 rounded-lg 
      bg-gradient-to-r ${colors[color]} 
      font-semibold flex items-center gap-2`}
        >
            <span>{icon}</span>
            <span>{title}</span>
        </div>
    );
}

export default FinalResult
