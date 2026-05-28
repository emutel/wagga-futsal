export interface ABAPayee {
  bsb: string;           // XXX-XXX
  accountNumber: string; // digits only, up to 9
  accountName: string;   // up to 32 chars
  amountCents: number;
  reference: string;     // appears on payee's statement, up to 18 chars
}

export interface ABAOptions {
  bankMnemonic: string;      // 3-letter code e.g. 'WBC', 'CBA', 'NAB', 'ANZ'
  userName: string;          // your org name, up to 26 chars
  userBsb: string;           // your BSB XXX-XXX
  userAccount: string;       // your account number, digits only
  apcaId: string;            // 6-digit ID issued by your bank
  description: string;       // e.g. 'GAME FEES', up to 12 chars
  processingDate: Date;
}

function r(s: string, len: number) {
  return s.substring(0, len).padEnd(len, " ");
}

function l(s: string, len: number, pad = "0") {
  return s.substring(0, len).padStart(len, pad);
}

function normBsb(bsb: string) {
  const digits = bsb.replace(/\D/g, "").substring(0, 6);
  return `${digits.substring(0, 3)}-${digits.substring(3, 6)}`;
}

function normAccount(acct: string) {
  return acct.replace(/\D/g, "").substring(0, 9);
}

function ddmmyy(d: Date) {
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yy = String(d.getUTCFullYear()).slice(-2);
  return `${dd}${mm}${yy}`;
}

export function generateABA(payees: ABAPayee[], opts: ABAOptions): string {
  const lines: string[] = [];

  // ── Header (type 0) ────────────────────────────────────────────────────────
  // 1       record type '0'
  // 2-18    17 spaces
  // 19-20   reel sequence '01'
  // 21-23   bank mnemonic (3)
  // 24-56   33 spaces
  // 57-76   user preferred spec (20 — actually spec says 26, we use 26)
  // 77-82   APCA user ID (6 digits)
  // 83-94   description (12)
  // 95-100  date DDMMYY
  // 101-120 20 spaces
  const header =
    "0" +
    " ".repeat(17) +
    "01" +
    r(opts.bankMnemonic.toUpperCase(), 3) +
    " ".repeat(7) +
    " ".repeat(26) +
    r(opts.userName, 26) +
    l(opts.apcaId.replace(/\D/g, ""), 6) +
    r(opts.description.toUpperCase(), 12) +
    ddmmyy(opts.processingDate) +
    " ".repeat(20);
  lines.push(header.substring(0, 120).padEnd(120, " "));

  let creditTotal = 0;

  // ── Detail records (type 1) ────────────────────────────────────────────────
  // 1       '1'
  // 2-8     BSB (XXX-XXX)
  // 9-17    account number (9, right-justified blank-filled)
  // 18      indicator ' '
  // 19-20   transaction code '50' (externally initiated credit / salary)
  // 21-30   amount cents (10, right-justified zero-filled)
  // 31-62   title of account (32, left-justified)
  // 63-80   lodgement reference (18, left-justified)
  // 81-87   trace BSB
  // 88-96   trace account (9, right-justified blank-filled)
  // 97-112  name of remitter (16, left-justified)
  // 113-120 withholding tax '00000000'
  for (const p of payees) {
    const bsb = normBsb(p.bsb);
    const acct = normAccount(p.accountNumber);
    const amt = Math.round(p.amountCents);
    creditTotal += amt;

    const detail =
      "1" +
      r(bsb, 7) +
      r(normAccount(p.accountNumber).padStart(9, " "), 9) +
      " " +
      "50" +
      l(String(amt), 10) +
      r(p.accountName, 32) +
      r(p.reference, 18) +
      r(normBsb(opts.userBsb), 7) +
      r(normAccount(opts.userAccount).padStart(9, " "), 9) +
      r(opts.userName, 16) +
      "00000000";
    lines.push(detail.substring(0, 120).padEnd(120, " "));
  }

  // ── Trailer (type 7) ───────────────────────────────────────────────────────
  // 1       '7'
  // 2-8     '999-999'
  // 9-20    12 spaces
  // 21-30   net total (10)
  // 31-40   credit total (10)
  // 41-50   debit total (10) — always 0 for pure payroll
  // 51-74   24 spaces
  // 75-80   record count (6)
  // 81-120  40 spaces
  const trailer =
    "7" +
    "999-999" +
    " ".repeat(12) +
    l(String(creditTotal), 10) +
    l(String(creditTotal), 10) +
    l("0", 10) +
    " ".repeat(24) +
    l(String(payees.length), 6) +
    " ".repeat(40);
  lines.push(trailer.substring(0, 120).padEnd(120, " "));

  return lines.join("\r\n");
}
