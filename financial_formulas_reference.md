# Financial Analysis Formulas - Quick Reference Guide

## Overview
This document provides a comprehensive reference for all financial formulas used in the Acme Corp analysis, including calculation methods, interpretations, and industry benchmarks.

---

## TABLE OF CONTENTS
1. [Profitability Metrics](#profitability-metrics)
2. [Liquidity Metrics](#liquidity-metrics)
3. [Efficiency Metrics](#efficiency-metrics)
4. [Leverage Metrics](#leverage-metrics)
5. [Supporting Calculations](#supporting-calculations)
6. [Advanced Analysis](#advanced-analysis)

---

## PROFITABILITY METRICS

### 1. Gross Margin

**Formula:**
```
Gross Margin (%) = (Gross Profit / Revenue) × 100
```

**Alternative Formula:**
```
Gross Margin (%) = ((Revenue - COGS) / Revenue) × 100
```

**Components:**
- Gross Profit = Revenue - Cost of Goods Sold (COGS)
- Revenue = Total sales revenue
- COGS = Direct costs of producing goods/services

**Interpretation:**
- Measures the percentage of revenue retained after direct production costs
- Higher is better (more revenue available for operating expenses and profit)
- Shows pricing power and production efficiency

**Industry Benchmarks:**
- Retail: 25-35%
- Manufacturing: 30-40%
- Software/Tech: 60-80%
- Services: 40-60%

**Acme Corp Example:**
```
Revenue: $50,000
COGS: $32,000
Gross Profit: $18,000

Gross Margin = ($18,000 / $50,000) × 100 = 36.0%
```

---

### 2. Operating Margin

**Formula:**
```
Operating Margin (%) = (Operating Income / Revenue) × 100
```

**Alternative Formula:**
```
Operating Margin (%) = (EBIT / Revenue) × 100
```

**Components:**
- Operating Income (EBIT) = Gross Profit - Operating Expenses
- Operating Expenses = SG&A, R&D, depreciation, etc.
- Excludes interest and taxes

**Interpretation:**
- Measures profitability from core operations
- Shows operational efficiency and cost control
- Higher is better

**Industry Benchmarks:**
- Retail: 5-10%
- Manufacturing: 10-15%
- Software/Tech: 20-30%
- Services: 15-20%

**Acme Corp Example:**
```
Operating Income (EBIT): $8,000
Revenue: $50,000

Operating Margin = ($8,000 / $50,000) × 100 = 16.0%
```

---

### 3. Net Margin (Net Profit Margin)

**Formula:**
```
Net Margin (%) = (Net Income / Revenue) × 100
```

**Components:**
- Net Income = Revenue - All Expenses (including interest and taxes)
- Also called "bottom line" or "net profit"

**Interpretation:**
- Measures overall profitability after all expenses
- Shows how much profit is generated per dollar of sales
- Most comprehensive profitability measure

**Industry Benchmarks:**
- Retail: 2-5%
- Manufacturing: 8-12%
- Software/Tech: 15-25%
- Services: 10-15%

**Acme Corp Example:**
```
Net Income: $5,250
Revenue: $50,000

Net Margin = ($5,250 / $50,000) × 100 = 10.5%
```

---

### 4. Return on Assets (ROA)

**Formula:**
```
ROA (%) = (Net Income / Average Total Assets) × 100
```

**Average Total Assets Calculation:**
```
Average Total Assets = (Beginning Assets + Ending Assets) / 2
```

**Interpretation:**
- Measures how efficiently assets generate profit
- Shows management's ability to use assets productively
- Higher is better

**Industry Benchmarks:**
- Capital-intensive: 3-8%
- Manufacturing: 8-15%
- Asset-light services: 15-25%
- Financial services: 1-2%

**Acme Corp Example:**
```
Net Income: $5,250
Beginning Assets: $36,200
Ending Assets: $40,000
Average Assets: ($36,200 + $40,000) / 2 = $38,100

ROA = ($5,250 / $38,100) × 100 = 13.8%
```

---

### 5. Return on Equity (ROE)

**Formula:**
```
ROE (%) = (Net Income / Average Shareholders' Equity) × 100
```

**Average Equity Calculation:**
```
Average Equity = (Beginning Equity + Ending Equity) / 2
```

**Interpretation:**
- Measures return generated on shareholders' investment
- Key metric for investors
- Higher is better (but consider leverage)

**Industry Benchmarks:**
- Retail: 10-15%
- Manufacturing: 15-20%
- Software/Tech: 20-30%
- Financial services: 10-15%

**Quality Check:**
- High ROE with low debt = Excellent
- High ROE with high debt = Risky
- Compare ROE to cost of equity

**Acme Corp Example:**
```
Net Income: $5,250
Beginning Equity: $19,600
Ending Equity: $22,000
Average Equity: ($19,600 + $22,000) / 2 = $20,800

ROE = ($5,250 / $20,800) × 100 = 25.2%
```

---

## LIQUIDITY METRICS

### 1. Current Ratio

**Formula:**
```
Current Ratio = Current Assets / Current Liabilities
```

**Components:**
- Current Assets = Cash, receivables, inventory, other assets due within 1 year
- Current Liabilities = Obligations due within 1 year

**Interpretation:**
- Measures ability to pay short-term obligations
- Ratio > 1.0 means more current assets than liabilities
- Too high may indicate inefficient use of assets

**Industry Benchmarks:**
- Manufacturing: 1.5-2.5
- Retail: 1.2-2.0
- Services: 1.5-3.0
- Technology: 2.0-3.5

**Rules of Thumb:**
- < 1.0: Potential liquidity problems
- 1.0-2.0: Generally healthy
- 2.0-3.0: Strong liquidity
- > 3.0: Possibly excess working capital

**Acme Corp Example:**
```
Current Assets: $18,000
Current Liabilities: $6,000

Current Ratio = $18,000 / $6,000 = 3.00
```

---

### 2. Quick Ratio (Acid-Test Ratio)

**Formula:**
```
Quick Ratio = (Current Assets - Inventory) / Current Liabilities
```

**Alternative Formula:**
```
Quick Ratio = (Cash + Marketable Securities + Accounts Receivable) / Current Liabilities
```

**Interpretation:**
- More conservative than current ratio
- Excludes inventory (least liquid current asset)
- Measures immediate liquidity

**Industry Benchmarks:**
- Manufacturing: 0.8-1.5
- Retail: 0.5-1.0
- Services: 1.0-2.0
- Technology: 1.5-2.5

**Rules of Thumb:**
- < 0.5: Liquidity concerns
- 0.5-1.0: Adequate
- 1.0-1.5: Strong
- > 1.5: Very strong

**Acme Corp Example:**
```
Current Assets: $18,000
Inventory: $6,500
Current Liabilities: $6,000

Quick Ratio = ($18,000 - $6,500) / $6,000 = 1.92
```

---

### 3. Cash Conversion Cycle (CCC)

**Formula:**
```
CCC = Days Inventory Outstanding (DIO) + Days Sales Outstanding (DSO) - Days Payables Outstanding (DPO)
```

**Component Formulas:**

**Days Inventory Outstanding (DIO):**
```
DIO = (Average Inventory / COGS) × 365
```

**Days Sales Outstanding (DSO):**
```
DSO = (Average Accounts Receivable / Revenue) × 365
```

**Days Payables Outstanding (DPO):**
```
DPO = (Average Accounts Payable / COGS) × 365
```

**Interpretation:**
- Measures how long cash is tied up in operations
- Lower is better (faster cash conversion)
- Negative CCC means company collects before paying (ideal)

**Industry Benchmarks:**
- Manufacturing: 60-90 days
- Retail: 30-60 days
- Services: 40-70 days
- Technology: 50-80 days

**Acme Corp Example:**
```
Average Inventory: $6,250
Average A/R: $7,600
Average A/P: $3,800
COGS: $32,000
Revenue: $50,000

DIO = ($6,250 / $32,000) × 365 = 71.3 days
DSO = ($7,600 / $50,000) × 365 = 55.5 days
DPO = ($3,800 / $32,000) × 365 = 43.4 days

CCC = 71.3 + 55.5 - 43.4 = 83.4 days
```

---

## EFFICIENCY METRICS

### 1. Asset Turnover

**Formula:**
```
Asset Turnover = Revenue / Average Total Assets
```

**Alternative Expression:**
```
Asset Turnover (times per year) = Annual Revenue / Average Total Assets
```

**Interpretation:**
- Measures how efficiently assets generate revenue
- Shows how many dollars of revenue per dollar of assets
- Higher is better (more revenue per asset dollar)

**Industry Benchmarks:**
- Capital-intensive: 0.5-1.0x
- Manufacturing: 1.0-2.0x
- Retail: 2.0-3.0x
- Services: 1.5-2.5x

**Acme Corp Example:**
```
Revenue: $50,000
Average Total Assets: $38,100

Asset Turnover = $50,000 / $38,100 = 1.31x
```

---

### 2. Inventory Turnover

**Formula:**
```
Inventory Turnover = COGS / Average Inventory
```

**Alternative Formula:**
```
Inventory Turnover = Revenue / Average Inventory (less common)
```

**Days Inventory Outstanding (DIO):**
```
DIO = 365 / Inventory Turnover
or
DIO = (Average Inventory / COGS) × 365
```

**Interpretation:**
- Measures how quickly inventory is sold and replaced
- Higher is better (faster turnover, less holding cost)
- Too high may indicate stock-out risk

**Industry Benchmarks:**
- Grocery: 10-20x
- Manufacturing: 4-8x
- Electronics: 6-10x
- Furniture: 3-5x

**Acme Corp Example:**
```
COGS: $32,000
Average Inventory: $6,250

Inventory Turnover = $32,000 / $6,250 = 5.12x

DIO = 365 / 5.12 = 71.3 days
```

---

### 3. Receivables Turnover

**Formula:**
```
Receivables Turnover = Revenue / Average Accounts Receivable
```

**Days Sales Outstanding (DSO):**
```
DSO = 365 / Receivables Turnover
or
DSO = (Average Accounts Receivable / Revenue) × 365
```

**Interpretation:**
- Measures how quickly receivables are collected
- Higher is better (faster collection)
- Compare to payment terms (e.g., net 30)

**Industry Benchmarks:**
- Retail (cash): 50-100x
- Manufacturing: 6-12x
- Services: 8-15x
- B2B: 6-10x

**Rules of Thumb:**
- DSO should be close to payment terms
- DSO > payment terms indicates collection problems
- Increasing DSO is a warning sign

**Acme Corp Example:**
```
Revenue: $50,000
Average A/R: $7,600

Receivables Turnover = $50,000 / $7,600 = 6.58x

DSO = 365 / 6.58 = 55.5 days
```

---

## LEVERAGE METRICS

### 1. Debt-to-Equity Ratio

**Formula:**
```
Debt-to-Equity = Total Debt / Shareholders' Equity
```

**Total Debt Calculation:**
```
Total Debt = Short-term Debt + Long-term Debt
(Sometimes includes all interest-bearing liabilities)
```

**Interpretation:**
- Measures financial leverage
- Shows how much debt per dollar of equity
- Higher means more leverage (riskier but potentially higher returns)

**Industry Benchmarks:**
- Utilities: 1.0-2.0
- Manufacturing: 0.5-1.5
- Technology: 0.0-0.5
- Financial services: 5.0-10.0+

**Rules of Thumb:**
- < 0.5: Conservative, low leverage
- 0.5-1.0: Moderate, healthy leverage
- 1.0-2.0: Aggressive leverage
- > 2.0: High risk (except financials)

**Acme Corp Example:**
```
Short-term Debt: $2,000
Long-term Debt: $12,000
Total Debt: $14,000
Shareholders' Equity: $22,000

D/E = $14,000 / $22,000 = 0.64
```

---

### 2. Interest Coverage Ratio

**Formula:**
```
Interest Coverage = EBIT / Interest Expense
```

**Alternative Names:**
- Times Interest Earned (TIE)
- Interest Coverage Ratio

**Interpretation:**
- Measures ability to pay interest
- Shows how many times operating income covers interest
- Higher is better (more safety margin)

**Industry Benchmarks:**
- Minimum acceptable: 2.0-3.0x
- Healthy: 5.0x+
- Strong: 8.0x+
- Very strong: 10.0x+

**Rules of Thumb:**
- < 1.5x: High risk of default
- 1.5-2.5x: Marginal coverage
- 2.5-5.0x: Adequate coverage
- > 5.0x: Strong coverage

**Acme Corp Example:**
```
EBIT: $8,000
Interest Expense: $1,000

Interest Coverage = $8,000 / $1,000 = 8.0x
```

---

### 3. Debt Ratio

**Formula:**
```
Debt Ratio = Total Debt / Total Assets
```

**Alternative Formula:**
```
Debt Ratio = Total Liabilities / Total Assets
```

**Interpretation:**
- Shows percentage of assets financed by debt
- Lower is generally better (less leverage)
- Complement: Equity Ratio = 1 - Debt Ratio

**Industry Benchmarks:**
- Technology: 10-30%
- Manufacturing: 30-50%
- Utilities: 50-70%
- Financial services: 80-90%+

**Acme Corp Example:**
```
Total Debt: $14,000
Total Assets: $40,000

Debt Ratio = $14,000 / $40,000 = 0.35 or 35%
```

---

## SUPPORTING CALCULATIONS

### 1. Average Balance Calculation

**Formula:**
```
Average Balance = (Beginning Balance + Ending Balance) / 2
```

**When to Use:**
- For flow-to-stock ratios (e.g., ROA, ROE)
- When comparing income statement (period) to balance sheet (point-in-time)
- For turnover calculations

**Example:**
```
Beginning Inventory: $6,000
Ending Inventory: $6,500
Average Inventory = ($6,000 + $6,500) / 2 = $6,250
```

---

### 2. Percentage Change

**Formula:**
```
Percentage Change = ((New Value - Old Value) / Old Value) × 100
```

**Example:**
```
Prior Year Revenue: $45,000
Current Year Revenue: $50,000

Change = (($50,000 - $45,000) / $45,000) × 100
       = ($5,000 / $45,000) × 100
       = 11.1%
```

---

### 3. Percentage Point Change

**Formula:**
```
Percentage Point Change = New Percentage - Old Percentage
```

**Note:** Different from percentage change!

**Example:**
```
Prior Year Net Margin: 9.75%
Current Year Net Margin: 10.5%

Percentage Point Change = 10.5% - 9.75% = 0.75 pp

(NOT 7.7% which would be percentage change)
```

---

### 4. Working Capital

**Formula:**
```
Working Capital = Current Assets - Current Liabilities
```

**Working Capital Ratio:**
```
WC Ratio = Working Capital / Revenue
```

**Acme Corp Example:**
```
Current Assets: $18,000
Current Liabilities: $6,000

Working Capital = $18,000 - $6,000 = $12,000

WC Ratio = $12,000 / $50,000 = 24%
```

---

## ADVANCED ANALYSIS

### 1. DuPont Analysis (3-Factor)

**Formula:**
```
ROE = Net Margin × Asset Turnover × Equity Multiplier
```

**Components:**
```
Net Margin = Net Income / Revenue
Asset Turnover = Revenue / Average Assets
Equity Multiplier = Average Assets / Average Equity
```

**Interpretation:**
- Breaks ROE into three components
- Identifies drivers of profitability
- Shows impact of leverage

**Acme Corp Example:**
```
Net Margin = 10.5%
Asset Turnover = 1.31x
Equity Multiplier = $38,100 / $20,800 = 1.82

ROE = 10.5% × 1.31 × 1.82 = 25.0%
(Slight difference due to rounding)
```

---

### 2. DuPont Analysis (5-Factor)

**Formula:**
```
ROE = (Net Income/EBT) × (EBT/EBIT) × (EBIT/Revenue) × (Revenue/Assets) × (Assets/Equity)
```

**Components:**
- Tax Burden = Net Income / EBT
- Interest Burden = EBT / EBIT
- Operating Margin = EBIT / Revenue
- Asset Turnover = Revenue / Assets
- Equity Multiplier = Assets / Equity

---

### 3. Sustainable Growth Rate

**Formula:**
```
Sustainable Growth Rate = ROE × (1 - Dividend Payout Ratio)
```

**Alternative:**
```
SGR = (Net Income - Dividends) / Equity
```

**Interpretation:**
- Maximum growth rate without external financing
- Assumes constant leverage and profitability
- Growth above SGR requires external capital

**Acme Corp Example (assuming 30% payout):**
```
ROE = 25.2%
Payout Ratio = 30%
Retention Ratio = 70%

SGR = 25.2% × 0.70 = 17.6%
```

---

### 4. Free Cash Flow (Simplified)

**Formula:**
```
Free Cash Flow = Operating Cash Flow - Capital Expenditures
```

**Operating Cash Flow (Estimated):**
```
OCF ≈ Net Income + Depreciation - Change in Working Capital
```

**Acme Corp Estimate:**
```
Net Income: $5,250
Change in WC: -$900 (use of cash)
Estimated OCF: ~$4,350 (before D&A)
Less: CapEx (est.): ~$2,000
Free Cash Flow: ~$2,350
```

---

### 5. Economic Value Added (EVA)

**Formula:**
```
EVA = NOPAT - (Capital × WACC)
```

**Where:**
- NOPAT = Net Operating Profit After Tax
- Capital = Debt + Equity
- WACC = Weighted Average Cost of Capital

**Interpretation:**
- Measures value creation above cost of capital
- Positive EVA = Creating value
- Negative EVA = Destroying value

---

## FORMULA SUMMARY TABLE

| Category | Metric | Formula | Acme Corp | Benchmark |
|----------|--------|---------|-----------|-----------|
| **Profitability** | | | | |
| | Gross Margin | (GP / Rev) × 100 | 36.0% | 32-38% |
| | Operating Margin | (EBIT / Rev) × 100 | 16.0% | 12-18% |
| | Net Margin | (NI / Rev) × 100 | 10.5% | 8-12% |
| | ROA | (NI / Avg Assets) × 100 | 13.8% | 8-15% |
| | ROE | (NI / Avg Equity) × 100 | 25.2% | 15-20% |
| **Liquidity** | | | | |
| | Current Ratio | CA / CL | 3.00 | 1.5-3.0 |
| | Quick Ratio | (CA - Inv) / CL | 1.92 | 1.0-1.5 |
| | CCC | DIO + DSO - DPO | 83.4d | 60-90d |
| **Efficiency** | | | | |
| | Asset Turnover | Rev / Avg Assets | 1.31x | 0.8-2.0x |
| | Inventory Turnover | COGS / Avg Inv | 5.12x | 4-8x |
| | Receivables Turnover | Rev / Avg AR | 6.58x | 6-12x |
| **Leverage** | | | | |
| | Debt-to-Equity | Total Debt / Equity | 0.64 | 0.5-1.5 |
| | Interest Coverage | EBIT / Interest | 8.0x | 5.0x+ |

---

## COMMON PITFALLS & TIPS

### 1. Using Averages
**Pitfall:** Using ending balances instead of averages for flow-to-stock ratios
**Tip:** Always use average balances when comparing income statement (flow) to balance sheet (stock)

### 2. COGS vs. Revenue
**Pitfall:** Using revenue instead of COGS for inventory turnover and DPO
**Tip:** 
- Inventory Turnover = COGS / Avg Inventory (correct)
- DPO = (Avg AP / COGS) × 365 (correct)

### 3. Percentage vs. Percentage Points
**Pitfall:** Confusing percentage change with percentage point change
**Tip:**
- Percentage change: ((New - Old) / Old) × 100
- Percentage point change: New% - Old%

### 4. Consistency
**Pitfall:** Mixing methodologies or time periods
**Tip:** Use consistent formulas and time periods across all calculations

### 5. Industry Context
**Pitfall:** Applying universal benchmarks without industry context
**Tip:** Always adjust benchmarks for specific industry, size, and business model

---

## INTERPRETATION GUIDE

### Trend Analysis
- **Improving:** Metric moving in favorable direction
- **Stable:** Metric relatively unchanged (±2%)
- **Declining:** Metric moving in unfavorable direction

### Benchmark Comparison
- **Exceeds:** Above industry benchmark
- **Meets:** Within industry range
- **Below:** Under industry benchmark

### Combined Analysis
Always analyze metrics in combination:
- High ROE + Low Leverage = Quality earnings
- High ROE + High Leverage = Risky
- High Current Ratio + Low Turnover = Inefficiency
- Low D/E + High Coverage = Conservative, safe

---

## QUICK REFERENCE: WHAT'S GOOD?

### Higher is Better:
✅ Gross Margin  
✅ Operating Margin  
✅ Net Margin  
✅ ROA  
✅ ROE  
✅ Current Ratio (but not too high)  
✅ Quick Ratio (but not too high)  
✅ Asset Turnover  
✅ Inventory Turnover  
✅ Receivables Turnover  
✅ Interest Coverage  

### Lower is Better:
✅ Debt-to-Equity (generally)  
✅ Cash Conversion Cycle  
✅ Days Inventory Outstanding  
✅ Days Sales Outstanding  
✅ Debt Ratio  

### Optimal Range:
⚖️ Current Ratio: 1.5-3.0  
⚖️ Quick Ratio: 1.0-1.5  
⚖️ D/E Ratio: 0.5-1.5 (industry dependent)  

---

**Document Version:** 1.0  
**Last Updated:** [Current Date]  
**Purpose:** Financial analysis reference and training material

---

*This reference guide provides standard financial formulas and interpretations. Always consider industry-specific factors and company-specific circumstances when applying these formulas.*
