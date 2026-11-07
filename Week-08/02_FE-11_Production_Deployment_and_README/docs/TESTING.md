# FE-11 Manual Test Plan

Record actual results and date before submission. Do not mark tests passed unless executed.

## Functional
- [ ] Submit a normal question and confirm text streams into the assistant message.
- [ ] Confirm send is disabled while generating.
- [ ] Confirm API/provider failures show a user-friendly error.
- [ ] Confirm whitespace-only input cannot be submitted.

## API validation
- [ ] Missing environment variables: endpoint fails closed with 503.
- [ ] Malformed JSON: 400.
- [ ] Missing/non-array `messages`: 400.
- [ ] More than 12 messages: 400.
- [ ] Message content over 4,000 characters: 400.
- [ ] Body over 24 KB: 413.
- [ ] More than 10 requests in a rolling minute for one IP: 429 and `Retry-After`.

## Deployment/security
- [ ] `npm run build` succeeds.
- [ ] `npm run lint` succeeds.
- [ ] Vercel Production environment has all required secrets.
- [ ] API key is absent from client bundles, repository history, and screenshots.
- [ ] Public production URL works in a private/incognito browser window.
- [ ] Confirm rate limiting works across more than one request and after deployment.

## Browser matrix
| Browser | Version/device | Date | Result | Notes |
|---|---|---|---|---|
| Chrome | Desktop | | Not run | |
| Firefox | Desktop | | Not run | |
| Safari | macOS | | Not run | |
| Safari | iOS | | Not run | |
| Chrome | Android | | Not run | |
