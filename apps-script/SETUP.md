# Turning on the answer count

About ten minutes, all of it clicking in Google. At the end you paste one
URL into `index.html` and the count line appears on the site.

Until you do this, nothing breaks — `COUNT_ENDPOINT` stays blank, the count
line stays hidden, and Formspree keeps emailing you as it does now.

## 1. Make the sheet

1. Go to [sheets.new](https://sheets.new) — a blank spreadsheet.
2. Name it something like *Small Enough to Build — replies*.
3. Rename the bottom tab from `Sheet1` to **`replies`** (double-click it).
   The script looks for that exact name.

## 2. Add the script

1. In the sheet: **Extensions → Apps Script**.
2. Delete the `function myFunction() {}` stub it starts you with.
3. Paste in the whole of [`Code.gs`](Code.gs) from this folder.
4. Save (the disk icon).

## 3. Deploy it

1. **Deploy → New deployment**.
2. Click the gear next to "Select type" → **Web app**.
3. Set:
   - **Execute as:** *Me* — so the script can write to your sheet
   - **Who has access:** *Anyone* — so visitors' browsers can reach it
4. **Deploy**. Google asks you to authorise; it will warn that the app
   isn't verified. That's expected for your own script — click
   **Advanced → Go to (project name)** and allow it.
5. Copy the **Web app URL**. It ends in `/exec`.

> "Anyone" sounds alarming but applies only to what the script chooses to
> expose. `doGet` returns `{"count": 12}` and nothing else — no names, no
> answers. The replies themselves are readable only in your sheet.

## 4. Paste it into the site

In `index.html`, find `COUNT_ENDPOINT` near the top of the `<script>` block
and fill it in:

```js
var COUNT_ENDPOINT = "https://script.google.com/macros/s/AKfy.../exec";
```

Then:

```
git add -A && git commit -m "Turn on the answer count" && git push
```

## 5. Check it

- Open the `/exec` URL directly in a browser. You should see `{"count":0}`.
- Submit the form on the live site. A row appears in the sheet within a
  second or two, and the reply still lands in Formspree.
- Reload the site. The line under the feedback heading now reads
  *"1 person has answered so far."*

## If you change `Code.gs` later

Editing the script isn't enough — you have to redeploy. **Deploy → Manage
deployments →** pencil icon **→ Version: New version → Deploy**. The URL
stays the same.

## Notes

- **Two backends at once.** The form POSTs to both Formspree and the sheet.
  Formspree gives you email; the sheet gives you the count and rows you can
  sort. If you'd rather drop Formspree, blank out `FORM_ENDPOINT`.
- **The count is public, the replies are not.** Worth re-reading `doGet` in
  `Code.gs` if you want to satisfy yourself about that.
- **The count is not spam-proof.** Someone could submit repeatedly and push
  it up. It's a friendly number, not a measurement.
- **Apps Script quotas** are far above anything this will see — thousands of
  requests a day on a free account.
