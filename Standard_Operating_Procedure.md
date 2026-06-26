# Standard Operating Procedure (SOP)
## VAT Compliance Purchase Dashboard

*Grounded in the actual application. Steps reference real on-screen modules and
buttons. Planned/not-yet-built items are marked **[Planned]**.*

---

### 1. Purpose
To standardise how the finance/tax team processes monthly purchase and disbursement
data into verified, BIR-ready compliance outputs (SLP, QAP 1601-EQ, and subsidiary
books) using the dashboard.

### 2. Scope
Covers monthly processing of **purchases, input VAT, and expanded withholding tax
(EWT)** for one company, per **fiscal year and month**, from data upload through to
BIR Compliance Export generation.

### 3. Responsible users
| Role | Responsibility |
|------|----------------|
| **Preparer (Accounting/Bookkeeping)** | Upload working papers, add/correct transactions, maintain master data |
| **Reviewer (Tax/Finance)** | Verify VAT/EWT, set verification statuses, review Compliance Summary |
| **Approver (Tax Manager/Controller)** | Approve the period and authorise BIR exports |
| **Admin/IT** | Manage cloud sync, monitor the Audit Trail, manage database settings |

### 4. Required source files
- **Purchase Transactions** — QuickBooks *Transaction Detail by Account* (or template).
- **VAT Balances** — QuickBooks *VAT Summary / Tax Detail Report* (input VAT on purchases).
- **EWT Balances** — QuickBooks withholding *Transaction Report*.
- *(Optional master files)* Supplier Master, ATC Master, VAT Categories.
- Files must be **.xlsx**. QuickBooks files are detected automatically.

### 5. Step-by-step upload process
1. Open the dashboard; if cloud sync is enabled, **log in**.
2. Select the **fiscal year** and the **month** you are processing (top scope bar).
3. Click **Import XLSX**.
4. Drag the file into the drop zone (or click to browse). The system **auto-detects**
   whether it is a Purchase, VAT, or EWT file.
5. Choose **Replace** (overwrite this data type for the period) or leave unchecked to
   **append**.
6. Confirm the detected type and imported row count in the message.
7. Repeat for the VAT and EWT working papers.
8. If a required column is missing/renamed, read the **validation message** and
   re-export the standard report.

### 6. Transaction verification process
1. Go to **Purchase Transactions**.
2. Click a CV group to open the review panel.
3. For each line, confirm Supplier/TIN, Invoice, Amount, **VAT Category**, **ATC Code**.
4. Set the **Verification status**:
   - **Compliant** — complete with invoice.
   - **Without Invoice** — disbursement lacking an invoice.
   - **Non-Compliant** — has issues to resolve.
   - **Unreviewed** — not yet checked.
   - **Journal Entry / Adjusting Entry** — intentional postings; valid without
     invoice/VAT/ATC/TIN (Adjusting Entries are excluded from BIR exports).
5. Use inline **Edit** to correct the **CV Number** or **Description** where needed.
6. The status card colour reflects the selected status; edits save automatically.

### 7. Supplier Master Data maintenance
1. Go to **Master Data → Supplier Master**.
2. Add/update a supplier by **TIN** with Registered Name (or Last/First/Middle for
   individuals), Address, City, ZIP.
3. **BIR character rule:** records with unsupported characters **cannot be saved** —
   the affected field is highlighted and a message explains the BIR limitation.
   Remove accents/symbols (e.g. ñ, é, #, @, *, :, ;) and save again.
4. Keep **ATC Master** (EWT rates) and **VAT Categories** (VAT rates) current here too.

### 8. VAT and EWT review process
- **VAT** is computed automatically: vatable base × VAT Category rate
  (S/G/I/CG = 12%; SNQ/GNQ/uncoded = 0%).
- **EWT** is computed automatically: amount × ATC Code rate (from ATC Master).
- Open **VAT Balances** / **EWT Balances** to compare **computed tax vs uploaded
  ledger** per CV. Investigate any CV flagged **"Review balances"** (difference beyond
  the ±0.51 rounding tolerance) — usually a missing line, wrong code, or wrong amount.

### 9. Compliance Summary review
1. Open **Compliance Summary**.
2. Consolidate by **Supplier** or **CV Number**.
3. Review the KPI cards and status breakdown (Compliant / Without Invoice /
   Non-Compliant / Unreviewed / Journal / Adjusting).
4. Click a status card to filter; resolve outstanding items before export.

### 10. BIR Compliance Export process
1. Ensure a **single month** is selected (Full Year/All scopes cannot export DAT).
2. Open **BIR Compliance Exports**.
3. Choose the report: **SLP Excel/DAT**, **QAP 1601-EQ Excel/DAT**, **Subsidiary
   Purchase Book**, or **Cash Disbursement Book**.
4. Click **Export selected report**.
5. If supplier details are incomplete, the system **blocks export** and lists the
   lines needing TIN/name/address — correct them and retry.
6. Files download with BIR-standard names. Supplier text is **auto-sanitised** for
   DAT compatibility.

### 11. Error correction process
- **Import validation messages:** fix the source file column and re-upload.
- **"Review balances":** open the CV, correct the amount/code or VAT/EWT line.
- **Export blocked (supplier details):** complete TIN/name/address in Supplier Master
  or on the line, then re-export.
- **Supplier won't save (special characters):** edit the highlighted field.

### 12. Data validation guidelines
- Dates should be **MM/DD/YYYY**; the system normalises common formats on import.
- Every exported purchase line needs a **9-digit supplier TIN**, name, address, city.
- VAT/EWT must reconcile to the uploaded ledger within tolerance.
- Adjusting Entries are excluded from BIR; Journal Entries are included but exempt
  from missing-field flags.

### 13. Approval / review checkpoints
1. **Preparer** completes upload + verification → hands off.
2. **Reviewer** confirms VAT/EWT reconciliation and statuses in Compliance Summary.
3. **Approver** signs off the period before BIR exports are generated/filed.

### 14. Backup and sync reminders
- With cloud sync on, edits save per-record to Supabase automatically; use **Save /
  Load** in the Cloud panel to force a sync.
- Keep the **source .xlsx working papers** archived per month as the primary backup.
- **IT — transferring to the company's own database:** the cloud connection is set in
  `supabase-config.js` (`url`, `publishableKey`, `table`). To move from the current
  Supabase project to a company-owned one: create the Supabase project, create the
  tables `vat_transactions`, `vat_vat_ledger`, `vat_ewt_ledger`, `vat_supplier_master`,
  `vat_atc_master`, `vat_categories`, and `audit_log` (each keyed by a unique
  `record_id`), then update `supabase-config.js` with the new project URL and
  publishable key. Use only a **publishable/anon** key in the browser file — never a
  service-role key or database password.

### 15. Common issues and troubleshooting
| Issue | Likely cause | Action |
|-------|--------------|--------|
| "Could not load the Supabase library" | CDN/network blocked | Check connection; host the library locally if needed |
| Some records not visible | Wrong year/month selected | Check the fiscal year + month scope bar |
| Import "missing columns" | Renamed/edited QuickBooks export | Re-export the standard report unchanged |
| Export blocked | Incomplete supplier details | Complete TIN/name/address and retry |
| Supplier won't save | Unsupported special characters | Edit the highlighted field |
| CV shows "Review balances" | Computed vs uploaded mismatch | Reconcile the CV's VAT/EWT lines |
