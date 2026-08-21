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
    href: "/editor?template=flagship-resume-executive-editorial&new=1",
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
    href: "/editor?template=flagship-instagram-creator-collage&new=1",
  },
  {
    title: "Food stories",
    subtitle: "Clean restaurant & cafe posts",
    image: getSocialTemplateImage("food"),
    tone: "from-orange-400 via-amber-400 to-yellow-300",
    tag: "Instagram",
    href: "/editor?template=flagship-instagram-food-bistro&new=1",
  },
  {
    title: "Creator growth",
    subtitle: "Bold posts for creators",
    image: getSocialTemplateImage("creator"),
    tone: "from-cyan-500 via-sky-500 to-blue-600",
    tag: "Creator",
    href: "/editor?template=flagship-instagram-hiring-electric&new=1",
  },
  {
    title: "Professional resume",
    subtitle: "Minimal, ATS-friendly layouts",
    image: getSocialTemplateImage("business"),
    tone: "from-emerald-500 via-teal-500 to-cyan-500",
    tag: "Resume",
    href: "/editor?template=flagship-resume-executive-editorial&new=1",
  },
  {
    title: "Sale campaign",
    subtitle: "High-converting promo posts",
    image: getSocialTemplateImage("sale"),
    tone: "from-rose-500 via-red-500 to-orange-500",
    tag: "Marketing",
    href: "/editor?template=premium-instagram-sale-bold&new=1",
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
    href: "/editor?template=flagship-linkedin-leadership-report&new=1",
  },
];

export const SOCIAL_TEMPLATE_PREVIEWS = [
  { id: "flagship-instagram-hiring-electric", title: "Electric Hiring", tone: "from-blue-950 to-yellow-300", image: getSocialTemplateImage("business"), href: "/editor?template=flagship-instagram-hiring-electric&new=1" },
  { id: "flagship-instagram-fashion-noir", title: "Noir Fashion", tone: "from-stone-100 to-red-500", image: getSocialTemplateImage("fashion"), href: "/editor?template=flagship-instagram-fashion-noir&new=1" },
  { id: "flagship-instagram-food-bistro", title: "Modern Bistro", tone: "from-red-950 to-amber-100", image: getSocialTemplateImage("food"), href: "/editor?template=flagship-instagram-food-bistro&new=1" },
  { id: "flagship-story-travel-postcards", title: "Travel Postcards", tone: "from-sky-200 to-orange-400", image: getSocialTemplateImage("travel"), href: "/editor?template=flagship-story-travel-postcards&new=1" },
  { id: "flagship-story-event-neon", title: "Neon Afterdark", tone: "from-black to-fuchsia-500", image: getSocialTemplateImage("event"), href: "/editor?template=flagship-story-event-neon&new=1" },
  { id: "flagship-youtube-finance-dashboard", title: "Finance Dashboard", tone: "from-emerald-950 to-lime-300", image: getSocialTemplateImage("finance"), href: "/editor?template=flagship-youtube-finance-dashboard&new=1" },
  { id: "flagship-youtube-fitness-impact", title: "Fitness Impact", tone: "from-black to-orange-600", image: getSocialTemplateImage("fitness"), href: "/editor?template=flagship-youtube-fitness-impact&new=1" },
  { id: "flagship-facebook-realestate-luxe", title: "Luxe Property", tone: "from-stone-50 to-emerald-900", image: getSocialTemplateImage("realestate"), href: "/editor?template=flagship-facebook-realestate-luxe&new=1" },
  { id: "flagship-linkedin-leadership-report", title: "Leadership Report", tone: "from-slate-950 to-sky-300", image: getSocialTemplateImage("business"), href: "/editor?template=flagship-linkedin-leadership-report&new=1" },
  { id: "flagship-instagram-creator-collage", title: "Creator Collage", tone: "from-violet-950 to-lime-300", image: getSocialTemplateImage("creator"), href: "/editor?template=flagship-instagram-creator-collage&new=1" }
];

export const RESUME_PREVIEWS = [
  { id: "flagship-resume-executive-editorial", title: "Executive Editorial", accent: "bg-amber-700", image: getSocialTemplateImage("business"), href: "/editor?template=flagship-resume-executive-editorial&new=1" },
  { id: "flagship-resume-creative-grid", title: "Creative Grid Portfolio", accent: "bg-orange-500", image: getSocialTemplateImage("creator"), href: "/editor?template=flagship-resume-creative-grid&new=1" },
  { id: "premium-resume-minimal-ats", title: "Minimal ATS Pro", accent: "bg-slate-700", image: getSocialTemplateImage("business"), href: "/editor?template=premium-resume-minimal-ats&new=1" },
  { id: "premium-resume-tech-green", title: "Tech Product Green", accent: "bg-emerald-500", image: getSocialTemplateImage("education"), href: "/editor?template=premium-resume-tech-green&new=1" }
];

export const FESTIVAL_PREVIEWS = FESTIVALS.slice(0, 12).map((item) => ({
  id: `festival-${item.slug}`,
  title: item.name,
  region: item.region,
  image: item.image,
  href: `/editor?template=festival-${item.slug}&panel=festival&new=1`,
}));

export const FESTIVAL_COUNT = FESTIVALS.length;
