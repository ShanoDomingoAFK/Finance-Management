# VAT Compliance Purchase Dashboard — Management Write-Up

*Prepared from a review of the actual application code (`index.html`, `app.js`,
`styles.css`, `supabase-sync.js`). Features described below exist in the codebase;
items not yet implemented are marked **[Planned]**.*

---

## 1. What the dashboard is

The VAT Compliance Purchase Dashboard is a browser-based application that turns a
company's **purchase / disbursement records** into **BIR-ready compliance outputs**.
It consolidates purchase transactions, input VAT balances, and expanded withholding
tax (EWT) balances for a selected **fiscal month and year**, lets the finance team
verify each transaction, and generates the official BIR files (Summary List of
Purchases, QAP 1601-EQ, and the subsidiary books) in both **Excel and DAT** formats.

It runs as a static web app (HTML/CSS/JavaScript) and optionally syncs to a shared
**Supabase** cloud database so multiple users see one consolidated company dataset.

## 2. Why it was created

Preparing BIR purchase and withholding attachments manually from accounting exports
is slow and error-prone: amounts must be re-bucketed, VAT and EWT re-computed,
supplier details validated, and strict DAT file formats produced without special
characters. The dashboard was built to **standardise and automate** that monthly
process, reduce manual spreadsheet work, and lower the risk of rejected filings.

## 3. Main problems it solves

- **Manual re-keying and recomputation** of VAT and EWT for every purchase line.
- **Inconsistent supplier data** that breaks BIR DAT submissions.
- **Reconciliation gaps** between computed tax and the uploaded ledger balances.
- **Format-sensitive BIR outputs** (DAT/Excel) that are tedious to build by hand.
- **No single source of truth** when several staff work on the same period.

## 4. Key features (all present in code)

- **Six work modules:** Compliance Summary, Purchase Transactions, VAT Balances,
  EWT Balances, BIR Compliance Exports, and Master Data (VAT Categories, ATC Master,
  Supplier Master). An admin-only **Audit Trail** is available when cloud sync is on.
- **Fiscal year + month scope:** a year selector (All Years / per year) above a
  per-year month row (Full Year + each month). Data from different years never mixes;
  every report runs on the selected year or single month.
- **Imports:** XLSX upload with **automatic QuickBooks detection** — it recognises the
  *Transaction Detail by Account* (purchases), *VAT Summary / Tax Detail Report*, and
  withholding *Transaction Report*, and maps the columns automatically. Plain template
  files are also supported, with clear messages when a required column is missing.
- **Add / edit transactions:** manual entry (Date, CV No., Voucher, Description,
  Accounting Title, Bank Account, Amount, VAT Category, ATC Code, Invoice, TIN) and
  per-line inline editing of CV Number and Description.
- **Automatic VAT computation:** VAT = vatable base × the VAT Category rate
  (S / G / I / CG = 12%; SNQ / GNQ / uncoded = 0%).
- **Automatic EWT computation:** EWT = amount × the ATC Code rate from ATC Master.
- **Balance check / reconciliation:** computed Purchase VAT and EWT per CV are
  compared against uploaded VAT/EWT balances, with a rounding tolerance (±0.51).
- **Verification statuses:** Compliant, Without Invoice, Non-Compliant, Unreviewed,
  plus **Journal Entry** and **Adjusting Entry** (which are valid without invoice /
  VAT category / ATC / TIN; Adjusting Entries are excluded from all BIR exports).
- **Compliance Summary:** consolidates transactions by supplier or CV with a status
  breakdown, KPI cards, and a per-group score.
- **BIR Compliance Exports:** Summary List of Purchases (**Excel + DAT**), QAP 1601-EQ
  Schedule 1 (**Excel + DAT**), Subsidiary Purchase Book, and Cash Disbursement Book —
  with correct **individual vs non-individual** taxpayer formatting and pre-export
  validation of supplier details.
- **BIR special-character compliance:** supplier names/addresses are automatically
  sanitised for export (accents transliterated, unsupported symbols removed), and the
  Supplier Master blocks saving records with unsupported characters.
- **Sorting, searching, filtering:** type-aware column sorting (dates as dates, money
  as numbers, status by severity), free-text search, and status/variance filters.
- **Cloud sync (optional):** per-record Supabase sync with paginated loading (handles
  >1,000 rows), a safety guard against accidental mass deletes, live multi-user
  updates, an immutable audit log, and a one-time legacy-data recovery tool.
- **Responsive design:** layouts adapt across desktop, tablet, and mobile widths.

## 5. Compliance benefits

- BIR-ready **SLP and QAP** outputs in the exact **Excel and DAT** formats.
- **VAT and EWT computed consistently** from configurable master rates.
- **Reconciliation** of computed tax against uploaded balances per CV.
- **Clean DAT files** — special characters are sanitised so submissions are accepted.
- **Audit trail** of who changed what (when cloud sync is enabled).

## 6. Operational benefits

- One **monthly workflow** replaces multiple manual spreadsheets.
- **QuickBooks working papers upload directly** — no custom template needed.
- **Shared, consolidated dataset** across the finance team (optional cloud).
- **Year-over-year history** retained without slowing the current period.
- Runs in any modern browser; no installation for end users.

## 7. Limitations / pending improvements

- **Static front-end:** when cloud sync is used, the Supabase URL and publishable key
  live in a browser config file and cannot be fully hidden from someone inspecting the
  page. A backend/proxy would be required to hide them. *(Inherent to a static app.)*
- **Company profile** (filer TIN, name, address used in BIR headers) is currently a
  built-in constant in the code, not an in-app settings screen. **[Planned]** Settings UI.
- **Single shared database** by design; multi-tenant separation is not built in.
- **Browser/local storage** holds data offline; large datasets depend on the device.
- BIR file formats should be **spot-checked** against the latest RDO requirements on
  first use, as regulator templates change over time.

## 8. Recommended next steps

1. **Verify outputs:** export one SLP/QAP DAT and Excel for a known month and confirm
   acceptance against your RDO's validator before relying on it monthly.
2. **Configure the cloud** (optional): point the app at the company's own Supabase
   project (see the SOP "Backup and sync" section / IT transfer note).
3. **[Planned]** Add an in-app **Company Profile / Settings** screen so the filer
   details and book headers can be edited without code changes.
4. **[Planned]** Add export-time sanitisation to inline supplier names on imported
   transactions (currently applied via Supplier Master + export engine).
5. Establish the **monthly SOP cadence** (below) and assign reviewer/approver roles.
