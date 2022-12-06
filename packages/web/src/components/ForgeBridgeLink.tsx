import { getAppRootUrl, getForgeContext, Product } from "@/lib/forge-context";
import { router } from "@forge/bridge";
import React, {
  AnchorHTMLAttributes,
  DetailedHTMLProps,
  useCallback,
  useState,
} from "react";
import { useAsync } from "react-use";
import { Except } from "type-fest";

export type Props = Except<
  DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
  "href" | "target" | "onClick"
> & {
  /** Can be a complete URL or an absolute path starting with '/' within the Atlassian platform. */
  href: string;
  /** If `true` opens the `href` location in a new window. */
  newWindow?: boolean;
  /** Overrides the default `onClick` behaviour. */
  onClick?: () => void;
  product: Product;
};

/**
 * A simple `A` tag link with necessary navigation within Atlassian platform using the `@forge/bridge` `router`.
 *
 * `href` may contain any URL that is inserted into the `A` tag.
 * If `href` starts with a `/`, the site URL of the atlassian installation is prepended to represent an absolute URL within the Atlassian plattform.
 * If `href` starts with `@app/` the plugin's root path to static resources is appended to represent an absolute URL to the apps installation route.
 */
export function ForgeBridgeLink({
  href,
  newWindow,
  onClick,
  product,
  children,
  ...props
}: Props) {
  const [_href, _setHref] = useState<string>();
  useAsync(async () => {
    if (href.startsWith("/")) {
      const { siteUrl } = await getForgeContext();
      href = `${siteUrl}${href}`;
    }
    if (href.startsWith("@app/")) {
      const appRootUrl = await getAppRootUrl(product);
      href = href.replace("@app", appRootUrl);
    }
    _setHref(href);
  }, [href]);
  const _onClick = useCallback(
    async (event) => {
      event.preventDefault();
      if (!_href) return;
      if (onClick) {
        onClick();
        return;
      }
      try {
        if (newWindow) {
          await router.open(_href);
        } else {
          await router.navigate(_href);
        }
      } catch (e) {
        console.warn(`did not confirm to open link ${_href}`, e);
      }
    },
    [_href, onClick, newWindow]
  );
  return (
    <a {...props} href={_href} onClick={_onClick}>
      {children}
    </a>
  );
}
