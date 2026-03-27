"use client";

import { useEffect, useMemo, useState } from "react";

import { formatDate } from "@/lib/format";
import { dedupePosts } from "@/lib/posts";

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
      const postsResponse = await fetch(`${getApiUrl()}/posts`, {
        cache: "no-store",
      });
      const weeklyPosts = await parseResponse(postsResponse);
      const combined = dedupePosts(Array.isArray(weeklyPosts) ? weeklyPosts : []);
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
      <div className="mx-auto flex max-w-[700px] flex-col items-center rounded-2xl border border-stone-200 bg-white p-12 text-center dark:border-stone-700 dark:bg-stone-900">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-700 dark:border-stone-700 dark:border-t-stone-200" />
        <p className="mt-5 text-base text-stone-600 dark:text-stone-400">Loading admin workspace...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-[520px] rounded-2xl border border-stone-200 bg-white p-8 dark:border-stone-700 dark:bg-stone-900 sm:p-10">
        <div className="text-center">
          <div className="inline-flex rounded-full border border-stone-300 bg-stone-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400">
            Admin Access
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-stone-900 dark:text-stone-100">
            Sign in to publish the next roundup
          </h1>
          <p className="mt-4 text-base leading-relaxed text-stone-600 dark:text-stone-400">
            Use the admin password configured in your backend environment.
          </p>
        </div>

        <form onSubmit={handleLogin} className="mt-10 space-y-5">
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-stone-800 dark:text-stone-200">
              Admin password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-base text-stone-900 outline-none transition focus:border-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
              placeholder="Enter password"
            />
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-stone-300 bg-stone-100 px-4 py-3 text-sm text-stone-700 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300">
              {errorMessage}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting || !password.trim()}
            className="inline-flex w-full items-center justify-center rounded-full bg-stone-900 px-6 py-4 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-black dark:hover:opacity-90"
          >
            {isSubmitting ? "Checking password..." : "Enter admin panel"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[700px] space-y-8">
      <section className="rounded-2xl border border-stone-200 bg-white p-8 dark:border-stone-700 dark:bg-stone-900 sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex rounded-full border border-stone-300 bg-stone-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400">
              Admin Dashboard
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-stone-900 dark:text-stone-100">
              Publish a new weekly issue
            </h1>
            <p className="mt-3 text-base leading-relaxed text-stone-600 dark:text-stone-400">
              Create structured editorial posts and manage the archive from one place.
            </p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            Sign out
          </button>
        </div>

        <form onSubmit={handleCreatePost} className="mt-10 space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-stone-800 dark:text-stone-200">
              Title
            </label>
            <input
              id="title"
              value={draft.title}
              onChange={(event) => updateField("title", event.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-base text-stone-900 outline-none transition focus:border-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="week" className="text-sm font-medium text-stone-800 dark:text-stone-200">
              Week
            </label>
            <input
              id="week"
              value={draft.week}
              onChange={(event) => updateField("week", event.target.value)}
              placeholder="Week 12, 2026"
              className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-base text-stone-900 outline-none transition focus:border-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
            />
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-stone-300 bg-stone-50 px-4 py-4 text-sm text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200">
            <input
              type="checkbox"
              checked={draft.isFeatured}
              onChange={(event) => updateField("isFeatured", event.target.checked)}
              className="h-4 w-4 rounded border-stone-400 text-stone-800 focus:ring-stone-500 dark:border-stone-600 dark:text-stone-200 dark:focus:ring-stone-400"
            />
            Mark this post as the featured story
          </label>

          <div className="space-y-2">
            <label htmlFor="thisWeek" className="text-sm font-medium text-stone-800 dark:text-stone-200">
              This week in AI
            </label>
            <textarea
              id="thisWeek"
              rows={5}
              value={draft.thisWeek}
              onChange={(event) => updateField("thisWeek", event.target.value)}
              className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-4 text-base text-stone-900 outline-none transition focus:border-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="idea" className="text-sm font-medium text-stone-800 dark:text-stone-200">
              One idea that matters
            </label>
            <textarea
              id="idea"
              rows={5}
              value={draft.idea}
              onChange={(event) => updateField("idea", event.target.value)}
              className="w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-4 text-base text-stone-900 outline-none transition focus:border-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-stone-800 dark:text-stone-200">Signals</label>
              <button
                type="button"
                onClick={addSignalField}
                className="text-sm font-medium text-stone-600 transition hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
              >
                Add signal
              </button>
            </div>

            {draft.signals.map((signal, index) => (
              <div key={`signal-${index}`} className="flex items-center gap-3">
                <input
                  value={signal}
                  onChange={(event) => updateSignal(index, event.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-base text-stone-900 outline-none transition focus:border-stone-500 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100"
                  placeholder={`Signal ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeSignalField(index)}
                  className="rounded-full border border-stone-300 px-4 py-3 text-sm font-medium text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-white"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {errorMessage ? (
            <div className="rounded-2xl border border-stone-300 bg-stone-100 px-4 py-3 text-sm text-stone-700 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300">
              {errorMessage}
            </div>
          ) : null}

          {statusMessage ? (
            <div className="rounded-2xl border border-stone-300 bg-stone-100 px-4 py-3 text-sm text-stone-700 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300">
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
            className="inline-flex w-full items-center justify-center rounded-full bg-stone-900 px-6 py-4 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-black dark:hover:opacity-90"
          >
            {isSubmitting ? "Publishing..." : "Publish article"}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-stone-200 bg-white p-8 dark:border-stone-700 dark:bg-stone-900 sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">Published posts</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
              Review the archive and remove posts when needed.
            </p>
          </div>
          <button
            type="button"
            onClick={loadPosts}
            className="inline-flex items-center justify-center rounded-full border border-stone-300 px-5 py-3 text-sm font-medium text-stone-800 transition hover:bg-stone-100 dark:border-stone-700 dark:text-stone-200 dark:hover:bg-stone-800"
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center text-stone-500 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400">
              No posts yet.
            </div>
          ) : null}

          {posts.map((post) => (
            <article
              key={post._id}
              className="flex flex-col gap-4 rounded-2xl border border-stone-300 bg-stone-50 p-5 dark:border-stone-700 dark:bg-stone-800 sm:flex-row sm:items-start sm:justify-between"
            >
              <div>
                <div className="text-sm font-medium text-stone-500 dark:text-stone-400">{post.week}</div>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
                  {post.title}
                </h3>
                {post.isFeatured ? (
                  <div className="mt-3 inline-flex rounded-full border border-stone-300 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-600 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-300">
                    Featured
                  </div>
                ) : null}
                <div className="mt-3 text-sm text-stone-500 dark:text-stone-400">{formatDate(post.createdAt)}</div>
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
