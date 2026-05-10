import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Briefly Wiki",
    pageTitleSuffix: " | Briefly Wiki",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "seanroyce.github.io/briefly-wiki",
    ignorePatterns: ["private", "templates", ".obsidian", "**/*.base"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Inter",
        body: "Inter",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#faf8f8",     // page background
          lightgray: "#e8e4df", // borders / hr
          gray: "#a89880",      // subdued text
          darkgray: "#161618",  // body text
          dark: "#161618",      // headings
          secondary: "#0582ca", // steel-blue — links
          tertiary: "#00a6fb",  // fresh-sky — hover states
          highlight: "rgba(255, 159, 28, 0.12)", // amber tint — link bg
          textHighlight: "rgba(255, 159, 28, 0.4)", // amber — ==marked== text
        },
        darkMode: {
          light: "#161618",     // dark mode background
          lightgray: "#0b2d47", // border / hr
          gray: "#2e6080",      // subdued text
          darkgray: "#fdfffc",  // porcelain — body text
          dark: "#fdfffc",      // porcelain — headings
          secondary: "#ff9f1c", // amber-glow — links
          tertiary: "#ffb84d",  // lighter amber — hover states
          highlight: "rgba(255, 159, 28, 0.15)", // amber tint — link bg
          textHighlight: "rgba(255, 159, 28, 0.35)", // amber — ==marked== text
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
