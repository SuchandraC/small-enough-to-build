/* Small Enough to Build — reply store and public answer count.
 *
 * doPost  stores a reply as a row in the sheet. Private to you.
 * doGet   returns ONLY {"count": n}. No names, no answers, nothing a
 *         visitor could read back. This is what the site fetches.
 *
 * Setup lives in apps-script/SETUP.md.
 */

var SHEET = 'replies';
var HEADERS = ['when', 'name', 'understood', 'question', 'answer',
               'missing bricks', 'wants to make',
               'recognisable or stable', 'brick threshold'];

function doPost(e) {
  // Two people submitting at the same moment would otherwise race for
  // the same row. Wait briefly rather than overwrite.
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return json({ ok: false, error: 'busy' });
  }

  try {
    var d = JSON.parse(e.postData.contents);
    var sh = sheet();
    if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
    sh.appendRow([new Date(), d.name, d.understood, d.question, d.answer,
                  d.missing_bricks, d.wants_to_make,
                  d.recognisable_or_stable, d.brick_threshold]);
    return json({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  var sh = SpreadsheetApp.getActive().getSheetByName(SHEET);
  // getLastRow counts the header, so subtract it. Never go below zero,
  // which is what an untouched sheet would give us.
  var n = sh ? Math.max(0, sh.getLastRow() - 1) : 0;
  return json({ count: n });
}

function sheet() {
  var ss = SpreadsheetApp.getActive();
  return ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}
