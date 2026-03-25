"use client";

import { useEffect, useMemo, useState } from "react";

import { formatDate } from "@/lib/format";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const ADMIN_STORAGE_KEY = "weekly-roundup-admin-password";

const createEmptyForm = () => ({
  title: "",
  week: "",
  thisWeek: "",
  idea: "",
  signals: ["", "", ""],
  isFeatured: false,
});

const getApiUrl = () => {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is missing. Add it to frontend/.env.local.");
  }

  return API_URL.replace(/\/$/, "");
};

const buildAdminHeaders = (password) => ({
  "Content-Type": "application/json",
  "x-admin-password": password,
});

const parseResponse = async (response) => {
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Request failed.");
  }

  return data;
};

const getFriendlyErrorMessage = (error, fallbackMessage) => {
  if (!error) {
    return fallbackMessage;
  }

  if (error instanceof TypeError) {
    return "Unable to reach the backend. Make sure the backend server is running on the API URL.";
  }

  return error.message || fallbackMessage;
};

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [draft, setDraft] = useState(createEmptyForm);
  const [posts, setPosts] = useState([]);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const hasSignals = useMemo(
    () => draft.signals.some((signal) => signal.trim().length > 0),
    [draft.signals]
  );

  const loadPosts = async () => {
    setIsRefreshing(true);

    try {
      const [featuredResponse, postsResponse] = await Promise.all([
        fetch(`${getApiUrl()}/posts/featured`, {
          cache: "no-store",
        }),
        fetch(`${getApiUrl()}/posts`, {
          cache: "no-store",
        }),
      ]);

      const featured = await parseResponse(featuredResponse);
      const weeklyPosts = await parseResponse(postsResponse);
      const combined = [featured, ...(Array.isArray(weeklyPosts) ? weeklyPosts : [])].filter(Boolean);
      setPosts(combined);
    } catch {
      setPosts([]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const verifyPassword = async (value) => {
    const response = await fetch(`${getApiUrl()}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: value }),
    });

    await parseResponse(response);
  };

  useEffect(() => {
    const bootstrap = async () => {
      await loadPosts();

      const storedPassword = window.localStorage.getItem(ADMIN_STORAGE_KEY);

      if (!storedPassword) {
        setIsCheckingSession(false);
        return;
      }

      try {
        await verifyPassword(storedPassword);
        setPassword(storedPassword);
        setIsAuthenticated(true);
      } catch {
        window.localStorage.removeItem(ADMIN_STORAGE_KEY);
      } finally {
        setIsCheckingSession(false);
      }
    };

    bootstrap();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");
    setIsSubmitting(true);

    try {
      await verifyPassword(password);
      window.localStorage.setItem(ADMIN_STORAGE_KEY, password);
      setIsAuthenticated(true);
      setStatusMessage("You are signed in.");
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error, "Unable to sign in."));
      setIsAuthenticated(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem(ADMIN_STORAGE_KEY);
    setPassword("");
    setIsAuthenticated(false);
    setStatusMessage("Signed out.");
    setErrorMessage("");
  };

  const updateField = (field, value) => {
    setDraft((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const updateSignal = (index, value) => {
    setDraft((current) => ({
      ...current,
      signals: current.signals.map((signal, signalIndex) =>
        signalIndex === index ? value : signal
      ),
    }));
  };

  const addSignalField = () => {
    setDraft((current) => ({
      ...current,
      signals: [...current.signals, ""],
    }));
  };

  const removeSignalField = (index) => {
    setDraft((current) => {
      if (current.signals.length === 1) {
        return {
          ...current,
          signals: [""],
        };
      }

      return {
        ...current,
        signals: current.signals.filter((_, signalIndex) => signalIndex !== index),
      };
    });
  };

  const handleCreatePost = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setStatusMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${getApiUrl()}/posts`, {
        method: "POST",
        headers: buildAdminHeaders(password),
        body: JSON.stringify({
          ...draft,
          signals: draft.signals.filter((signal) => signal.trim()),
        }),
      });

      setDraft(createEmptyForm());
      await parseResponse(response);
      await loadPosts();
      setStatusMessage("Article published.");
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error, "Unable to publish article."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (postId) => {
    setErrorMessage("");
    setStatusMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${getApiUrl()}/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "x-admin-password": password,
        },
      });

      await parseResponse(response);
      await loadPosts();
      setStatusMessage("Article deleted.");
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error, "Unable to delete article."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="mx-auto flex max-w-[700px] flex-col items-center rounded-[32px] border border-line bg-white p-12 text-center shadow-card">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" />
        <p className="mt-5 text-base text-muted">Loading admin workspace...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-[520px] rounded-[32px] border border-line bg-white p-8 shadow-card sm:p-10">
        <div className="text-center">
          <div className="inline-flex rounded-full border border-line bg-paper px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Admin Access
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-ink">
            Sign in to publish the next roundup
          </h1>
          <p className="mt-4 text-base leading-7 text-muted">
            Use the admin password configured in your backend environment.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-10 space-y-5">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-ink">
              Admin password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-line bg-paper px-4 py-3 text-base text-ink outline-none transition focus:border-accent"
              placeholder="Enter password"
            />
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || !password.trim()}
            className="inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-4 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Checking password..." : "Enter admin panel"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[700px] space-y-8">
      <section className="rounded-[32px] border border-line bg-white p-8 shadow-card sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-line bg-paper px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Admin Dashboard
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-ink">
              Publish a new weekly issue
            </h1>
            <p className="mt-3 text-base leading-7 text-muted">
              Create structured editorial posts and manage the archive from one place.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-full border border-line px-5 py-3 text-sm font-medium text-ink transition hover:bg-paper"
          >
            Sign out
          </button>
        </div>

        <form onSubmit={handleCreatePost} className="mt-10 space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-ink">
              Title
            </label>
            <input
              id="title"
              value={draft.title}
              onChange={(event) => updateField("title", event.target.value)}
              className="w-full rounded-2xl border border-line bg-paper px-4 py-3 text-base text-ink outline-none transition focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="week" className="text-sm font-medium text-ink">
              Week
            </label>
            <input
              id="week"
              value={draft.week}
              onChange={(event) => updateField("week", event.target.value)}
              placeholder="Week 12, 2026"
              className="w-full rounded-2xl border border-line bg-paper px-4 py-3 text-base text-ink outline-none transition focus:border-accent"
            />
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-4 py-4 text-sm text-ink">
            <input
              type="checkbox"
              checked={draft.isFeatured}
              onChange={(event) => updateField("isFeatured", event.target.checked)}
              className="h-4 w-4 rounded border-line text-accent focus:ring-accent"
            />
            Mark this post as the featured story
          </label>

          <div className="space-y-2">
            <label htmlFor="thisWeek" className="text-sm font-medium text-ink">
              This week in AI
            </label>
            <textarea
              id="thisWeek"
              rows={5}
              value={draft.thisWeek}
              onChange={(event) => updateField("thisWeek", event.target.value)}
              className="w-full rounded-3xl border border-line bg-paper px-4 py-4 text-base text-ink outline-none transition focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="idea" className="text-sm font-medium text-ink">
              One idea that matters
            </label>
            <textarea
              id="idea"
              rows={5}
              value={draft.idea}
              onChange={(event) => updateField("idea", event.target.value)}
              className="w-full rounded-3xl border border-line bg-paper px-4 py-4 text-base text-ink outline-none transition focus:border-accent"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-ink">Signals</label>
              <button
                type="button"
                onClick={addSignalField}
                className="text-sm font-medium text-accent transition hover:text-ink"
              >
                Add signal
              </button>
            </div>

            {draft.signals.map((signal, index) => (
              <div key={`signal-${index}`} className="flex items-center gap-3">
                <input
                  value={signal}
                  onChange={(event) => updateSignal(index, event.target.value)}
                  className="w-full rounded-2xl border border-line bg-paper px-4 py-3 text-base text-ink outline-none transition focus:border-accent"
                  placeholder={`Signal ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeSignalField(index)}
                  className="rounded-full border border-line px-4 py-3 text-sm font-medium text-muted transition hover:bg-paper hover:text-ink"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {statusMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {statusMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={
              isSubmitting ||
              !draft.title.trim() ||
              !draft.week.trim() ||
              !draft.thisWeek.trim() ||
              !draft.idea.trim() ||
              !hasSignals
            }
            className="inline-flex w-full items-center justify-center rounded-full bg-ink px-6 py-4 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Publishing..." : "Publish article"}
          </button>
        </form>
      </section>

      <section className="rounded-[32px] border border-line bg-white p-8 shadow-card sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">Published posts</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Review the archive and remove posts when needed.
            </p>
          </div>
          <button
            type="button"
            onClick={loadPosts}
            className="inline-flex items-center justify-center rounded-full border border-line px-5 py-3 text-sm font-medium text-ink transition hover:bg-paper"
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {posts.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-line bg-paper/70 p-8 text-center text-muted">
              No posts yet.
            </div>
          ) : null}

          {posts.map((post) => (
            <article
              key={post._id}
              className="flex flex-col gap-4 rounded-[24px] border border-line bg-paper/70 p-5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div>
                <div className="text-sm font-medium text-muted">{post.week}</div>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-ink">
                  {post.title}
                </h3>
                {post.isFeatured ? (
                  <div className="mt-3 inline-flex rounded-full border border-line bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                    Featured
                  </div>
                ) : null}
                <div className="mt-3 text-sm text-muted">{formatDate(post.createdAt)}</div>
              </div>
              <button
                type="button"
                onClick={() => handleDeletePost(post._id)}
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full border border-red-200 px-5 py-3 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Delete
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
