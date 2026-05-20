"""
Clerk user lookup with in-memory TTL cache.
Used to resolve user_id → email for admin checks without per-request API overhead.
"""
import logging
import os
import time
from typing import Optional

import httpx

logger = logging.getLogger(__name__)

_ADMIN_EMAILS: frozenset[str] = frozenset(
    e.strip().lower()
    for e in os.getenv("ADMIN_EMAILS", "").split(",")
    if e.strip()
)

# Simple TTL cache: user_id -> (email, fetched_at)
_email_cache: dict[str, tuple[str, float]] = {}
_CACHE_TTL = 3600.0  # 1 hour


async def get_user_email(user_id: str) -> Optional[str]:
    """Fetch the primary email for a Clerk user_id, cached for 1 hour."""
    now = time.monotonic()
    cached = _email_cache.get(user_id)
    if cached and (now - cached[1]) < _CACHE_TTL:
        return cached[0]

    secret = os.getenv("CLERK_SECRET_KEY")
    if not secret:
        logger.warning("CLERK_SECRET_KEY not set — cannot resolve user email")
        return None

    try:
        async with httpx.AsyncClient(timeout=5) as client:
            res = await client.get(
                f"https://api.clerk.com/v1/users/{user_id}",
                headers={"Authorization": f"Bearer {secret}"},
            )
            res.raise_for_status()
            data = res.json()

        primary_id = data.get("primary_email_address_id")
        for ea in data.get("email_addresses", []):
            if ea.get("id") == primary_id:
                email = ea["email_address"].lower().strip()
                _email_cache[user_id] = (email, now)
                return email
    except Exception as exc:
        logger.warning(f"Failed to fetch email for {user_id}: {exc}")

    return None


def is_admin_email(email: Optional[str]) -> bool:
    if not email:
        return False
    return email.lower().strip() in _ADMIN_EMAILS
