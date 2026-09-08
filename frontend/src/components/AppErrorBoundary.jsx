import React from "react";

export default class AppErrorBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="min-h-[100dvh] px-6 py-32" style={{ background: "var(--surface)", color: "var(--text)" }} role="alert">
        <div className="max-w-xl mx-auto">
          <p className="eyebrow">Ackra AI</p>
          <h1 className="mt-6 font-serif text-4xl md:text-6xl">Let’s try that again.</h1>
          <p className="mt-6" style={{ color: "var(--muted)" }}>This page couldn’t load. Refresh the page or head back home.</p>
          <div className="mt-8 flex flex-wrap gap-6 items-center">
            <button type="button" onClick={() => window.location.reload()} className="button">Refresh page</button>
            <a href="/" className="text-link">Back to home</a>
          </div>
        </div>
      </main>
    );
  }
}
