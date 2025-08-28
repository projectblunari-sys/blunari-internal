import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // Send to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent 
          error={this.state.error!} 
          resetError={this.resetError} 
        />
      );
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error: Error; resetError: () => void }> = ({ 
  error, 
  resetError 
}) => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="max-w-md w-full mx-auto p-6">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
          <p className="text-muted-foreground">
            We apologize for the inconvenience. The error has been logged and our team will investigate.
          </p>
        </div>
        
        <div className="bg-muted/50 p-4 rounded-lg text-left">
          <p className="text-sm font-medium text-foreground mb-2">Error Details:</p>
          <code className="text-xs text-muted-foreground break-all">
            {error.message}
          </code>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={resetError}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 bg-muted text-muted-foreground hover:bg-muted/80 px-4 py-2 rounded-md transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  </div>
);