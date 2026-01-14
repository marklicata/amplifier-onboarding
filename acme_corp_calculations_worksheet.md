# Acme Corp - Financial Calculations Worksheet

## Table of Contents
1. [Source Data](#source-data)
2. [Profitability Calculations](#profitability-calculations)
3. [Liquidity Calculations](#liquidity-calculations)
4. [Efficiency Calculations](#efficiency-calculations)
5. [Leverage Calculations](#leverage-calculations)
6. [Summary Dashboard](#summary-dashboard)

---

## SOURCE DATA

### Income Statement (in $000s)
```
                                Current Year    Prior Year
Revenue                         $50,000         $45,000
Cost of Goods Sold (COGS)       $32,000         $29,250
Gross Profit                    $18,000         $15,750
Operating Expenses              $10,000         $9,000
Operating Income (EBIT)         $8,000          $6,750
Interest Expense                $1,000          $900
Income Before Tax               $7,000          $5,850
Tax Expense                     $1,750          $1,463
Net Income                      $5,250          $4,388
```

### Balance Sheet (in $000s)
```
                                Current Year    Prior Year
ASSETS
Cash & Equivalents              $3,500          $3,000
Accounts Receivable             $8,000          $7,200
Inventory                       $6,500          $6,000
Current Assets                  $18,000         $16,200
Fixed Assets (Net)              $22,000         $20,000
Total Assets                    $40,000         $36,200

LIABILITIES
Accounts Payable                $4,000          $3,600
Short-term Debt                 $2,000          $2,000
Current Liabilities             $6,000          $5,600
Long-term Debt                  $12,000         $11,000
Total Liabilities               $18,000         $16,600

EQUITY
Shareholders' Equity            $22,000         $19,600
Total Liabilities & Equity      $40,000         $36,200
```

---

## PROFITABILITY CALCULATIONS

### 1. Gross Margin

**Formula:** (Gross Profit / Revenue) × 100

**Current Year:**
```
= ($18,000 / $50,000) × 100
= 0.36 × 100
= 36.0%
```

**Prior Year:**
```
= ($15,750 / $45,000) × 100
= 0.35 × 100
= 35.0%
```

**Year-over-Year Change:**
```
= 36.0% - 35.0%
= +1.0 percentage points
= +2.9% improvement
```

---

### 2. Operating Margin

**Formula:** (Operating Income / Revenue) × 100

**Current Year:**
```
= ($8,000 / $50,000) × 100
= 0.16 × 100
= 16.0%
```

**Prior Year:**
```
= ($6,750 / $45,000) × 100
= 0.15 × 100
= 15.0%
```

**Year-over-Year Change:**
```
= 16.0% - 15.0%
= +1.0 percentage points
= +6.7% improvement
```

---

### 3. Net Margin

**Formula:** (Net Income / Revenue) × 100

**Current Year:**
```
= ($5,250 / $50,000) × 100
= 0.105 × 100
= 10.5%
```

**Prior Year:**
```
= ($4,388 / $45,000) × 100
= 0.0975 × 100
= 9.75%
```

**Year-over-Year Change:**
```
= 10.5% - 9.75%
= +0.75 percentage points
= +7.7% improvement
```

---

### 4. Return on Assets (ROA)

**Formula:** (Net Income / Average Total Assets) × 100

**Average Total Assets:**
```
= (Current Year Assets + Prior Year Assets) / 2
= ($40,000 + $36,200) / 2
= $76,200 / 2
= $38,100
```

**Current Year ROA:**
```
= ($5,250 / $38,100) × 100
= 0.1378 × 100
= 13.8%
```

**Prior Year ROA (for comparison):**
```
Average Assets (Year 1-2) = $36,200 (simplified)
= ($4,388 / $36,200) × 100
= 12.1%
```

**Year-over-Year Change:**
```
= 13.8% - 12.1%
= +1.7 percentage points
```

---

### 5. Return on Equity (ROE)

**Formula:** (Net Income / Average Shareholders' Equity) × 100

**Average Shareholders' Equity:**
```
= (Current Year Equity + Prior Year Equity) / 2
= ($22,000 + $19,600) / 2
= $41,600 / 2
= $20,800
```

**Current Year ROE:**
```
= ($5,250 / $20,800) × 100
= 0.2524 × 100
= 25.2%
```

**Prior Year ROE (for comparison):**
```
Average Equity = $19,600 (simplified)
= ($4,388 / $19,600) × 100
= 22.4%
```

**Year-over-Year Change:**
```
= 25.2% - 22.4%
= +2.8 percentage points
```

---

## LIQUIDITY CALCULATIONS

### 1. Current Ratio

**Formula:** Current Assets / Current Liabilities

**Current Year:**
```
= $18,000 / $6,000
= 3.00
```

**Prior Year:**
```
= $16,200 / $5,600
= 2.89
```

**Year-over-Year Change:**
```
= 3.00 - 2.89
= +0.11
= +3.8% improvement
```

---

### 2. Quick Ratio (Acid-Test)

**Formula:** (Current Assets - Inventory) / Current Liabilities

**Current Year:**
```
= ($18,000 - $6,500) / $6,000
= $11,500 / $6,000
= 1.92
```

**Prior Year:**
```
= ($16,200 - $6,000) / $5,600
= $10,200 / $5,600
= 1.82
```

**Year-over-Year Change:**
```
= 1.92 - 1.82
= +0.10
= +5.5% improvement
```

---

### 3. Cash Conversion Cycle (CCC)

**Formula:** DIO + DSO - DPO

#### Days Inventory Outstanding (DIO)

**Average Inventory:**
```
= (Current Year Inventory + Prior Year Inventory) / 2
= ($6,500 + $6,000) / 2
= $12,500 / 2
= $6,250
```

**DIO:**
```
= (Average Inventory / COGS) × 365
= ($6,250 / $32,000) × 365
= 0.1953 × 365
= 71.3 days
```

#### Days Sales Outstanding (DSO)

**Average Accounts Receivable:**
```
= (Current Year A/R + Prior Year A/R) / 2
= ($8,000 + $7,200) / 2
= $15,200 / 2
= $7,600
```

**DSO:**
```
= (Average A/R / Revenue) × 365
= ($7,600 / $50,000) × 365
= 0.152 × 365
= 55.5 days
```

#### Days Payables Outstanding (DPO)

**Average Accounts Payable:**
```
= (Current Year A/P + Prior Year A/P) / 2
= ($4,000 + $3,600) / 2
= $7,600 / 2
= $3,800
```

**DPO:**
```
= (Average A/P / COGS) × 365
= ($3,800 / $32,000) × 365
= 0.1188 × 365
= 43.4 days
```

#### Cash Conversion Cycle

**Current Year CCC:**
```
= DIO + DSO - DPO
= 71.3 + 55.5 - 43.4
= 83.4 days
```

**Prior Year CCC (estimated):**
```
DIO = ($6,000 / $29,250) × 365 = 74.9 days
DSO = ($7,200 / $45,000) × 365 = 58.4 days
DPO = ($3,600 / $29,250) × 365 = 44.9 days
CCC = 74.9 + 58.4 - 44.9 = 88.4 days
```

**Year-over-Year Change:**
```
= 83.4 - 88.4
= -5.0 days (improvement)
= -5.7% improvement
```

---

## EFFICIENCY CALCULATIONS

### 1. Asset Turnover

**Formula:** Revenue / Average Total Assets

**Average Total Assets:**
```
= (Current Year Assets + Prior Year Assets) / 2
= ($40,000 + $36,200) / 2
= $38,100
```

**Current Year:**
```
= $50,000 / $38,100
= 1.31x
```

**Prior Year:**
```
= $45,000 / $36,200
= 1.24x
```

**Year-over-Year Change:**
```
= 1.31 - 1.24
= +0.07x
= +5.6% improvement
```

---

### 2. Inventory Turnover

**Formula:** COGS / Average Inventory

**Average Inventory:**
```
= ($6,500 + $6,000) / 2
= $6,250
```

**Current Year:**
```
= $32,000 / $6,250
= 5.12x
```

**Prior Year:**
```
= $29,250 / $6,000
= 4.88x
```

**Year-over-Year Change:**
```
= 5.12 - 4.88
= +0.24x
= +4.9% improvement
```

**Days to Turn Inventory:**
```
= 365 / 5.12
= 71.3 days
```

---

### 3. Receivables Turnover

**Formula:** Revenue / Average Accounts Receivable

**Average Accounts Receivable:**
```
= ($8,000 + $7,200) / 2
= $7,600
```

**Current Year:**
```
= $50,000 / $7,600
= 6.58x
```

**Prior Year:**
```
= $45,000 / $7,200
= 6.25x
```

**Year-over-Year Change:**
```
= 6.58 - 6.25
= +0.33x
= +5.3% improvement
```

**Days Sales Outstanding:**
```
= 365 / 6.58
= 55.5 days
```

---

## LEVERAGE CALCULATIONS

### 1. Debt-to-Equity Ratio

**Formula:** Total Debt / Shareholders' Equity

**Total Debt:**
```
Current Year:
= Short-term Debt + Long-term Debt
= $2,000 + $12,000
= $14,000

Prior Year:
= $2,000 + $11,000
= $13,000
```

**Current Year:**
```
= $14,000 / $22,000
= 0.64
```

**Prior Year:**
```
= $13,000 / $19,600
= 0.66
```

**Year-over-Year Change:**
```
= 0.64 - 0.66
= -0.02 (improvement)
= -3.0% improvement
```

---

### 2. Interest Coverage Ratio

**Formula:** EBIT / Interest Expense

**Current Year:**
```
= $8,000 / $1,000
= 8.0x
```

**Prior Year:**
```
= $6,750 / $900
= 7.5x
```

**Year-over-Year Change:**
```
= 8.0 - 7.5
= +0.5x
= +6.7% improvement
```

---

## SUMMARY DASHBOARD

### Quick Reference Table

| Metric | Formula | Current | Prior | Change | Status |
|--------|---------|---------|-------|--------|--------|
| **PROFITABILITY** |
| Gross Margin | GP/Rev × 100 | 36.0% | 35.0% | +1.0pp | ✅ |
| Operating Margin | EBIT/Rev × 100 | 16.0% | 15.0% | +1.0pp | ✅ |
| Net Margin | NI/Rev × 100 | 10.5% | 9.75% | +0.75pp | ✅ |
| ROA | NI/Avg Assets × 100 | 13.8% | 12.1% | +1.7pp | ✅ |
| ROE | NI/Avg Equity × 100 | 25.2% | 22.4% | +2.8pp | ✅ |
| **LIQUIDITY** |
| Current Ratio | CA/CL | 3.00 | 2.89 | +0.11 | ✅ |
| Quick Ratio | (CA-Inv)/CL | 1.92 | 1.82 | +0.10 | ✅ |
| Cash Conv Cycle | DIO+DSO-DPO | 83.4d | 88.4d | -5.0d | ✅ |
| **EFFICIENCY** |
| Asset Turnover | Rev/Avg Assets | 1.31x | 1.24x | +0.07x | ✅ |
| Inventory Turnover | COGS/Avg Inv | 5.12x | 4.88x | +0.24x | ✅ |
| Receivables Turnover | Rev/Avg AR | 6.58x | 6.25x | +0.33x | ✅ |
| **LEVERAGE** |
| Debt-to-Equity | Total Debt/Equity | 0.64 | 0.66 | -0.02 | ✅ |
| Interest Coverage | EBIT/Interest | 8.0x | 7.5x | +0.5x | ✅ |

---

### Growth Metrics

| Metric | Calculation | Result |
|--------|-------------|--------|
| Revenue Growth | ($50,000 - $45,000) / $45,000 × 100 | 11.1% |
| Net Income Growth | ($5,250 - $4,388) / $4,388 × 100 | 19.6% |
| Asset Growth | ($40,000 - $36,200) / $36,200 × 100 | 10.5% |
| Equity Growth | ($22,000 - $19,600) / $19,600 × 100 | 12.2% |

---

### Working Capital Analysis

| Component | Current Year | Prior Year | Change |
|-----------|-------------|------------|--------|
| Current Assets | $18,000 | $16,200 | +$1,800 |
| Current Liabilities | $6,000 | $5,600 | +$400 |
| **Working Capital** | **$12,000** | **$10,600** | **+$1,400** |
| WC as % of Revenue | 24.0% | 23.6% | +0.4pp |

**Working Capital Calculation:**
```
Current Year: $18,000 - $6,000 = $12,000
Prior Year: $16,200 - $5,600 = $10,600
Change: $12,000 - $10,600 = +$1,400 (+13.2%)
```

---

### Capital Structure Analysis

| Component | Current Year | Prior Year | % of Total |
|-----------|-------------|------------|------------|
| Short-term Debt | $2,000 | $2,000 | 5.0% |
| Long-term Debt | $12,000 | $11,000 | 30.0% |
| **Total Debt** | **$14,000** | **$13,000** | **35.0%** |
| Shareholders' Equity | $22,000 | $19,600 | 55.0% |
| **Total Capital** | **$36,000** | **$32,600** | **90.0%** |

**Debt as % of Total Capital:**
```
Current Year: $14,000 / $36,000 = 38.9%
Prior Year: $13,000 / $32,600 = 39.9%
```

---

### Profitability Decomposition (DuPont Analysis)

**ROE = Net Margin × Asset Turnover × Equity Multiplier**

**Current Year:**
```
Net Margin = 10.5%
Asset Turnover = 1.31x
Equity Multiplier = Total Assets / Equity = $40,000 / $22,000 = 1.82

ROE = 10.5% × 1.31 × 1.82
ROE = 25.0% (approximately 25.2% due to rounding)
```

**Prior Year:**
```
Net Margin = 9.75%
Asset Turnover = 1.24x
Equity Multiplier = $36,200 / $19,600 = 1.85

ROE = 9.75% × 1.24 × 1.85
ROE = 22.4%
```

**Analysis:**
- ROE improvement driven primarily by higher net margin (+7.7%)
- Asset turnover improvement contributed (+5.6%)
- Slightly lower leverage (equity multiplier decreased)

---

### Cash Flow Implications

**Operating Cash Flow (Estimated from Working Capital Changes):**

| Item | Amount | Note |
|------|--------|------|
| Net Income | $5,250 | Starting point |
| Increase in A/R | -$800 | Use of cash |
| Increase in Inventory | -$500 | Use of cash |
| Increase in A/P | +$400 | Source of cash |
| **Change in WC** | **-$900** | **Net use** |
| **Est. Operating CF** | **~$4,350** | **Before D&A** |

**Free Cash Flow Estimate:**
```
Operating Cash Flow: ~$4,350
Less: CapEx (estimated): ~$2,000
Free Cash Flow: ~$2,350
```

---

### Key Performance Indicators (KPIs)

| KPI | Target | Actual | Status |
|-----|--------|--------|--------|
| Revenue Growth | >10% | 11.1% | ✅ |
| Net Margin | >10% | 10.5% | ✅ |
| ROE | >20% | 25.2% | ✅ |
| Current Ratio | >2.0 | 3.00 | ✅ |
| D/E Ratio | <1.0 | 0.64 | ✅ |
| Interest Coverage | >5.0x | 8.0x | ✅ |
| Asset Turnover | >1.2x | 1.31x | ✅ |
| CCC | <90 days | 83.4d | ✅ |

**Overall KPI Achievement: 8/8 (100%)**

---

## CALCULATION NOTES

### Assumptions:
1. All figures in thousands ($000s) unless otherwise noted
2. Averages calculated using simple two-period average
3. 365 days used for all turnover calculations
4. Tax rate approximately 25% based on tax expense / pre-tax income

### Formulas Used:
- **Percentage Change:** (New - Old) / Old × 100
- **Percentage Point Change:** New% - Old%
- **Average:** (Current + Prior) / 2
- **Days:** (Balance / Annual Flow) × 365
- **Turnover:** Annual Flow / Average Balance

### Data Quality:
- All source data validated and cross-checked
- Balance sheet balances (Assets = Liabilities + Equity)
- Income statement flows logically from revenue to net income
- No material discrepancies identified

---

**Worksheet Prepared:** [Current Date]  
**Last Updated:** [Current Date]  
**Version:** 1.0
