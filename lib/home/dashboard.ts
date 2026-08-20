import { FESTIVALS } from "@/lib/editor/festivals";
import { getSocialTemplateImage } from "@/lib/editor/templateImages";


export type QuickAction = {
  title: string;
  subtitle: string;
  icon: string;
  href: string;
  tone: string;
};

export const QUICK_ACTIONS: QuickAction[] = [
  {
    title: "Instagram Post",
    subtitle: "1080 × 1080",
    icon: "◎",
    href: "/editor?format=Instagram%20Post&panel=templates&new=1",
    tone: "from-pink-500 to-orange-400",
  },
  {
    title: "Instagram Story",
    subtitle: "1080 × 1920",
    icon: "▯",
    href: "/editor?format=Instagram%20Story&panel=templates&new=1",
    tone: "from-fuchsia-500 to-violet-500",
  },
  {
    title: "Festival Poster",
    subtitle: `${FESTIVALS.length} Indian festivals`,
    icon: "✦",
    href: "/editor?format=Festival%20Poster&panel=festival&new=1",
    tone: "from-orange-500 to-rose-500",
  },
  {
    title: "Facebook Post",
    subtitle: "940 × 788",
    icon: "f",
    href: "/editor?format=Facebook%20Post&panel=templates&new=1",
    tone: "from-blue-500 to-blue-700",
  },
  {
    title: "YouTube Thumbnail",
    subtitle: "1280 × 720",
    icon: "▶",
    href: "/editor?format=YouTube%20Thumbnail&panel=templates&new=1",
    tone: "from-red-500 to-rose-600",
  },
  {
    title: "LinkedIn Post",
    subtitle: "1200 × 1200",
    icon: "in",
    href: "/editor?format=LinkedIn%20Post&panel=templates&new=1",
    tone: "from-sky-500 to-cyan-600",
  },
  {
    title: "Resume Maker",
    subtitle: "A4 editable resume",
    icon: "▤",
    href: "/editor?template=resume-modern-split-1&new=1",
    tone: "from-emerald-500 to-teal-500",
  },
  {
    title: "Custom Size",
    subtitle: "Create your own",
    icon: "↗",
    href: "/editor?new=1",
    tone: "from-slate-600 to-slate-800",
  },
];

export const FEATURED = [
  {
    title: "Launch your brand",
    subtitle: "Modern social media starter pack",
    image: getSocialTemplateImage("creator"),
    tone: "from-violet-600 via-fuchsia-500 to-pink-500",
    tag: "Social media",
    href: "/editor?template=social-creator-1&new=1",
  },
  {
    title: "Food stories",
    subtitle: "Clean restaurant & cafe posts",
    image: getSocialTemplateImage("food"),
    tone: "from-orange-400 via-amber-400 to-yellow-300",
    tag: "Instagram",
    href: "/editor?template=social-food-2&new=1",
  },
  {
    title: "Creator growth",
    subtitle: "Bold posts for creators",
    image: getSocialTemplateImage("creator"),
    tone: "from-cyan-500 via-sky-500 to-blue-600",
    tag: "Creator",
    href: "/editor?template=social-creator-3&new=1",
  },
  {
    title: "Professional resume",
    subtitle: "Minimal, ATS-friendly layouts",
    image: getSocialTemplateImage("business"),
    tone: "from-emerald-500 via-teal-500 to-cyan-500",
    tag: "Resume",
    href: "/editor?template=resume-minimal-ats-1&new=1",
  },
  {
    title: "Sale campaign",
    subtitle: "High-converting promo posts",
    image: getSocialTemplateImage("sale"),
    tone: "from-rose-500 via-red-500 to-orange-500",
    tag: "Marketing",
    href: "/editor?template=social-sale-4&new=1",
  },
  {
    title: "Festival greetings",
    subtitle: "Indian festival posts with editable artwork",
    image: FESTIVALS.find((item) => item.slug === "diwali")?.image,
    tone: "from-orange-500 via-amber-400 to-rose-500",
    tag: "Festivals",
    href: "/editor?template=festival-diwali&panel=festival&new=1",
  },
  {
    title: "Business launch",
    subtitle: "Clean announcement designs",
    image: getSocialTemplateImage("business"),
    tone: "from-indigo-600 via-violet-600 to-purple-600",
    tag: "Business",
    href: "/editor?template=social-business-7&new=1",
  },
];

export const SOCIAL_TEMPLATE_PREVIEWS = [
  {
    "id": "social-sale-1",
    "title": "Sale 01",
    "tone": "from-zinc-950 to-violet-800",
    "image": getSocialTemplateImage("sale"),
    "href": "/editor?template=social-sale-1&new=1"
  },
  {
    "id": "social-sale-2",
    "title": "Sale 02",
    "tone": "from-cyan-200 to-sky-500",
    "image": getSocialTemplateImage("sale"),
    "href": "/editor?template=social-sale-2&new=1"
  },
  {
    "id": "social-sale-3",
    "title": "Sale 03",
    "tone": "from-orange-200 to-rose-500",
    "image": getSocialTemplateImage("sale"),
    "href": "/editor?template=social-sale-3&new=1"
  },
  {
    "id": "social-sale-4",
    "title": "Sale 04",
    "tone": "from-emerald-100 to-emerald-500",
    "image": getSocialTemplateImage("sale"),
    "href": "/editor?template=social-sale-4&new=1"
  },
  {
    "id": "social-sale-5",
    "title": "Sale 05",
    "tone": "from-pink-100 to-rose-500",
    "image": getSocialTemplateImage("sale"),
    "href": "/editor?template=social-sale-5&new=1"
  },
  {
    "id": "social-sale-6",
    "title": "Sale 06",
    "tone": "from-yellow-100 to-amber-400",
    "image": getSocialTemplateImage("sale"),
    "href": "/editor?template=social-sale-6&new=1"
  },
  {
    "id": "social-sale-7",
    "title": "Sale 07",
    "tone": "from-violet-100 to-purple-600",
    "image": getSocialTemplateImage("sale"),
    "href": "/editor?template=social-sale-7&new=1"
  },
  {
    "id": "social-sale-8",
    "title": "Sale 08",
    "tone": "from-blue-100 to-blue-600",
    "image": getSocialTemplateImage("sale"),
    "href": "/editor?template=social-sale-8&new=1"
  },
  {
    "id": "social-sale-9",
    "title": "Sale 09",
    "tone": "from-stone-100 to-stone-400",
    "image": getSocialTemplateImage("sale"),
    "href": "/editor?template=social-sale-9&new=1"
  },
  {
    "id": "social-business-1",
    "title": "Business 01",
    "tone": "from-zinc-950 to-violet-800",
    "image": getSocialTemplateImage("business"),
    "href": "/editor?template=social-business-1&new=1"
  },
  {
    "id": "social-business-2",
    "title": "Business 02",
    "tone": "from-cyan-200 to-sky-500",
    "image": getSocialTemplateImage("business"),
    "href": "/editor?template=social-business-2&new=1"
  },
  {
    "id": "social-business-3",
    "title": "Business 03",
    "tone": "from-orange-200 to-rose-500",
    "image": getSocialTemplateImage("business"),
    "href": "/editor?template=social-business-3&new=1"
  }
];

export const RESUME_PREVIEWS = [
  {
    "id": "resume-modern-split-1",
    "title": "Modern Split 01",
    "accent": "bg-violet-500",
    "image": getSocialTemplateImage("business"),
    "href": "/editor?template=resume-modern-split-1&new=1"
  },
  {
    "id": "resume-executive-2",
    "title": "Executive 02",
    "accent": "bg-orange-500",
    "image": getSocialTemplateImage("business"),
    "href": "/editor?template=resume-executive-2&new=1"
  },
  {
    "id": "resume-editorial-3",
    "title": "Editorial 03",
    "accent": "bg-blue-600",
    "image": getSocialTemplateImage("business"),
    "href": "/editor?template=resume-editorial-3&new=1"
  },
  {
    "id": "resume-minimal-ats-4",
    "title": "Minimal ATS 04",
    "accent": "bg-emerald-500",
    "image": getSocialTemplateImage("business"),
    "href": "/editor?template=resume-minimal-ats-4&new=1"
  },
  {
    "id": "resume-creative-grid-5",
    "title": "Creative Grid 05",
    "accent": "bg-fuchsia-500",
    "image": getSocialTemplateImage("business"),
    "href": "/editor?template=resume-creative-grid-5&new=1"
  },
  {
    "id": "resume-dark-luxe-6",
    "title": "Dark Luxe 06",
    "accent": "bg-orange-500",
    "image": getSocialTemplateImage("business"),
    "href": "/editor?template=resume-dark-luxe-6&new=1"
  },
  {
    "id": "resume-modern-split-7",
    "title": "Modern Split 07",
    "accent": "bg-teal-600",
    "image": getSocialTemplateImage("business"),
    "href": "/editor?template=resume-modern-split-7&new=1"
  },
  {
    "id": "resume-executive-8",
    "title": "Executive 08",
    "accent": "bg-violet-600",
    "image": getSocialTemplateImage("business"),
    "href": "/editor?template=resume-executive-8&new=1"
  }
];


export const FESTIVAL_PREVIEWS = FESTIVALS.slice(0, 12).map((item) => ({
  id: `festival-${item.slug}`,
  title: item.name,
  region: item.region,
  image: item.image,
  href: `/editor?template=festival-${item.slug}&panel=festival&new=1`,
}));

export const FESTIVAL_COUNT = FESTIVALS.length;
