import DOMPurify from 'isomorphic-dompurify';

/**
 * Enterprise Client-Side Sanitization Utility
 * Sanitizes user-controlled inputs and rendered strings against XSS attacks
 */
export function sanitizeInput(input: string): string {
    if (!input || typeof input !== 'string') return '';
    return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [], // Strip all HTML tags by default
        ALLOWED_ATTR: [],
    }).trim();
}

/**
 * Sanitizes rich text / formatted notes if allowed
 */
export function sanitizeHtml(html: string): string {
    if (!html || typeof html !== 'string') return '';
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
        ALLOWED_ATTR: ['href', 'target', 'rel'],
    });
}
