type Props = {
  variant?: "full" | "tagline" | "mark";
  className?: string;
  alt?: string;
};

export default function KriyavoLogo({
  variant = "full",
  className = "",
  alt = "Kriyavo",
}: Props) {
  const src =
    variant === "mark"
      ? "/kriyavo/kriyavo-mark.png"
      : variant === "tagline"
        ? "/kriyavo/kriyavo-logo-tagline.png"
        : "/kriyavo/kriyavo-logo.png";

  const width = variant === "mark" ? 512 : 1455;
  const height = variant === "tagline" ? 500 : variant === "mark" ? 512 : 450;

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      draggable={false}
      className={`block select-none object-contain ${className}`}
    />
  );
}
