import { Component } from 'react'

/** Shows the error on screen instead of a blank page if any component crashes. */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('OyaGo crashed:', error, info.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="mx-auto max-w-md p-6">
        <h2 className="font-display text-xl font-bold text-danfo">Something broke</h2>
        <pre className="mt-3 whitespace-pre-wrap rounded-lg bg-tar p-3 text-sm">
          {String(this.state.error?.stack || this.state.error)}
        </pre>
        <button
          onClick={() => location.reload()}
          className="mt-4 rounded-xl bg-danfo px-4 py-3 font-bold text-ink"
        >
          Reload
        </button>
      </div>
    )
  }
}
