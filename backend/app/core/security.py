import hashlib
import hmac
import os
from datetime import datetime, timedelta, timezone
from joserfc import jwt as jose_jwt
from joserfc.jwk import OctKey
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security_scheme = HTTPBearer()


def _get_key(secret_key: str) -> OctKey:
    return OctKey.import_key(secret_key.encode())


def hash_password(password: str) -> str:
    """Hash a password using PBKDF2-HMAC-SHA256 (no passlib needed)."""
    salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 260000)
    return salt.hex() + ':' + dk.hex()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a PBKDF2 hashed password."""
    try:
        salt_hex, dk_hex = hashed_password.split(':')
        salt = bytes.fromhex(salt_hex)
        dk = hashlib.pbkdf2_hmac('sha256', plain_password.encode(), salt, 260000)
        return hmac.compare_digest(dk.hex(), dk_hex)
    except Exception:
        return False


def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """Create a signed JWT using joserfc."""
    from app.core.config import settings
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode.update({"exp": int(expire.timestamp())})
    return jose_jwt.encode(
        {"alg": "HS256"},
        to_encode,
        _get_key(settings.SECRET_KEY)
    )


def decode_token(token: str) -> dict:
    """Decode and verify a JWT token."""
    from app.core.config import settings
    try:
        decoded = jose_jwt.decode(token, _get_key(settings.SECRET_KEY))
        claims = decoded.claims
        if "exp" in claims and claims["exp"] < datetime.now(timezone.utc).timestamp():
            raise HTTPException(status_code=401, detail="Token has expired")
        return claims
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
):
    """FastAPI dependency to get current authenticated user.
    Note: db is injected separately in routes using Depends(get_db).
    This just decodes and returns user_id from the token.
    """
    payload = decode_token(credentials.credentials)
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    return int(user_id)


def get_current_user_full():
    """Returns a FastAPI dependency for getting the full User ORM object."""
    def _inner(
        user_id: int = Depends(get_current_user),
        db=None,
    ):
        from app.models.user import User
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    return _inner
