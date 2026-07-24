from pydantic import BaseModel, HttpUrl, Field, field_validator
from typing import List


class AnalyzeRequest(BaseModel):
    """
    Request model for URL analysis.
    """
    url: HttpUrl = Field(
        ...,
        description="The target webpage HTTP/HTTPS URL to crawl and analyze.",
        examples=["https://example.com"]
    )

    @field_validator("url")
    @classmethod
    def validate_scheme(cls, v: HttpUrl) -> HttpUrl:
        """
        Ensure the URL scheme is strictly http or https.
        """
        if v.scheme not in ("http", "https"):
            raise ValueError("URL scheme must be http or https")
        return v


class AnalyzeResponse(BaseModel):
    """
    Response model containing crawled SEO, performance, and accessibility metrics.
    """
    url: str = Field(
        description="The resolved URL that was successfully analyzed.",
        examples=["https://example.com"]
    )

    status_code: int = Field(
        description="The HTTP response status code returned by the crawled website.",
        examples=[200]
    )

    response_time_ms: float = Field(
        description="Total round-trip time taken to receive the HTML document in milliseconds.",
        examples=[245.67]
    )

    title: str = Field(
        description="The HTML title tag string content of the webpage.",
        examples=["Example Domain"]
    )

    meta_description: str = Field(
        description="The meta description attribute content of the webpage.",
        examples=["This is an example website description."]
    )

    h1_count: int = Field(
        description="Total number of <h1> heading tags found in the parsed DOM.",
        examples=[1]
    )

    missing_alt_images: int = Field(
        description="Total number of <img> tag elements missing a valid alt attribute description.",
        examples=[2]
    )

    word_count: int = Field(
        description="Approximate word count of visible text parsed from the page body.",
        examples=[512]
    )

    health_score: int = Field(
        description="Calculated SEO health score ranging from 0 (poor) to 10 (perfect).",
        examples=[8]
    )

    priority_fixes: List[str] = Field(
        description="List of high priority suggestions to address SEO or accessibility flaws.",
        examples=[["Add a meta description", "Add alt text to images"]]
    )

    engineering_notes: List[str] = Field(
        description="List of informational engineering observations gathered during parse execution.",
        examples=[["Low content volume", "Page responds quickly"]]
    )