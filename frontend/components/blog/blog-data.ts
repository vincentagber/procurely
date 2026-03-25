export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  date: string;
  readTime: string;
  coverColor: string;
  coverEmoji: string;
  tags: string[];
  body: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-read-a-boq",
    title: "How to Read a Bill of Quantities (BOQ) Like a Pro",
    excerpt:
      "A BOQ is the backbone of every construction project. Learn how to break down line items, negotiate costs, and avoid the most common procurement pitfalls.",
    category: "Procurement Guide",
    author: "Chidi Okonkwo",
    authorRole: "Procurement Specialist",
    authorAvatar: "CO",
    date: "March 20, 2026",
    readTime: "6 min read",
    coverColor: "#1900ff",
    coverEmoji: "📋",
    tags: ["BOQ", "Procurement", "Construction", "Guide"],
    body: `
## What Is a Bill of Quantities?

A **Bill of Quantities (BOQ)** is a detailed document used in the construction industry to itemize all the materials, labor, and services required to complete a project. It serves as a common baseline for contractors to price their bids accurately.

## Why It Matters

Without a proper BOQ, procurement becomes chaotic. You risk:
- **Overpaying** for materials due to unclear specifications
- **Disputes** between contractors and clients over scope
- **Project delays** from last-minute material orders

## How to Read a BOQ

Every good BOQ has five core columns:

| Column | Description |
|--------|-------------|
| Item No. | Sequential numbering of each trade item |
| Description | Detailed spec of the work or material |
| Unit | Measurement unit (m², m³, kg, nr) |
| Quantity | Volume required |
| Rate & Amount | Unit price and total cost |

## Pro Tips

1. **Always cross-check quantities** against the architectural drawings before submitting to suppliers.
2. **Break it by trade** — separate civil, mechanical, and electrical works to get targeted quotes.
3. **Include wastage factors** — add 5–10% for consumables like sand, cement, and rebar.
4. **Use Procurely's BOQ submission portal** to get competitive quotes from verified suppliers across Lagos in under 48 hours.

## Conclusion

Reading a BOQ isn't just a technical skill — it's a financial superpower that protects your project budget. Submit yours today on Procurely and let our team source the best rates.
    `.trim(),
  },
  {
    slug: "rebar-buying-guide-nigeria",
    title: "The Developer's Guide to Buying Rebar in Nigeria",
    excerpt:
      "Steel prices fluctuate constantly. Here's how to time your purchases, identify quality rebar, and avoid counterfeit products flooding the Lagos market.",
    category: "Material Guide",
    author: "Amaka Eze",
    authorRole: "Structural Engineer",
    authorAvatar: "AE",
    date: "March 15, 2026",
    readTime: "8 min read",
    coverColor: "#13184f",
    coverEmoji: "🔩",
    tags: ["Rebar", "Steel", "Nigeria", "Quality Control"],
    body: `
## Why Rebar Quality Matters

Rebar (reinforcing bar) is the skeleton of every reinforced concrete structure. Substandard rebar is one of the leading causes of building collapses in Nigeria — a risk no developer should ever take.

## How to Identify Grade-A Rebar

Look for these markers when inspecting a delivery:

- **CARES or local NAFDAC certification stamps** on each bar
- **Consistent ribbing pattern** — irregular ribs indicate poor mill control
- **Mill test certificate** from the manufacturer should accompany every batch
- **Weight check** — Y12 rebar should weigh approximately 0.889 kg per meter

## Common Counterfeits in the Market

Some suppliers in Lagos Eko bridge market sell **imported scrap rebar** recast locally without proper alloy composition. These bars fail under tensile stress before reaching design load.

### Red flags:
- Price significantly below market rate (>15%)
- No mill certificate offered
- Seller reluctant to allow independent testing

## Timing Your Purchase

Steel prices in Nigeria are tied to:
1. **USS (US Steel) international spot price**
2. **USD/NGN exchange rate**
3. **NAFDAC import cycles**

Best months to buy: **January–February** and **August–September**, when shipping cycles create temporary oversupply.

## Order Through Procurely

Procurely only works with **CARES-certified steel merchants**. Every rebar order includes:
- Full mill certificate
- Batch-level quality report
- Free delivery within Lagos Island and Mainland

Submit your quantity estimate and we'll get you three competitive quotes within 24 hours.
    `.trim(),
  },
  {
    slug: "cement-brands-comparison-2026",
    title: "Cement Brands in Nigeria: A 2026 Comparison",
    excerpt:
      "Dangote, BUA, Lafarge, or Ibeto? We break down the strengths of each brand, their best use cases, and current market pricing across Lagos.",
    category: "Product Review",
    author: "Emeka Nwachukwu",
    authorRole: "Civil Engineer",
    authorAvatar: "EN",
    date: "March 10, 2026",
    readTime: "7 min read",
    coverColor: "#e65432",
    coverEmoji: "🏗️",
    tags: ["Cement", "Brands", "Nigeria", "2026", "Comparison"],
    body: `
## The Major Players

Nigeria's cement market is dominated by four primary brands. Here's our independent assessment:

### 1. Dangote Cement ⭐⭐⭐⭐⭐
- **Best for:** Structural concrete (columns, slabs, beams)
- **Strength Class:** 42.5R (high early strength)
- **Price (Mar 2026):** ₦8,200/bag
- **Notes:** Most consistent batch-to-batch quality; preferred by top contractors

### 2. BUA Cement ⭐⭐⭐⭐
- **Best for:** Block moulding and plastering
- **Strength Class:** 32.5N
- **Price (Mar 2026):** ₦7,600/bag
- **Notes:** Excellent value for money; slightly slower cure time

### 3. Lafarge (Ashaka) ⭐⭐⭐⭐
- **Best for:** Decorative finishes, tile adhesive mortar
- **Strength Class:** 32.5R
- **Price (Mar 2026):** ₦8,000/bag
- **Notes:** Very consistent fineness; great workability

### 4. Ibeto Cement ⭐⭐⭐
- **Best for:** Mass concrete pours, substructure
- **Strength Class:** 32.5N
- **Price (Mar 2026):** ₦7,200/bag
- **Notes:** Good price point; availability can be spotty outside Abuja corridor

## Our Recommendation

For a **foundation + frame** combination: Use **Dangote 42.5R** for structural elements and **BUA 32.5N** for blocks and mortar. This combination balances strength and cost-efficiency.

## Order in Bulk on Procurely

Ordering 100+ bags on Procurely unlocks **bulk pricing discounts** up to 12% off retail rates. Submit a BOQ and we'll source from the nearest certified depot to your site.
    `.trim(),
  },
  {
    slug: "how-procurement-saves-project-cost",
    title: "How Smart Procurement Can Cut Your Build Cost by 20%",
    excerpt:
      "Most developers overspend on materials not because prices are high — but because procurement is reactive. Here's a proven framework to reverse that.",
    category: "Cost Management",
    author: "Funmilayo Adeyemi",
    authorRole: "Project Manager",
    authorAvatar: "FA",
    date: "March 5, 2026",
    readTime: "5 min read",
    coverColor: "#0b874b",
    coverEmoji: "💰",
    tags: ["Cost Control", "Procurement", "Project Management", "Tips"],
    body: `
## The Reactive Procurement Problem

Most building projects in Nigeria follow the same pattern:

1. Foundation pours → **crisis order** of concrete
2. Roofing week → **emergency run** to the hardware store
3. Finishing stage → **overpaying** because the carpenter "knows a guy"

This reactive model typically inflates material costs by **15–25%** above market rates, purely due to urgency premiums and missed bulk pricing windows.

## The Procurely Framework

Here's how organized developers save money:

### Step 1: Pre-Project BOQ
Before ground-breaking, prepare a complete BOQ broken into five phases:
- Substructure (earthworks through DPC)
- Superstructure (columns, beams, slabs)
- Roofing and external envelope
- Internal finishes
- MEP (mechanical, electrical, plumbing)

### Step 2: Batch Your Orders
Group purchases into **three or four large orders** instead of twenty small ones. Bulk orders unlock:
- Tiered quantity discounts (5–12%)
- Free delivery in Lagos
- Priority scheduling from suppliers

### Step 3: Lock In Prices Early
For steel and cement — which fluctuate with foreign exchange — use Procurely's **price-lock option** to hold quoted rates for up to 21 days while your project billing clears.

### Step 4: Track and Audit
Use Procurely's dashboard to monitor every order, receipt, and delivery confirmation. Compare actual vs. budgeted quantities monthly and adjust future orders accordingly.

## Real Numbers

A typical 5-bedroom duplex in Lagos with a ₦85M material budget can save:
- ₦4.5M from bulk discounts
- ₦2.1M from eliminated urgency premiums  
- ₦1.2M from avoided wastage

**Total: ₦7.8M saved** (~9% of budget)

Submit your project plan to Procurely and let our team build a custom procurement schedule.
    `.trim(),
  },
  {
    slug: "sharp-sand-vs-plaster-sand",
    title: "Sharp Sand vs Plaster Sand: What Every Builder Must Know",
    excerpt:
      "Using the wrong sand type can ruin a wall finish or cause a structural failure. Here's the definitive breakdown of Nigeria's most misused building materials.",
    category: "Material Guide",
    author: "Chidi Okonkwo",
    authorRole: "Procurement Specialist",
    authorAvatar: "CO",
    date: "February 28, 2026",
    readTime: "5 min read",
    coverColor: "#c68f2b",
    coverEmoji: "🪨",
    tags: ["Sand", "Sharp Sand", "Plaster Sand", "Materials"],
    body: `
## The Confusion That Costs Builders Millions

Walk through any hardware market in Lagos and you'll see "fine sand" and "sharp sand" labeled inconsistently across suppliers. In reality, **not all sands are equal**, and using the wrong type for the wrong application can cause:

- **Cracked wall plaster** that peels within 6 months
- **Weak concrete** that fails compressive strength tests
- **Poor mortar bond** in block laying

## The Key Differences

| Property | Sharp Sand | Plaster Sand |
|----------|-----------|-------------|
| Particle size | 0.5mm – 2.0mm | 0.063mm – 0.5mm |
| Texture | Angular, coarse | Fine, smooth |
| Primary use | Concrete, block mortar | Rendering, plaster |
| Water demand | Lower | Higher |

## When to Use Each

### Use Sharp Sand for:
- Concrete mixes (structural slabs, columns, footings)
- Block-laying mortar (1:6 mix)
- Screed floors (1:4 cement:sand)

### Use Plaster Sand for:
- External rendering
- Internal wall plaster coats
- Fine floor screeds requiring a smooth finish

## Quality Check

Ask your supplier for a **sieve analysis certificate**. A reputable sand supplier should provide particle size distribution data. On Procurely, every sand supplier has been pre-qualified with spec sheets available before you order.

## Order the Right Sand Today

Procurely stocks both Ogun River **sharp sand** and **plaster-grade washed sand** from certified quarries. Free delivery on orders above 10 tonnes within Lagos.
    `.trim(),
  },
  {
    slug: "construction-credit-nigeria-guide",
    title: "Construction Credit in Nigeria: What's Available in 2026",
    excerpt:
      "From Bank of Industry loans to FMBN funding and trade credit — here's every financing option available to Nigerian real estate developers right now.",
    category: "Finance",
    author: "Funmilayo Adeyemi",
    authorRole: "Project Manager",
    authorAvatar: "FA",
    date: "February 20, 2026",
    readTime: "9 min read",
    coverColor: "#6c2bd9",
    coverEmoji: "🏦",
    tags: ["Finance", "Credit", "Nigeria", "Real Estate", "BOI"],
    body: `
## The Financing Landscape in 2026

Access to construction finance in Nigeria has improved significantly since 2024. Here are the main options:

## 1. Bank of Industry (BOI) Real Estate Fund
- **Rate:** 9% per annum (concessionary)
- **Tenor:** Up to 10 years
- **Minimum:** ₦50M
- **Eligibility:** Registered company, project appraisal report, collateral

BOI remains the most affordable formal credit for large developers. Application cycles open quarterly — check **boi.ng** for current windows.

## 2. FMBN NHF Loans
- **Rate:** 6% per annum
- **Tenor:** Up to 30 years
- **Access:** Through approved primary mortgage banks
- **Note:** Requires NHF contributor status (min. 6 months)

Best for: Individual developers building for owner-occupation.

## 3. Commercial Bank Construction Finance
Most Tier-1 banks (Access, GTB, Zenith) offer construction finance at:
- **Rate:** Prime + 5–8% (currently 27–30% p.a.)
- **LTV:** Up to 65% of project value
- **Drawdown:** In tranches tied to construction milestones

High cost, but fast and requires minimal government paperwork.

## 4. Trade Credit via Procurely

Procurely offers qualified developers **Buy Now, Pay Later (BNPL)** material credit:
- Pay 30% upfront, balance in 90 days
- No collateral required for orders under ₦5M
- Integrated invoice and delivery tracking

This is our most popular product for mid-scale developers managing cash flow between sales tranches.

## Which Option Is Right For You?

| Developer Type | Best Option |
|---------------|-------------|
| Large corporates (>₦500M projects) | BOI |
| Individual owner-occupiers | FMBN |
| Mid-scale developers | Procurely Trade Credit |
| Short-term flippers | Commercial bank |

Apply for Procurely Trade Credit on the platform today — decisions in 48 hours.
    `.trim(),
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(current: BlogPost, count = 3): BlogPost[] {
  return blogPosts
    .filter((p) => p.slug !== current.slug)
    .sort(() => 0.5 - Math.random())
    .slice(0, count);
}
