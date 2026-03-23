<img width="1362" height="666" alt="image" src="https://github.com/user-attachments/assets/8b857bfc-89f4-4fca-aa6a-9580d1afbe3e" />



## What is JWT?

JWT stands for **JSON Web Token**. It is simply a **small piece of text** (a string) that a server gives to a user after they log in. Think of it like a **access card** you get when you enter a building — every time you want to access a room, you show that card instead of proving your identity again from scratch.


## Why is JWT used?

The server has a problem — **HTTP is stateless**, meaning the server has no memory. Every request is brand new to the server. So when you log in and then click "My Profile", the server has no idea who you are on that second request.

**JWT solves this** — instead of the server remembering you, you carry a token that proves who you are on every single request.


## How does it look?

A JWT looks like this:

```
eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjEyMyIsInJvbGUiOiJtZW50b3IifQ.s5abc123xyz
```

It has **3 parts** separated by dots:

|Part|Name|Contains|
|---|---|---|
|First|**Header**|Algorithm used to sign|
|Second|**Payload**|Your data (userId, role etc.)|
|Third|**Signature**|Proof it hasn't been tampered|

There are 3 common places to store JWT:

| Storage             | Used in your project | Pro                         | Con                        |
| ------------------- | -------------------- | --------------------------- | -------------------------- |
| **localStorage**    | ✅ Yes                | Simple, persists on refresh | Vulnerable to XSS attacks  |
| **sessionStorage**  | ❌ No                 | Cleared on tab close        | Lost on refresh            |
| **HttpOnly Cookie** | ❌ No                 | Most secure                 | Slightly complex to set up |

- JWT is **not encrypted** — anyone can read the payload, so never store passwords or sensitive data inside it
- JWT is **tamper-proof** — nobody can modify it without the secret key
- JWT has an **expiry** — after that time it becomes invalid and the user must log in again
- The server **never stores the token** — it only stores the secret key to verify it


## How JWT Expiry Actually Works

### 1. When the token is created

When you call `signToken(userId)`, the JWT library **bakes a timestamp** into the token itself. It records two things inside the token's payload:

- **`iat`** (issued at) — the exact moment the token was created
- **`exp`** (expires at) — the exact moment it should die

These are stored as **Unix timestamps** (number of seconds since Jan 1, 1970). So if you create a token now and set `expiresIn: "7d"`, the library just does the math and writes the expiry time directly into the token.

---

### 2. The token sits with the client

The token lives on the frontend (localStorage, cookie, wherever). The server **does not track it at all.** There's no database entry, no session record — nothing. The expiry info is entirely self-contained inside the token itself.

---

### 3. When the client sends the token back

Every time the client makes a request, it sends the token in the `Authorization` header. The server receives it and calls `jwt.verify()`.

---

### 4. What `jwt.verify()` actually does internally

This is the important part. When verify runs, it does **three things in order:**

- **Step 1 — Checks the signature** — Was this token actually signed by our secret? If someone tampered with it or faked it, it fails here immediately.
- **Step 2 — Reads the `exp` field** from inside the token payload
- **Step 3 — Compares `exp` against the current time** — If current time is past the `exp` value, it throws a `TokenExpiredError` automatically. You don't have to write this logic yourself — the library handles it.

---

### 5. What happens on expiry

If the token is expired, `jwt.verify()` **throws an error** instead of returning the decoded payload. Your middleware catches that error and sends back a `401 Unauthorized` response. The user has to log in again to get a fresh token.

---

### The code part

```javascript
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  // ✅ token is valid and not expired
  req.user = decoded;
  next();
} catch (err) {
  if (err.name === "TokenExpiredError") {
    // ❌ token is expired
    return res.status(401).json({ message: "Token expired, please login again" });
  }
  return res.status(401).json({ message: "Invalid token" });
}
```

