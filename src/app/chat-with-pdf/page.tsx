"use client";

import type { PDFDocumentProxy } from "pdfjs-dist";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  FileSearch,
  FileText,
  LoaderCircle,
  LockKeyhole,
  MessageSquareText,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import {
  type ChangeEvent,
  type DragEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import ToolSEOSection from "@/components/ToolSEOSection";
import { trackEvent } from "@/lib/analytics";
import {
  type PDFChatCitation,
  type PDFChatHistoryMessage,
  type PDFChatPage,
  normalizeWhitespace,
  selectRelevantPages,
} from "@/lib/pdfChat";
import toolSeoData from "@/lib/toolSeoData";

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MAX_PAGES = 1_000;

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: PDFChatCitation[];
  suggestions?: string[];
};

const STARTER_QUESTIONS = [
  "Summarize the main points of this document.",
  "What dates, deadlines, or obligations are mentioned?",
  "What are the most important risks or exceptions?",
];

const CSS = `
*,*::before,*::after{box-sizing:border-box}
.chatpdf-page{min-height:100vh;padding-top:56px;background:#f8fafc;color:#172033}.chatpdf-wrap{width:min(1120px,calc(100% - 36px));margin:0 auto}
.chatpdf-hero{position:relative;overflow:hidden;padding:74px 0 44px;text-align:center;background:radial-gradient(circle at 50% 0,rgba(124,58,237,.16),transparent 42%),linear-gradient(180deg,#faf7ff,#f8fafc)}
.chatpdf-hero::before,.chatpdf-hero::after{content:'';position:absolute;border:1px solid rgba(124,58,237,.1);border-radius:70px;transform:rotate(27deg);pointer-events:none}.chatpdf-hero::before{width:300px;height:300px;left:-190px;top:-170px}.chatpdf-hero::after{width:260px;height:260px;right:-170px;bottom:-170px}
.chatpdf-badge{display:inline-flex;align-items:center;gap:7px;padding:7px 12px;border:1px solid rgba(124,58,237,.2);border-radius:999px;background:rgba(255,255,255,.85);color:#6d28d9;font-size:10px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;box-shadow:0 8px 28px rgba(76,29,149,.08)}
.chatpdf-hero h1{max-width:780px;margin:20px auto 14px;font-family:var(--font-jakarta,system-ui);font-size:clamp(40px,7vw,70px);font-weight:850;letter-spacing:-.065em;line-height:.95}.chatpdf-hero h1 span{color:#7c3aed}.chatpdf-hero>div>p{max-width:650px;margin:0 auto;color:#64748b;font-size:15px;line-height:1.7}
.chatpdf-trust{display:flex;justify-content:center;gap:17px;flex-wrap:wrap;margin-top:23px;color:#475569;font-size:11px;font-weight:650}.chatpdf-trust span{display:flex;align-items:center;gap:6px}.chatpdf-trust svg{color:#7c3aed}
.chatpdf-main{padding:34px 0 78px}.chatpdf-shell{overflow:hidden;border:1px solid #e2e8f0;border-radius:24px;background:#fff;box-shadow:0 28px 80px rgba(15,23,42,.1)}
.chatpdf-upload{padding:32px}.chatpdf-drop{display:flex;min-height:340px;flex-direction:column;align-items:center;justify-content:center;padding:45px 24px;border:2px dashed #cbd5e1;border-radius:18px;background:linear-gradient(145deg,#fff,#faf7ff);text-align:center;cursor:pointer;transition:.18s}.chatpdf-drop:hover,.chatpdf-drop.dragging{border-color:#8b5cf6;background:#faf5ff}.chatpdf-upload-icon{display:grid;place-items:center;width:70px;height:70px;margin-bottom:19px;border-radius:21px;background:linear-gradient(135deg,#ede9fe,#f5f3ff);color:#7c3aed;box-shadow:inset 0 0 0 1px #ddd6fe}.chatpdf-drop h2{margin:0 0 8px;font:800 23px/1.2 var(--font-jakarta,system-ui);letter-spacing:-.04em}.chatpdf-drop p{margin:0;color:#64748b;font-size:12px;line-height:1.6}.chatpdf-choose{display:inline-flex;align-items:center;gap:8px;margin-top:20px;padding:12px 18px;border:0;border-radius:11px;background:#6d28d9;color:#fff;font-size:12px;font-weight:800;box-shadow:0 10px 24px rgba(109,40,217,.25)}.chatpdf-limits{margin-top:12px!important;color:#94a3b8!important;font-size:10px!important}
.chatpdf-processing{display:flex;min-height:340px;flex-direction:column;align-items:center;justify-content:center;padding:40px;text-align:center}.chatpdf-spinner{display:grid;place-items:center;width:66px;height:66px;margin-bottom:18px;border-radius:20px;background:#f3e8ff;color:#7c3aed}.chatpdf-spinner svg{animation:chatpdf-spin .8s linear infinite}.chatpdf-processing h2{margin:0 0 7px;font:800 21px/1.2 var(--font-jakarta,system-ui)}.chatpdf-processing p{margin:0;color:#64748b;font-size:11px}.chatpdf-progress{width:min(350px,100%);height:7px;margin-top:18px;border-radius:99px;background:#ede9fe;overflow:hidden}.chatpdf-progress div{height:100%;border-radius:99px;background:linear-gradient(90deg,#6d28d9,#a78bfa);transition:width .2s}
.chatpdf-workspace{display:grid;grid-template-columns:300px minmax(0,1fr);min-height:650px}.chatpdf-sidebar{display:flex;flex-direction:column;padding:22px;border-right:1px solid #e2e8f0;background:#fafafa}.chatpdf-document{padding:16px;border:1px solid #e2e8f0;border-radius:14px;background:#fff}.chatpdf-document-head{display:flex;gap:11px;align-items:flex-start}.chatpdf-document-icon{display:grid;place-items:center;width:40px;height:40px;flex:0 0 auto;border-radius:11px;background:#ede9fe;color:#6d28d9}.chatpdf-document h2{overflow:hidden;margin:1px 0 4px;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-weight:800}.chatpdf-document p{margin:0;color:#64748b;font-size:9px}.chatpdf-stats{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:14px}.chatpdf-stat{padding:10px;border-radius:10px;background:#f8fafc}.chatpdf-stat strong{display:block;font:800 17px/1 var(--font-jakarta,system-ui)}.chatpdf-stat span{display:block;margin-top:5px;color:#94a3b8;font-size:8px;font-weight:750;letter-spacing:.06em;text-transform:uppercase}
.chatpdf-private{display:flex;gap:9px;margin-top:13px;padding:12px;border:1px solid #ddd6fe;border-radius:11px;background:#faf5ff;color:#5b21b6}.chatpdf-private svg{flex:0 0 auto}.chatpdf-private strong{display:block;font-size:9px}.chatpdf-private p{margin:3px 0 0;color:#7c3aed;font-size:8px;line-height:1.5}.chatpdf-side-title{margin:23px 0 9px;color:#94a3b8;font-size:8px;font-weight:850;letter-spacing:.1em;text-transform:uppercase}.chatpdf-starter{width:100%;margin-bottom:7px;padding:10px 11px;border:1px solid #e2e8f0;border-radius:10px;background:#fff;color:#475569;text-align:left;font-size:9px;font-weight:650;line-height:1.45;cursor:pointer;transition:.14s}.chatpdf-starter:hover{border-color:#c4b5fd;color:#6d28d9;background:#faf5ff}.chatpdf-source{padding:12px;border:1px solid #c4b5fd;border-radius:11px;background:#fff}.chatpdf-source strong{display:block;color:#6d28d9;font-size:9px}.chatpdf-source p{margin:6px 0 0;color:#64748b;font-size:9px;line-height:1.55}.chatpdf-reset{display:flex;align-items:center;justify-content:center;gap:7px;width:100%;margin-top:auto;padding:10px;border:1px solid #e2e8f0;border-radius:9px;background:#fff;color:#64748b;font-size:9px;font-weight:750;cursor:pointer}
.chatpdf-chat{display:flex;min-width:0;flex-direction:column;background:#fff}.chatpdf-chat-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:17px 22px;border-bottom:1px solid #eef2f7}.chatpdf-chat-title{display:flex;align-items:center;gap:10px}.chatpdf-ai-icon{display:grid;place-items:center;width:37px;height:37px;border-radius:11px;background:linear-gradient(135deg,#6d28d9,#9333ea);color:#fff}.chatpdf-chat-head h2{margin:0 0 3px;font-size:12px;font-weight:800}.chatpdf-chat-head p{margin:0;color:#94a3b8;font-size:8px}.chatpdf-online{display:flex;align-items:center;gap:5px;color:#15803d;font-size:8px;font-weight:800}.chatpdf-online::before{content:'';width:6px;height:6px;border-radius:50%;background:#22c55e;box-shadow:0 0 0 3px #dcfce7}
.chatpdf-messages{flex:1;overflow-y:auto;padding:22px;background:linear-gradient(180deg,#fff,#fcfcff)}.chatpdf-message{display:flex;gap:10px;margin-bottom:20px;animation:chatpdf-in .22s ease}.chatpdf-message.user{flex-direction:row-reverse}.chatpdf-avatar{display:grid;place-items:center;width:31px;height:31px;flex:0 0 auto;border-radius:9px;background:#ede9fe;color:#6d28d9}.chatpdf-message.user .chatpdf-avatar{background:#172033;color:#fff}.chatpdf-bubble{max-width:min(660px,84%);padding:13px 15px;border:1px solid #e2e8f0;border-radius:4px 15px 15px;background:#fff;color:#334155;font-size:11px;line-height:1.7;box-shadow:0 5px 18px rgba(15,23,42,.04)}.chatpdf-message.user .chatpdf-bubble{border-color:#6d28d9;border-radius:15px 4px 15px 15px;background:#6d28d9;color:#fff}.chatpdf-md h2,.chatpdf-md h3{margin:12px 0 6px;color:#172033;font-size:12px}.chatpdf-md p{margin:0 0 8px}.chatpdf-md p:last-child{margin-bottom:0}.chatpdf-md ul{margin:5px 0 9px;padding-left:17px}.chatpdf-md li{margin:3px 0}.chatpdf-md strong{font-weight:800;color:#172033}
.chatpdf-citations{display:flex;flex-wrap:wrap;gap:7px;margin-top:11px;padding-top:10px;border-top:1px solid #eef2f7}.chatpdf-citation{display:flex;align-items:center;gap:5px;padding:6px 8px;border:1px solid #ddd6fe;border-radius:8px;background:#faf5ff;color:#6d28d9;font-size:8px;font-weight:800;cursor:pointer}.chatpdf-citation:hover{background:#ede9fe}.chatpdf-suggestions{display:flex;flex-direction:column;gap:6px;margin-top:10px}.chatpdf-suggestion{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 10px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;color:#64748b;text-align:left;font-size:8px;font-weight:650;cursor:pointer}.chatpdf-suggestion:hover{border-color:#c4b5fd;color:#6d28d9}.chatpdf-thinking{display:flex;align-items:center;gap:5px;padding:5px 0}.chatpdf-thinking i{width:6px;height:6px;border-radius:50%;background:#8b5cf6;animation:chatpdf-dot 1.2s infinite}.chatpdf-thinking i:nth-child(2){animation-delay:.15s}.chatpdf-thinking i:nth-child(3){animation-delay:.3s}
.chatpdf-error{display:flex;align-items:flex-start;gap:8px;margin:0 22px 12px;padding:11px 13px;border:1px solid #fecaca;border-radius:10px;background:#fef2f2;color:#b91c1c;font-size:9px;font-weight:650;line-height:1.5}.chatpdf-error a{color:#7c3aed;font-weight:850}.chatpdf-composer{padding:15px 20px 18px;border-top:1px solid #e2e8f0;background:#fff}.chatpdf-input-wrap{display:flex;align-items:flex-end;gap:9px;padding:8px 8px 8px 13px;border:1.5px solid #dbe4f0;border-radius:14px;background:#fff;box-shadow:0 7px 23px rgba(15,23,42,.05)}.chatpdf-input-wrap:focus-within{border-color:#8b5cf6;box-shadow:0 0 0 4px rgba(139,92,246,.09)}.chatpdf-input{min-height:36px;max-height:110px;flex:1;resize:none;border:0;outline:0;color:#172033;font:500 11px/1.5 system-ui;background:transparent}.chatpdf-input::placeholder{color:#94a3b8}.chatpdf-send{display:grid;place-items:center;width:37px;height:37px;flex:0 0 auto;border:0;border-radius:10px;background:#6d28d9;color:#fff;cursor:pointer;box-shadow:0 6px 14px rgba(109,40,217,.23)}.chatpdf-send:disabled{opacity:.35;cursor:not-allowed;box-shadow:none}.chatpdf-compose-note{margin:8px 0 0;text-align:center;color:#94a3b8;font-size:8px}.chatpdf-alert{display:flex;align-items:flex-start;gap:10px;margin:0 32px 25px;padding:14px 16px;border:1px solid #fecaca;border-radius:12px;background:#fff7f7;color:#b91c1c;font-size:11px;line-height:1.55}.chatpdf-alert button{padding:0;border:0;background:transparent;color:#6d28d9;font-weight:800;text-decoration:underline;cursor:pointer}
.chatpdf-info{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:18px}.chatpdf-info article{padding:18px;border:1px solid #e2e8f0;border-radius:15px;background:#fff}.chatpdf-info svg{color:#7c3aed}.chatpdf-info h3{margin:11px 0 5px;font-size:12px}.chatpdf-info p{margin:0;color:#64748b;font-size:10px;line-height:1.6}
@keyframes chatpdf-spin{to{transform:rotate(360deg)}}@keyframes chatpdf-dot{0%,60%,100%{opacity:.3;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}@keyframes chatpdf-in{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
@media(max-width:820px){.chatpdf-wrap{width:min(100% - 24px,1120px)}.chatpdf-hero{padding:55px 0 35px}.chatpdf-upload{padding:18px}.chatpdf-workspace{grid-template-columns:1fr}.chatpdf-sidebar{border-right:0;border-bottom:1px solid #e2e8f0}.chatpdf-sidebar .chatpdf-starter,.chatpdf-sidebar .chatpdf-side-title{display:none}.chatpdf-reset{margin-top:12px}.chatpdf-source{margin-top:6px}.chatpdf-messages{min-height:440px;padding:16px}.chatpdf-bubble{max-width:90%}.chatpdf-info{grid-template-columns:1fr}.chatpdf-chat-head{padding:14px 16px}.chatpdf-composer{padding:12px}.chatpdf-error{margin:0 12px 10px}}
`;

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function sizeBucket(bytes: number): string {
  if (bytes < 1024 * 1024) return "under_1mb";
  if (bytes < 10 * 1024 * 1024) return "1mb_to_10mb";
  return "10mb_plus";
}

function escapeHTML(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderMarkdown(value: string): string {
  const lines = value.split("\n");
  const rendered: string[] = [];
  let listOpen = false;

  const closeList = () => {
    if (listOpen) rendered.push("</ul>");
    listOpen = false;
  };

  for (const line of lines) {
    const escaped = escapeHTML(line).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    if (line.startsWith("### ")) {
      closeList();
      rendered.push(`<h3>${escaped.slice(4)}</h3>`);
    } else if (line.startsWith("## ")) {
      closeList();
      rendered.push(`<h2>${escaped.slice(3)}</h2>`);
    } else if (/^[-*] /.test(line)) {
      if (!listOpen) rendered.push("<ul>");
      listOpen = true;
      rendered.push(`<li>${escaped.slice(2)}</li>`);
    } else if (!line.trim()) {
      closeList();
    } else {
      closeList();
      rendered.push(`<p>${escaped}</p>`);
    }
  }
  closeList();
  return rendered.join("");
}

function newMessage(
  role: ChatMessage["role"],
  content: string,
  extra: Pick<ChatMessage, "citations" | "suggestions"> = {},
): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    ...extra,
  };
}

export default function ChatWithPDFPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PDFChatPage[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [processing, setProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [asking, setAsking] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [activeCitation, setActiveCitation] = useState<PDFChatCitation | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const totalWords = pages.reduce((sum, page) => sum + page.wordCount, 0);

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, asking]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setFile(null);
    setPages([]);
    setMessages([]);
    setQuestion("");
    setProcessing(false);
    setProcessingProgress(0);
    setAsking(false);
    setError("");
    setErrorStatus(null);
    setActiveCitation(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  const extractPDF = useCallback(async (selectedFile: File) => {
    setError("");
    setErrorStatus(null);
    setActiveCitation(null);

    const isPDF =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLocaleLowerCase().endsWith(".pdf");
    if (!isPDF) {
      setError("Choose a PDF file to start a document chat.");
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("This PDF is larger than the 50 MB limit.");
      return;
    }

    setFile(selectedFile);
    setPages([]);
    setMessages([]);
    setProcessing(true);
    setProcessingProgress(3);

    let pdf: PDFDocumentProxy | null = null;
    try {
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
      const buffer = await selectedFile.arrayBuffer();
      pdf = await pdfjs.getDocument({ data: buffer }).promise;

      if (pdf.numPages > MAX_PAGES) {
        throw new Error(`This PDF has more than the ${MAX_PAGES.toLocaleString()} page limit.`);
      }

      const extracted: PDFChatPage[] = [];
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const text = normalizeWhitespace(
          content.items.map((item) => ("str" in item ? item.str : "")).join(" "),
        );
        extracted.push({
          pageNumber,
          text,
          wordCount: text ? text.split(/\s+/).length : 0,
        });
        page.cleanup();
        setProcessingProgress(Math.round((pageNumber / pdf.numPages) * 96));
      }

      const readableCharacters = extracted.reduce((sum, page) => sum + page.text.length, 0);
      if (readableCharacters < 30) {
        throw new Error(
          "No readable text was found. This may be a scanned PDF - run OCR Scanner first, then chat with the searchable result.",
        );
      }

      setPages(extracted);
      setMessages([
        newMessage(
          "assistant",
          `I have read **${pdf.numPages.toLocaleString()} pages**. Ask me about facts, dates, obligations, risks, or request a summary. I will cite the supporting pages.`,
          { suggestions: STARTER_QUESTIONS },
        ),
      ]);
      setProcessingProgress(100);
      void trackEvent("chat_pdf_loaded", {
        file_size: sizeBucket(selectedFile.size),
        page_count: pdf.numPages,
      });
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Could not read this PDF.";
      const passwordProtected = /password|encrypted|PasswordException/i.test(message);
      setFile(null);
      setPages([]);
      setError(
        passwordProtected
          ? "This PDF is password-protected. Unlock it with the correct password before starting a chat."
          : message,
      );
      void trackEvent("chat_pdf_load_failed", {
        reason: passwordProtected ? "password_protected" : /scanned|readable text/i.test(message) ? "image_only" : "processing_error",
      });
    } finally {
      await pdf?.destroy().catch(() => undefined);
      setProcessing(false);
    }
  }, []);

  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) void extractPDF(selectedFile);
    event.target.value = "";
  };

  const dropFile = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const selectedFile = event.dataTransfer.files?.[0];
    if (selectedFile) void extractPDF(selectedFile);
  };

  const askQuestion = useCallback(
    async (override?: string) => {
      const currentQuestion = normalizeWhitespace(override ?? question);
      if (!currentQuestion || asking || !pages.length) return;

      const recentUserQuestions = messages
        .filter((message) => message.role === "user")
        .slice(-2)
        .map((message) => message.content)
        .join(" ");
      const relevantPages = selectRelevantPages(currentQuestion, pages, {
        historyText: recentUserQuestions,
        maxPages: 8,
        maxCharacters: 72_000,
      });
      const history: PDFChatHistoryMessage[] = messages
        .filter((message) => message.content)
        .slice(-8)
        .map((message) => ({ role: message.role, content: message.content }));

      setMessages((current) => [...current, newMessage("user", currentQuestion)]);
      setQuestion("");
      setError("");
      setErrorStatus(null);
      setActiveCitation(null);
      setAsking(true);
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      let failureReason = "request_error";
      void trackEvent("chat_pdf_question_started", {
        selected_page_count: relevantPages.length,
      });

      try {
        const response = await fetch("/api/chat-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: currentQuestion,
            pages: relevantPages,
            history,
          }),
          signal: abortRef.current.signal,
        });
        const data = (await response.json().catch(() => ({}))) as {
          answer?: string;
          citations?: PDFChatCitation[];
          suggestedQuestions?: string[];
          error?: string;
        };
        if (!response.ok) {
          setErrorStatus(response.status);
          failureReason = response.status === 401 ? "signed_out" : response.status === 429 ? "daily_limit" : "request_error";
          throw new Error(data.error || `Chat request failed (${response.status}).`);
        }

        const citations = Array.isArray(data.citations) ? data.citations : [];
        setMessages((current) => [
          ...current,
          newMessage(
            "assistant",
            data.answer || "I could not find that in the supplied PDF pages.",
            {
              citations,
              suggestions: Array.isArray(data.suggestedQuestions)
                ? data.suggestedQuestions
                : [],
            },
          ),
        ]);
        if (citations[0]) setActiveCitation(citations[0]);
        void trackEvent("chat_pdf_question_completed", {
          citation_count: citations.length,
        });
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === "AbortError") return;
        const message = caught instanceof Error ? caught.message : "The PDF chat failed.";
        setError(message);
        void trackEvent("chat_pdf_question_failed", {
          reason: failureReason,
        });
      } finally {
        setAsking(false);
      }
    },
    [asking, messages, pages, question],
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void askQuestion();
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="chatpdf-page">
        <SiteNav />
        <header className="chatpdf-hero">
          <div className="chatpdf-wrap">
            <div className="chatpdf-badge"><Sparkles size={12} /> AI document Q&amp;A</div>
            <h1>Chat with your PDF. <span>Get cited answers.</span></h1>
            <p>Ask questions in plain English and get grounded answers with exact supporting quotes and page references.</p>
            <div className="chatpdf-trust">
              <span><ShieldCheck size={14} /> PDF parsed in your browser</span>
              <span><FileSearch size={14} /> Verified page citations</span>
              <span><MessageSquareText size={14} /> 5 free AI questions daily</span>
            </div>
          </div>
        </header>

        <main className="chatpdf-main">
          <div className="chatpdf-wrap">
            <section className="chatpdf-shell" aria-label="Chat with PDF workspace">
              {!file && !processing && (
                <div className="chatpdf-upload">
                  <div
                    className={`chatpdf-drop${dragging ? " dragging" : ""}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => inputRef.current?.click()}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") inputRef.current?.click();
                    }}
                    onDragEnter={(event) => { event.preventDefault(); setDragging(true); }}
                    onDragOver={(event) => event.preventDefault()}
                    onDragLeave={() => setDragging(false)}
                    onDrop={dropFile}
                  >
                    <div className="chatpdf-upload-icon"><UploadCloud size={31} /></div>
                    <h2>Drop a PDF here to start chatting</h2>
                    <p>We extract searchable text page by page in your browser.</p>
                    <span className="chatpdf-choose">Choose PDF <ArrowRight size={14} /></span>
                    <p className="chatpdf-limits">PDF only - up to 50 MB and 1,000 pages</p>
                  </div>
                </div>
              )}

              {processing && (
                <div className="chatpdf-processing" aria-live="polite">
                  <div className="chatpdf-spinner"><LoaderCircle size={29} /></div>
                  <h2>Reading your PDF page by page</h2>
                  <p>Extracting text locally for accurate retrieval and citations...</p>
                  <div className="chatpdf-progress"><div style={{ width: `${processingProgress}%` }} /></div>
                </div>
              )}

              {file && pages.length > 0 && !processing && (
                <div className="chatpdf-workspace">
                  <aside className="chatpdf-sidebar">
                    <div className="chatpdf-document">
                      <div className="chatpdf-document-head">
                        <div className="chatpdf-document-icon"><FileText size={19} /></div>
                        <div style={{ minWidth: 0 }}>
                          <h2 title={file.name}>{file.name}</h2>
                          <p>{formatBytes(file.size)} - ready to chat</p>
                        </div>
                      </div>
                      <div className="chatpdf-stats">
                        <div className="chatpdf-stat"><strong>{pages.length.toLocaleString()}</strong><span>Pages</span></div>
                        <div className="chatpdf-stat"><strong>{totalWords.toLocaleString()}</strong><span>Words</span></div>
                      </div>
                    </div>
                    <div className="chatpdf-private">
                      <ShieldCheck size={16} />
                      <div><strong>Privacy-aware processing</strong><p>The PDF stays local. Only relevant text excerpts and your question are sent to the AI service.</p></div>
                    </div>
                    <p className="chatpdf-side-title">Try asking</p>
                    {STARTER_QUESTIONS.map((starter) => (
                      <button className="chatpdf-starter" key={starter} onClick={() => void askQuestion(starter)} disabled={asking}>{starter}</button>
                    ))}
                    {activeCitation && (
                      <>
                        <p className="chatpdf-side-title">Selected source</p>
                        <div className="chatpdf-source">
                          <strong>Page {activeCitation.page}</strong>
                          <p>&ldquo;{activeCitation.quote}&rdquo;</p>
                        </div>
                      </>
                    )}
                    <button className="chatpdf-reset" onClick={reset}><RefreshCw size={12} /> Chat with another PDF</button>
                  </aside>

                  <section className="chatpdf-chat">
                    <div className="chatpdf-chat-head">
                      <div className="chatpdf-chat-title">
                        <div className="chatpdf-ai-icon"><Bot size={18} /></div>
                        <div><h2>PDF Assistant</h2><p>Answers are grounded in selected document pages</p></div>
                      </div>
                      <span className="chatpdf-online">Ready</span>
                    </div>
                    <div className="chatpdf-messages" ref={messagesRef} aria-live="polite">
                      {messages.map((message) => (
                        <div className={`chatpdf-message ${message.role}`} key={message.id}>
                          <div className="chatpdf-avatar">{message.role === "assistant" ? <Bot size={15} /> : <UserRound size={14} />}</div>
                          <div className="chatpdf-bubble">
                            {message.role === "assistant" ? (
                              <div className="chatpdf-md" dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }} />
                            ) : message.content}
                            {!!message.citations?.length && (
                              <div className="chatpdf-citations" aria-label="Verified PDF citations">
                                {message.citations.map((citation, index) => (
                                  <button
                                    className="chatpdf-citation"
                                    key={`${citation.page}-${index}`}
                                    title={citation.quote}
                                    onClick={() => setActiveCitation(citation)}
                                  >
                                    <FileSearch size={11} /> Page {citation.page}
                                  </button>
                                ))}
                              </div>
                            )}
                            {!!message.suggestions?.length && message.role === "assistant" && (
                              <div className="chatpdf-suggestions">
                                {message.suggestions.map((suggestion) => (
                                  <button className="chatpdf-suggestion" key={suggestion} onClick={() => setQuestion(suggestion)}>
                                    {suggestion}<ArrowRight size={11} />
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {asking && (
                        <div className="chatpdf-message assistant">
                          <div className="chatpdf-avatar"><Bot size={15} /></div>
                          <div className="chatpdf-bubble"><div className="chatpdf-thinking" aria-label="Finding an answer"><i /><i /><i /></div></div>
                        </div>
                      )}
                    </div>
                    {error && (
                      <div className="chatpdf-error">
                        <LockKeyhole size={13} />
                        <span>{error} {errorStatus === 401 && <Link href="/sign-in">Sign in now</Link>}</span>
                      </div>
                    )}
                    <div className="chatpdf-composer">
                      <div className="chatpdf-input-wrap">
                        <textarea
                          className="chatpdf-input"
                          value={question}
                          onChange={(event) => setQuestion(event.target.value.slice(0, 2_000))}
                          onKeyDown={onKeyDown}
                          placeholder="Ask anything about this PDF..."
                          rows={1}
                          disabled={asking}
                          aria-label="Question about the PDF"
                        />
                        <button className="chatpdf-send" onClick={() => void askQuestion()} disabled={!question.trim() || asking} aria-label="Send question">
                          {asking ? <LoaderCircle size={16} /> : <Send size={15} />}
                        </button>
                      </div>
                      <p className="chatpdf-compose-note">Enter to send - Shift + Enter for a new line - AI answers should be checked against cited text</p>
                    </div>
                  </section>
                </div>
              )}
            </section>

            {error && !file && !processing && (
              <div className="chatpdf-alert">
                <LockKeyhole size={17} />
                <span>{error} {(/password/i.test(error)) && <Link href="/pdf-unlock">Open Unlock PDF</Link>}</span>
              </div>
            )}

            <div className="chatpdf-info">
              <article><FileSearch size={21} /><h3>Grounded retrieval</h3><p>The most relevant pages are selected locally for each question instead of sending the entire document.</p></article>
              <article><CheckCircle2 size={21} /><h3>Verified citations</h3><p>Supporting quotes are checked against extracted page text before they appear as source cards.</p></article>
              <article><ShieldCheck size={21} /><h3>Clear privacy boundary</h3><p>Your source PDF remains in the browser; only the question, recent chat, and selected page excerpts go to AI.</p></article>
            </div>
          </div>
        </main>

        <ToolSEOSection {...toolSeoData["chat-with-pdf"]} />
        <SiteFooter />
        <input ref={inputRef} type="file" accept="application/pdf,.pdf" onChange={chooseFile} hidden />
      </div>
    </>
  );
}
