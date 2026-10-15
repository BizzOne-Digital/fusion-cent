import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4rem 1.5rem', gap: '1rem' }}>
          <div style={{ fontSize: '4rem' }}>⚠️</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--purple-deep)' }}>Something went wrong</h1>
          <p style={{ color: 'var(--text-body)', maxWidth: '400px' }}>
            Please try refreshing the page. If the problem continues, clearing your cart/site data may help.
          </p>
          <button className="btn btn-primary" onClick={this.handleReset}>Go to Homepage</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
