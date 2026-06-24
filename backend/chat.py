import os
from typing import Optional, Literal
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from litellm import completion

router = APIRouter()

MODEL = "openrouter/openai/gpt-oss-120b"
EXTRA_BODY = {"provider": {"order": ["cerebras"]}}

SYSTEM_PROMPT = """You are a friendly legal assistant helping users create a Mutual Non-Disclosure Agreement (MNDA).

Your job is to have a natural freeform conversation to collect the following information:

Cover Page fields:
- purpose: The purpose of the NDA (why are the parties sharing confidential information?)
- effectiveDate: When does the NDA take effect? (format: YYYY-MM-DD)
- mndaTermType: Either "expires" (with a specific number of years) or "continues" (until terminated by either party)
- mndaTermYears: Number of years if mndaTermType is "expires"
- confidentialityTermType: Either "years" or "perpetuity"
- confidentialityTermYears: Number of years if confidentialityTermType is "years"
- governingLaw: Which US state's laws govern (e.g. "Delaware", "California")
- jurisdiction: City/county for legal disputes (e.g. "New Castle, DE")
- modifications: Any custom terms or modifications (optional)

Party 1 (first company/person):
- party1Name: Full legal name of the signatory
- party1Title: Job title
- party1Company: Company name
- party1NoticeAddress: Full mailing address for legal notices
- party1Date: Signature date (YYYY-MM-DD)

Party 2 (second company/person):
- party2Name: Full legal name of the signatory
- party2Title: Job title
- party2Company: Company name
- party2NoticeAddress: Full mailing address for legal notices
- party2Date: Signature date (YYYY-MM-DD)

Guidelines:
- Ask one or two questions at a time — don't overwhelm the user
- Be friendly and explain what each field means if the user seems unsure
- As the user provides information, extract it into field_updates immediately
- Only include fields you are confident about in field_updates — leave others as null
- When all fields are collected, let the user know the NDA is ready to download
- Always respond with a "message" string (your conversational reply to the user)

Start by greeting the user warmly and asking about the purpose of the NDA."""


class NDAFieldUpdates(BaseModel):
    purpose: Optional[str] = None
    effectiveDate: Optional[str] = None
    mndaTermType: Optional[Literal['expires', 'continues']] = None
    mndaTermYears: Optional[str] = None
    confidentialityTermType: Optional[Literal['years', 'perpetuity']] = None
    confidentialityTermYears: Optional[str] = None
    governingLaw: Optional[str] = None
    jurisdiction: Optional[str] = None
    modifications: Optional[str] = None
    party1Name: Optional[str] = None
    party1Title: Optional[str] = None
    party1Company: Optional[str] = None
    party1NoticeAddress: Optional[str] = None
    party1Date: Optional[str] = None
    party2Name: Optional[str] = None
    party2Title: Optional[str] = None
    party2Company: Optional[str] = None
    party2NoticeAddress: Optional[str] = None
    party2Date: Optional[str] = None


class ChatResponse(BaseModel):
    message: str
    field_updates: NDAFieldUpdates


class ChatMessage(BaseModel):
    role: Literal['user', 'assistant']
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]


@router.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENROUTER_API_KEY not configured")

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend([{"role": m.role, "content": m.content} for m in request.messages])

    response = completion(
        model=MODEL,
        messages=messages,
        response_format=ChatResponse,
        reasoning_effort="low",
        extra_body=EXTRA_BODY,
        api_key=api_key,
    )
    result = response.choices[0].message.content
    return ChatResponse.model_validate_json(result)
