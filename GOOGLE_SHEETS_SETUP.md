# Send Form Responses to Google Sheets

The survey already POSTs JSON to whatever URL is set in `VITE_SURVEY_ENDPOINT`. The simplest, free, no‑server way to land that JSON in a Google Sheet is a **Google Apps Script Web App**.

## 1. Create the Sheet

1. Go to https://sheets.new and name it (e.g. `SLB Fan Feedback`).
2. Note the tab name at the bottom (default: `Sheet1`).

## 2. Add the Apps Script

1. In the sheet menu: **Extensions → Apps Script**.
2. Delete the placeholder code and paste:

```js
const SHEET_NAME = 'Sheet1'; // change if your tab is named differently

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);

    // If the sheet is empty, write headers from the payload keys first.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(Object.keys(data));
    }

    // Append values in the same column order as existing headers.
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = headers.map(h => {
      const v = data[h];
      return v === undefined || v === null ? '' : v;
    });

    // Add any new keys that weren't in the header row yet.
    Object.keys(data).forEach(k => {
      if (!headers.includes(k)) {
        sheet.getRange(1, sheet.getLastColumn() + 1).setValue(k);
        row.push(data[k]);
      }
    });

    sheet.appendRow(row);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. Click **Save** (disk icon), name the project anything.

## 3. Deploy it as a Web App

1. Top‑right: **Deploy → New deployment**.
2. Gear icon → **Web app**.
3. Settings:
   - **Description:** anything
   - **Execute as:** *Me*
   - **Who has access:** **Anyone** (required — the browser posts anonymously)
4. Click **Deploy**, approve the Google permission prompt.
5. Copy the **Web app URL**. It looks like:
   `https://script.google.com/macros/s/AKfy.../exec`

## 4. Point the app at it

In **Vercel → Project → Settings → Environment Variables**, add:

| Name | Value |
|---|---|
| `VITE_SURVEY_ENDPOINT` | the Web app URL from step 3 |

Redeploy. Every form (fan, player, media, partner, discount) will append a row.

## Notes

- **CORS:** the survey form posts JSON with `Content-Type: application/json`. The browser sends a preflight; Apps Script handles this automatically on `/exec` URLs.
- **Updating the script:** if you edit the script, you must **Deploy → Manage deployments → edit (pencil) → New version → Deploy** for the URL to serve the new code. The URL itself doesn't change.
- **One sheet, all audiences:** every payload includes `audience` (`fan`, `player`, …) and `formTitle`, so you can filter / pivot in‑sheet. If you'd rather route each audience to its own tab, tell me and I'll update both the script and the form code.
- **Spam protection:** the endpoint is public. If you start seeing junk, add a shared‑secret header check in `doPost` and send the same header from the form.
