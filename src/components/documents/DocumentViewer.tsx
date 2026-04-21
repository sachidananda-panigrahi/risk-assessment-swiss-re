import { useCallback, useEffect, useRef, useState } from "react";
import ProgressBar from "../common/ProgressBar";

export interface DocFile {
  id: string;
  name: string;
  sizeMB: number;
  pages: number;
}

interface Annotation {
  id: string;
  page: number;
  x: number;
  y: number;
  text: string;
  author: string;
  timestamp: string;
}

type LoadState = "idle" | "loading" | "ready" | "error" | "cancelled";

interface DocumentViewerProps {
  doc: DocFile;
}

const LOAD_PHASES = [
  "Fetching document metadata...",
  "Validating integrity...",
  "Loading pages 1–10...",
  "Streaming page content...",
  "Rendering document...",
];

export default function DocumentViewer({ doc }: DocumentViewerProps) {
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [progress, setProgress] = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [pendingComment, setPendingComment] = useState<{ x: number; y: number; page: number } | null>(null);
  const [commentText, setCommentText] = useState("");
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelRef = useRef(false);

  const startLoad = useCallback(() => {
    cancelRef.current = false;
    setLoadState("loading");
    setProgress(0);
    setPhaseIdx(0);

    // Simulate a 5% chance of failure for demo
    const willFail = Math.random() < 0.05;
    const failAt = willFail ? Math.floor(Math.random() * 70) + 20 : 101;

    let p = 0;
    timerRef.current = setInterval(() => {
      if (cancelRef.current) {
        clearInterval(timerRef.current!);
        setLoadState("cancelled");
        return;
      }

      p += Math.random() * 4 + 1;
      if (p >= failAt && willFail) {
        clearInterval(timerRef.current!);
        setLoadState("error");
        setProgress(Math.min(p, failAt));
        return;
      }

      const capped = Math.min(p, 100);
      setProgress(capped);
      setPhaseIdx(Math.floor((capped / 100) * LOAD_PHASES.length));

      if (capped >= 100) {
        clearInterval(timerRef.current!);
        setLoadState("ready");
      }
    }, 60);
  }, []);

  useEffect(() => {
    startLoad();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [doc.id, startLoad]);

  const handleCancel = () => {
    cancelRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    setLoadState("cancelled");
  };

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!editMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPendingComment({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
      page: currentPage,
    });
  };

  const submitComment = () => {
    if (!pendingComment || !commentText.trim()) return;
    setAnnotations((prev) => [
      ...prev,
      {
        id: `ann-${Date.now()}`,
        page: pendingComment.page,
        x: pendingComment.x,
        y: pendingComment.y,
        text: commentText.trim(),
        author: "Evano",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setPendingComment(null);
    setCommentText("");
  };

  const pageAnnotations = annotations.filter((a) => a.page === currentPage);

  // ── Loading state ──────────────────────────────────────────────
  if (loadState === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-10">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-500/15 flex items-center justify-center">
          <svg className="animate-spin text-brand-500" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
          </svg>
        </div>
        <div className="w-full max-w-sm space-y-3 text-center">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {LOAD_PHASES[Math.min(phaseIdx, LOAD_PHASES.length - 1)]}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {doc.name} — {doc.sizeMB.toFixed(0)} MB
          </p>
          <ProgressBar value={progress} cancelable onCancel={handleCancel} />
        </div>
      </div>
    );
  }

  if (loadState === "error") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-10">
        <div className="w-14 h-14 rounded-2xl bg-error-50 dark:bg-error-500/15 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2.5" />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-800 dark:text-white mb-1">Failed to load document</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Network error at {Math.round(progress)}% — connection interrupted.</p>
          <button onClick={startLoad} className="px-4 py-2 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loadState === "cancelled") {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-10">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Load cancelled.</p>
        <button onClick={startLoad} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          Reload Document
        </button>
      </div>
    );
  }

  // ── Document ready ─────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex-wrap">
        <button
          onClick={() => setEditMode(!editMode)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
            ${editMode ? "bg-brand-500 text-white" : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          {editMode ? "Editing" : "Edit"}
        </button>

        <button
          onClick={() => setShowSplitModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="2" x2="12" y2="22" /><path d="M2 7l10-5 10 5" /><path d="M2 17l10 5 10-5" />
          </svg>
          Split
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 6H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" />
            <rect x="14" y="2" width="8" height="8" rx="2" />
          </svg>
          Merge
        </button>

        <button
          onClick={() => setShowAnnotations(!showAnnotations)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
            ${showAnnotations ? "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400 border border-warning-200 dark:border-warning-500/20" : "border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Comments {annotations.length > 0 && <span className="bg-brand-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">{annotations.length}</span>}
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-error-200 dark:border-error-500/20 text-xs font-medium text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-500/10 transition-colors ml-auto"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          </svg>
          Delete
        </button>
      </div>

      {editMode && (
        <div className="px-4 py-2 bg-brand-50 dark:bg-brand-500/10 border-b border-brand-100 dark:border-brand-500/20">
          <p className="text-xs text-brand-600 dark:text-brand-400">
            Edit mode active — click anywhere on the document to add a comment annotation.
          </p>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Document canvas */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-gray-950">
          {/* Page navigation */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 disabled:opacity-30 hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">Page {currentPage} of {doc.pages}</span>
            <button
              disabled={currentPage >= doc.pages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 disabled:opacity-30 hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>

          {/* Simulated page content */}
          <div
            className="relative bg-white dark:bg-gray-900 rounded-xl shadow-md mx-auto"
            style={{ maxWidth: 680, minHeight: 880, cursor: editMode ? "crosshair" : "default" }}
            onClick={handlePageClick}
          >
            {/* Mock page content */}
            <div className="p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">DOCUMENT</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{doc.name}</p>
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500">Page {currentPage}</span>
              </div>
              {[...Array(12)].map((_, i) => (
                <div key={i} className="space-y-1.5">
                  {i % 4 === 0 && <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />}
                  <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded" style={{ width: `${70 + Math.sin(i * 2.3) * 25}%` }} />
                  <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded" style={{ width: `${60 + Math.cos(i * 1.7) * 30}%` }} />
                </div>
              ))}
            </div>

            {/* Annotation pins */}
            {pageAnnotations.map((ann) => (
              <div
                key={ann.id}
                className="absolute"
                style={{ left: `${ann.x}%`, top: `${ann.y}%`, transform: "translate(-50%, -50%)" }}
              >
                <div className="group relative">
                  <div className="w-5 h-5 rounded-full bg-warning-400 border-2 border-white dark:border-gray-900 shadow-md cursor-pointer hover:scale-110 transition-transform flex items-center justify-center">
                    <span className="text-[9px] text-white font-bold">!</span>
                  </div>
                  <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-40 rounded-lg bg-gray-900 dark:bg-gray-100 p-2 text-xs text-white dark:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                    <p className="font-medium">{ann.author} · {ann.timestamp}</p>
                    <p className="mt-0.5 text-gray-300 dark:text-gray-600">{ann.text}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Pending comment input */}
            {pendingComment && pendingComment.page === currentPage && (
              <div
                className="absolute z-20"
                style={{ left: `${pendingComment.x}%`, top: `${pendingComment.y}%` }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-56 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl p-3">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">Add comment</p>
                  <textarea
                    autoFocus
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-2 py-1.5 text-xs text-gray-800 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                    placeholder="Type your comment..."
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => { setPendingComment(null); setCommentText(""); }} className="flex-1 py-1 rounded-lg border border-gray-200 dark:border-gray-600 text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                    <button onClick={submitComment} className="flex-1 py-1 rounded-lg bg-brand-500 text-white text-xs font-medium hover:bg-brand-600 transition-colors">Post</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Annotations panel */}
        {showAnnotations && (
          <div className="w-64 border-l border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                Comments ({annotations.length})
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {annotations.length === 0 ? (
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">No comments yet. Enable Edit mode and click on the document.</p>
              ) : (
                annotations.map((ann) => (
                  <div key={ann.id} className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{ann.author}</span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">p.{ann.page}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{ann.text}</p>
                    <p className="text-[10px] text-gray-300 dark:text-gray-600 mt-1">{ann.timestamp}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Split modal */}
      {showSplitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowSplitModal(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-4">Split Document</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Total: {doc.pages} pages</p>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">From page</label>
                <input type="number" min={1} max={doc.pages} defaultValue={1} className="w-full h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-gray-800 dark:text-gray-100" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">To page</label>
                <input type="number" min={1} max={doc.pages} defaultValue={doc.pages} className="w-full h-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-gray-800 dark:text-gray-100" />
              </div>
            </div>
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setShowSplitModal(false)} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => setShowSplitModal(false)} className="px-4 py-2 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors">Split</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-gray-800 dark:text-white mb-2">Delete Document?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This will permanently delete <strong>{doc.name}</strong>. This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 rounded-lg bg-error-500 text-white text-sm font-medium hover:bg-error-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
