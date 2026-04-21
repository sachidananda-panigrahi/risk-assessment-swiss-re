export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  status: "Active" | "Inactive";
  createdAt: string;
  avatarColor: string;
  avatarInitials: string;
}

// Seeded pseudo-random — same output every run
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0x100000000;
  };
}

const firstNames = [
  "Jane", "Floyd", "Ronald", "Marvin", "Jerome", "Jacob", "Kristin", "Albert",
  "Sarah", "Michael", "Emma", "Liam", "Olivia", "Noah", "Ava", "William",
  "Sophia", "James", "Isabella", "Oliver", "Mia", "Benjamin", "Charlotte",
  "Elijah", "Amelia", "Lucas", "Harper", "Mason", "Evelyn", "Logan",
];

const lastNames = [
  "Cooper", "Miles", "Warren", "McKinney", "Bell", "Wilson", "Watson", "Walker",
  "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson",
  "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee",
  "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez",
];

const companies = [
  "Microsoft", "Yahoo", "Adobe", "Tesla", "Google", "Facebook", "Apple",
  "Amazon", "Netflix", "Spotify", "Slack", "Zoom", "Salesforce", "Oracle",
  "IBM", "Intel", "Samsung", "Sony", "Nike", "Airbnb", "Uber", "Twitter",
  "LinkedIn", "Dropbox", "GitHub", "Atlassian", "Stripe", "Square", "PayPal",
];

const countries = [
  "United States", "Canada", "United Kingdom", "Germany", "France", "Australia",
  "Japan", "Brazil", "India", "Netherlands", "Sweden", "Switzerland", "Singapore",
  "South Korea", "Italy", "Spain", "Mexico", "Argentina", "New Zealand", "Ireland",
  "Reunion", "Kiribati", "Cayman Islands", "Curacao", "Faroe Islands",
];

const avatarColors = [
  "#4f46e5", "#7c3aed", "#db2777", "#dc2626", "#d97706",
  "#16a34a", "#0891b2", "#0284c7", "#9333ea", "#c2410c",
];

function formatPhone(r: () => number): string {
  const area = Math.floor(r() * 900) + 100;
  const mid = Math.floor(r() * 900) + 100;
  const end = Math.floor(r() * 9000) + 1000;
  return `(${area}) ${mid}-${end}`;
}

function formatDate(r: () => number): string {
  const year = 2020 + Math.floor(r() * 5);
  const month = String(Math.floor(r() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(r() * 28) + 1).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

let _cache: Customer[] | null = null;

export function generateCustomers(count = 20000): Customer[] {
  if (_cache) return _cache;

  const r = seeded(42);
  const customers: Customer[] = [];

  for (let i = 0; i < count; i++) {
    const first = firstNames[Math.floor(r() * firstNames.length)];
    const last = lastNames[Math.floor(r() * lastNames.length)];
    const name = `${first} ${last}`;
    const company = companies[Math.floor(r() * companies.length)];
    const country = countries[Math.floor(r() * countries.length)];
    const status: "Active" | "Inactive" = r() > 0.3 ? "Active" : "Inactive";
    const colorIdx = Math.floor(r() * avatarColors.length);

    customers.push({
      id: `cust-${String(i + 1).padStart(6, "0")}`,
      name,
      email: `${first.toLowerCase()}.${last.toLowerCase()}${Math.floor(r() * 999) + 1}@${company.toLowerCase().replace(/\s/g, "")}.com`,
      company,
      phone: formatPhone(r),
      country,
      status,
      createdAt: formatDate(r),
      avatarColor: avatarColors[colorIdx],
      avatarInitials: `${first[0]}${last[0]}`,
    });
  }

  _cache = customers;
  return customers;
}
