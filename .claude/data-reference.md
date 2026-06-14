# Gherkin Test Data Reference

Quick lookup for which test data to use with each Gherkin scenario.

---

## 🔐 User Authentication Feature
**File:** `features/user-authentication.feature`
**Data Files:** `data/auth/user.json`, `data/auth/register.json`

| Scenario | Data File | Data Key | Key Fields |
|----------|-----------|----------|-----------|
| User successfully authenticates | `data/auth/user.json` | `validUser` | email, password |
| User can create a new account | `data/auth/register.json` | `register_user` | email, password, confirm_password |
| System validates email format | `data/auth/user.json` | `validUser` | Use invalid email: `invalid-email` |
| System validates required fields | `data/auth/user.json` | `validUser` | Use empty: email="", password="" |
| User can logout | `data/auth/user.json` | `validUser` | email, password (login first) |

**Data Values:**
```json
{
  "validUser": {
    "email": "testing@gmail.com",
    "password": "Testing@123",
    "fullName": "Testing User",
    "phone": "1234567890"
  },
  "register_user": {
    "email": "testing@gmail.com",
    "password": "Testing@123",
    "confirm_password": "Testing@123"
  },
  "register_user_negative": {
    "email": "negative@test.com",
    "password": "Testing@123",
    "confirm_password": "WrongPass@1",
    "expected_error": "Passwords do not match"
  }
}
```

---

## 📚 Event Browsing Feature
**File:** `features/event-browsing.feature`
**Data Files:** `data/admin/manage-events.json`

| Scenario | Data File | Data Key | Key Fields |
|----------|-----------|----------|-----------|
| User can browse events | `data/admin/manage-events.json` | `validEvent` | title, description, category, price |
| User can filter by category | `data/admin/manage-events.json` | `validEvent`, `validEventFestival` | category, title |
| User can view event details | `data/admin/manage-events.json` | `validEvent` | title, venue, dateTime, price, seats |

**Data Values:**
```json
{
  "validEvent": {
    "title": "Tech Conference 2026",
    "description": "Annual technology conference...",
    "category": "Conference",
    "city": "Bangalore",
    "venue": "Convention Center, Whitefield",
    "dateTime": "2026-12-25T09:00",
    "price": "1500",
    "seats": "500"
  },
  "validEventFestival": {
    "title": "Summer Music Festival 2026",
    "category": "Festival",
    "city": "Hyderabad",
    "venue": "Hitech City Grounds",
    "dateTime": "2026-06-15T17:00",
    "price": "2000",
    "seats": "2000"
  }
}
```

---

## 🎫 Event Booking Feature
**File:** `features/event-booking.feature`
**Data Files:** `data/Book-Event/book-event.json`, `data/auth/user.json`

| Scenario | Data File | Data Key | Key Fields |
|----------|-----------|----------|-----------|
| User can book a ticket | Use defaults: fullName, email, phone, qty=1 | — | Requires login first (use validUser) |
| System validates booking form | `data/Book-Event/book-event.json` | `invalidFormData` | email, fullName, phone |

**Data Values:**
```json
{
  "invalidFormData": {
    "email": "testing@.com",
    "fullName": "a",
    "phone": "123456789"
  }
}
```

**Form Validation Errors Expected:**
- `email`: "Invalid email format"
- `fullName`: "Name too short (minimum 2 characters)"
- `phone`: "Invalid phone format"

---

## ✅ Form Validation Feature
**File:** `features/form-validation.feature`
**Data Files:** `data/Book-Event/book-event.json`

| Test Case | Data File | Expected Error |
|-----------|-----------|-----------------|
| Empty fields | Use empty values: "", "", "" | Field required errors |
| Invalid email | `data/Book-Event/book-event.json` `invalidFormData.email` | "Invalid email format" |
| Invalid phone | `data/Book-Event/book-event.json` `invalidFormData.phone` | "Invalid phone format" |
| Short name | `data/Book-Event/book-event.json` `invalidFormData.fullName` | "Name too short" |

---

## 📋 My Bookings Feature
**File:** `features/my-bookings.feature`
**Data Files:** `data/auth/user.json` (for login)

| Scenario | Data File | Data Key | Notes |
|----------|-----------|----------|-------|
| User can view bookings | `data/auth/user.json` | `validUser` | Must login first |
| User can manage bookings | `data/auth/user.json` | `validUser` | Must have existing bookings |

---

## 📍 How to Use in Gherkin Steps

### Example: Fill Login Form
```gherkin
When user provides valid login credentials
  # Load data/auth/user.json → validUser
  ├─ Fill email: testing@gmail.com
  ├─ Fill password: Testing@123
  └─ Click Login button
```

### Example: Validate Booking Form
```gherkin
When user fills booking form with invalid data
  # Load data/Book-Event/book-event.json → invalidFormData
  ├─ Fill email: testing@.com        (invalid)
  ├─ Fill fullName: a                 (too short)
  ├─ Fill phone: 123456789            (invalid format)
  └─ Submit Form

Then system displays validation errors
  ├─ Email error: "Invalid email format"
  ├─ Name error: "Name too short"
  └─ Phone error: "Invalid phone format"
```

---

## 🔑 Valid Credentials Summary

| Purpose | Email | Password | File |
|---------|-------|----------|------|
| Login | `testing@gmail.com` | `Testing@123` | `data/auth/user.json` |
| Registration | `testing@gmail.com` | `Testing@123` | `data/auth/register.json` |
| New User | `newuser@test.com` | `Testing@123` | (create new if needed) |

---

## ⚠️ Invalid Test Data Summary

| Field | Invalid Value | Expected Error | File |
|-------|---------------|-----------------|------|
| Email | `testing@.com` | "Invalid email format" | `data/Book-Event/book-event.json` |
| Full Name | `a` | "Name too short" | `data/Book-Event/book-event.json` |
| Phone | `123456789` | "Invalid phone format" | `data/Book-Event/book-event.json` |
| Password | `123` | "Password too short" | (validation) |

---

## 🎯 Quick Reference by Feature

### ✅ Always Use These Files:
- **Auth:** `data/auth/user.json` + `data/auth/register.json`
- **Booking:** `data/Book-Event/book-event.json`
- **Events:** `data/admin/manage-events.json`

### ✅ Always Use These Keys:
- `validUser` — For login scenarios
- `register_user` — For registration scenarios
- `invalidFormData` — For validation testing
- `validEvent` — For event browsing

### ✅ Always Extract These Fields:
```javascript
// For Login
const { email, password } = require('./data/auth/user.json').validUser;

// For Registration
const { email, password, confirm_password } = require('./data/auth/register.json').register_user;

// For Booking Validation
const { fullName, email, phone } = require('./data/Book-Event/book-event.json').invalidFormData;

// For Event Display
const { title, price, seats } = require('./data/admin/manage-events.json').validEvent;
```
