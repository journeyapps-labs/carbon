import { RenderingEngine } from '../RenderingEngine';
import { useEffect, useState } from 'react';
import { CompileResult } from '@journeyapps-labs/carbon-core';

export interface UseDiagnosticsOptions {
  engine: RenderingEngine;
}

export const useDiagnostics = (options: UseDiagnosticsOptions) => {
  const [diagnostics, setDiagnostics] = useState<CompileResult[]>([]);
  useEffect(() => {
    options.engine.registerListener({
      diagnosticsChanged: () => {
        setDiagnostics(Array.from(options.engine.diagnostics.values()));
      }
    });
  }, []);
  return diagnostics;
};
