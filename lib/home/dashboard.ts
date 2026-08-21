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
    href: "/editor?template=premium-resume-executive-navy&new=1",
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
    href: "/editor?template=premium-instagram-creator-neon&new=1",
  },
  {
    title: "Food stories",
    subtitle: "Clean restaurant & cafe posts",
    image: getSocialTemplateImage("food"),
    tone: "from-orange-400 via-amber-400 to-yellow-300",
    tag: "Instagram",
    href: "/editor?template=premium-instagram-food-studio&new=1",
  },
  {
    title: "Creator growth",
    subtitle: "Bold posts for creators",
    image: getSocialTemplateImage("creator"),
    tone: "from-cyan-500 via-sky-500 to-blue-600",
    tag: "Creator",
    href: "/editor?template=premium-linkedin-hiring&new=1",
  },
  {
    title: "Professional resume",
    subtitle: "Minimal, ATS-friendly layouts",
    image: getSocialTemplateImage("business"),
    tone: "from-emerald-500 via-teal-500 to-cyan-500",
    tag: "Resume",
    href: "/editor?template=premium-resume-minimal-ats&new=1",
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
    href: "/editor?template=premium-facebook-business-consulting&new=1",
  },
];

export const SOCIAL_TEMPLATE_PREVIEWS = [
  { id: "premium-instagram-fashion-editorial", title: "Fashion Editorial", tone: "from-stone-100 to-rose-500", image: getSocialTemplateImage("fashion"), href: "/editor?template=premium-instagram-fashion-editorial&new=1" },
  { id: "premium-instagram-creator-neon", title: "Creator Neon", tone: "from-slate-950 to-lime-400", image: getSocialTemplateImage("creator"), href: "/editor?template=premium-instagram-creator-neon&new=1" },
  { id: "premium-instagram-food-studio", title: "Food Studio", tone: "from-orange-50 to-orange-600", image: getSocialTemplateImage("food"), href: "/editor?template=premium-instagram-food-studio&new=1" },
  { id: "premium-instagram-sale-bold", title: "Bold Commerce", tone: "from-yellow-300 to-red-500", image: getSocialTemplateImage("sale"), href: "/editor?template=premium-instagram-sale-bold&new=1" },
  { id: "premium-instagram-realestate-luxe", title: "Luxe Listing", tone: "from-stone-100 to-emerald-700", image: getSocialTemplateImage("realestate"), href: "/editor?template=premium-instagram-realestate-luxe&new=1" },
  { id: "premium-instagram-fitness-impact", title: "Fitness Impact", tone: "from-neutral-950 to-orange-600", image: getSocialTemplateImage("fitness"), href: "/editor?template=premium-instagram-fitness-impact&new=1" },
  { id: "premium-story-travel-editorial", title: "Travel Story", tone: "from-sky-100 to-orange-500", image: getSocialTemplateImage("travel"), href: "/editor?template=premium-story-travel-editorial&new=1" },
  { id: "premium-story-event-night", title: "Night Event", tone: "from-purple-950 to-fuchsia-500", image: getSocialTemplateImage("event"), href: "/editor?template=premium-story-event-night&new=1" },
  { id: "premium-youtube-business-growth", title: "Business Growth", tone: "from-slate-950 to-sky-500", image: getSocialTemplateImage("business"), href: "/editor?template=premium-youtube-business-growth&new=1" },
  { id: "premium-youtube-finance-money", title: "Money Simple", tone: "from-stone-100 to-emerald-700", image: getSocialTemplateImage("finance"), href: "/editor?template=premium-youtube-finance-money&new=1" },
  { id: "premium-linkedin-leadership", title: "Leadership Note", tone: "from-stone-100 to-stone-700", image: getSocialTemplateImage("business"), href: "/editor?template=premium-linkedin-leadership&new=1" },
  { id: "premium-portrait-travel-diary", title: "Travel Diary", tone: "from-cyan-50 to-orange-400", image: getSocialTemplateImage("travel"), href: "/editor?template=premium-portrait-travel-diary&new=1" }
];

export const RESUME_PREVIEWS = [
  { id: "premium-resume-executive-navy", title: "Executive Navy", accent: "bg-blue-700", image: getSocialTemplateImage("business"), href: "/editor?template=premium-resume-executive-navy&new=1" },
  { id: "premium-resume-creative-coral", title: "Creative Coral", accent: "bg-rose-500", image: getSocialTemplateImage("creator"), href: "/editor?template=premium-resume-creative-coral&new=1" },
  { id: "premium-resume-minimal-ats", title: "Minimal ATS Pro", accent: "bg-slate-700", image: getSocialTemplateImage("business"), href: "/editor?template=premium-resume-minimal-ats&new=1" },
  { id: "premium-resume-tech-green", title: "Tech Product Green", accent: "bg-emerald-500", image: getSocialTemplateImage("education"), href: "/editor?template=premium-resume-tech-green&new=1" },
  { id: "premium-resume-editorial-olive", title: "Editorial Olive", accent: "bg-emerald-800", image: getSocialTemplateImage("fashion"), href: "/editor?template=premium-resume-editorial-olive&new=1" },
  { id: "premium-resume-dark-studio", title: "Dark Studio", accent: "bg-fuchsia-500", image: getSocialTemplateImage("creator"), href: "/editor?template=premium-resume-dark-studio&new=1" }
];

export const FESTIVAL_PREVIEWS = FESTIVALS.slice(0, 12).map((item) => ({
  id: `festival-${item.slug}`,
  title: item.name,
  region: item.region,
  image: item.image,
  href: `/editor?template=festival-${item.slug}&panel=festival&new=1`,
}));

export const FESTIVAL_COUNT = FESTIVALS.length;
