import hmac
import hashlib
from django.conf import settings

def verify_xendit_signature(signature, payload):
    """
    Verify Xendit webhook signature to ensure it's legitimate
    """
    if not signature or not settings.XENDIT_CALLBACK_TOKEN:
        return False
    
    # Xendit signs the payload using HMAC-SHA256
    expected_signature = hmac.new(
        settings.XENDIT_CALLBACK_TOKEN.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)