import type { CSSProperties } from "react"

/**
 * Swiss Post Design System icon.
 *
 * The `@swisspost/design-system-icons` package ships each icon as a
 * self-contained SVG (with responsive size symbols). We serve the ones we use
 * from `/public/post-icons` and render them via a CSS mask so the glyph is
 * tinted with `currentColor` — this keeps a single monochrome icon legible on
 * both the light content area and the dark sidebar.
 */
export type PostIconName =
  | "customercontact"
  | "branch"
  | "newspaper"
  | "send"
  | "search"
  | "save"
  | "document"
  | "favoritestar"
  | "newsletter"
  | "statusedit"
  | "warning"
  | "parcel"
  | "searchconsignment"
  | "checkmark"
  | "info"
  | "speechbubble"
  | "history"
  | "filter"
  | "letter"
  | "dashboard"
  | "database"
  | "edit"
  | "chevrondown"
  | "chevronright"
  | "closex"
  | "server"
  | "layers"
  | "network"
  | "cloud"
  | "flash"
  | "gear"
  | "key"
  | "eye"
  | "lockclosed"
  | "maskshield"
  | "heartpulse"
  | "globemeridian"
  | "rocket"
  | "brain"

type PostIconProps = {
  name: PostIconName
  /** Pixel size of the square icon box. Defaults to 20. */
  size?: number
  className?: string
  /** Decorative by default; pass a label to expose it to screen readers. */
  label?: string
}

export function PostIcon({ name, size = 20, className, label }: PostIconProps) {
  const maskUrl = `url(/post-icons/${name}.svg)`
  const style: CSSProperties = {
    width: size,
    height: size,
    display: "inline-block",
    flexShrink: 0,
    backgroundColor: "currentColor",
    WebkitMaskImage: maskUrl,
    maskImage: maskUrl,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskSize: "contain",
    maskSize: "contain",
  }
  return (
    <span
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      className={className}
      style={style}
    />
  )
}
