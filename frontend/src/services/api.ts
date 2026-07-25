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
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new AnalysisError(
          'timeout',
          'The analysis request timed out. The server took longer than 15 seconds to respond.'
        );
      }
      
      if (error.response) {
        // Backend responded with 4xx/5xx error status
        const detail = error.response.data?.detail || error.response.statusText || `status ${error.response.status}`;
        throw new AnalysisError(
          'http',
          `The backend server responded with an error: ${detail}`,
          error.response.status
        );
      } else if (error.request) {
        // Request made, but no response was received (network unreachable)
        throw new AnalysisError(
          'network',
          `Unable to reach the analysis backend. Please verify that the backend server is running and reachable at ${API_BASE_URL}.`
        );
      }
    }
    
    // Generic network or setup error
    throw new AnalysisError(
      'network',
      error.message || 'An unexpected error occurred while communicating with the backend.'
    );
  }
}
