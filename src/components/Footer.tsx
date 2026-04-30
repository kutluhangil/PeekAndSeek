import React from 'react';
import { Github, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-6 px-6 border-t border-border">
      <div className="w-full max-w-2xl mx-auto flex flex-row items-center justify-between">
        
        <span className="text-[12px] text-muted font-light">
          designed by <span className="text-foreground font-medium">kutluhangil</span>
        </span>

        <div className="flex items-center gap-4">
          <a 
            href="https://github.com/kutluhangil" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted hover:text-foreground transition-colors"
          >
            <Github className="w-4 h-4" strokeWidth={1.5} />
          </a>
          <a 
            href="https://www.linkedin.com/in/kutluhangil/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted hover:text-foreground transition-colors"
          >
            <Linkedin className="w-4 h-4" strokeWidth={1.5} />
          </a>
        </div>

      </div>
    </footer>
  );
}
