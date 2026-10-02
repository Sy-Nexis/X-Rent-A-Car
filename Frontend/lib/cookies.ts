"use client";

/**
 * Enterprise Secure Cookie Utilities for XNRENT CAR
 * Enforces Strict SameSite, HTTPS Secure flags, and standard expiration
 */

export const setCookie = (name: string, value: string, days: number = 0.5) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }

  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
  const secureFlag = isHttps ? "; Secure" : "";

  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value || "")}${expires}; path=/; SameSite=Strict${secureFlag}`;
};

export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const nameEQ = encodeURIComponent(name) + "=";
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
};

export const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";
  const secureFlag = isHttps ? "; Secure" : "";
  document.cookie = `${encodeURIComponent(name)}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Strict${secureFlag}`;
};
