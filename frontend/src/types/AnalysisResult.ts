export interface AnalysisResult {
  url: string;
  status_code: number;
  response_time_ms: number;
  title: string;
  meta_description: string;
  h1_count: number;
  missing_alt_images: number;
  word_count: number;
  health_score: number;
  priority_fixes: string[];
  engineering_notes: string[];
}
