from pydantic import BaseModel, HttpUrl
from typing import List


class AnalyzeRequest(BaseModel):
    url: HttpUrl


class AnalyzeResponse(BaseModel):
    url: str
    status_code: int
    response_time_ms: float
    title: str
    meta_description: str
    h1_count: int
    missing_alt_images: int
    word_count: int
    health_score: int
    priority_fixes: List[str]
    engineering_notes: List[str]