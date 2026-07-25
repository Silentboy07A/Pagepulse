import axios from 'axios';
import type { AnalysisResult } from '../types/AnalysisResult';

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://pagepulse-kcqb.onrender.com";

export type ErrorType = 'client' | 'network' | 'http' | 'timeout';

export class AnalysisError extends Error {
  type: ErrorType;
  status?: number;

  constructor(type: ErrorType, message: string, status?: number) {
    super(message);
    this.name = 'AnalysisError';
    this.type = type;
    this.status = status;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractErrorMessage = (error: any): string => {
  if (error?.response?.data) {
    const data = error.response.data;
    
    // Check detail
    if (data.detail !== undefined && data.detail !== null) {
      if (Array.isArray(data.detail)) {
        return data.detail
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((err: any) => (typeof err === 'object' && err?.msg ? err.msg : String(err)))
          .join(', ');
      }
      if (typeof data.detail === 'string') {
        return data.detail;
      }
      return JSON.stringify(data.detail);
    }
    
    // Check message
    if (data.message) {
      return typeof data.message === 'string' ? data.message : JSON.stringify(data.message);
    }
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return '';
};

export async function analyzeUrl(url: string): Promise<AnalysisResult> {
  try {
    const response = await axios.post<AnalysisResult>(
      `${API_BASE_URL}/analyze`,
      { url },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000, // 15 seconds timeout
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new AnalysisError(
          'timeout',
          'Request timed out.'
        );
      }
      
      if (error.response) {
        const status = error.response.status;
        const msg = extractErrorMessage(error);

        if (status === 422) {
          throw new AnalysisError('client', 'Please enter a valid URL.', 422);
        } else if (status === 403) {
          throw new AnalysisError('http', 'This website blocked automated requests.', 403);
        } else if (status === 408) {
          throw new AnalysisError('timeout', 'Request timed out.', 408);
        } else {
          throw new AnalysisError('http', msg || 'Unable to analyze this website.', status);
        }
      } else if (error.request) {
        if (navigator.onLine === false) {
          throw new AnalysisError('network', 'Network connection lost.');
        } else {
          throw new AnalysisError('network', 'Backend server is unavailable.');
        }
      }
    }
    
    if (navigator.onLine === false) {
      throw new AnalysisError('network', 'Network connection lost.');
    }
    throw new AnalysisError(
      'network',
      (error as Error).message || 'An unexpected error occurred.'
    );
  }
}
