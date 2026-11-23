import { theme as antdAlgorithms, type ThemeConfig } from "antd";

import { tokens } from "./tokens";

const controlHeight = 57;
const borderRadius = 12;

/**
 * Theme tokens driven by CSS variables (design-system/theme.css .light
 * block) so Ant Design components automatically follow the app's
 * light/dark class switch — no separate hardcoded palette needed here.
 */
export function getAntdTheme(isDark: boolean): ThemeConfig {
  return {
    algorithm: isDark ? antdAlgorithms.darkAlgorithm : antdAlgorithms.defaultAlgorithm,
    token: {
      colorPrimary: tokens.color.brand.primary,
      colorSuccess: tokens.color.semantic.success,
      colorWarning: tokens.color.semantic.warning,
      colorError: tokens.color.semantic.error,
      colorInfo: tokens.color.semantic.info,
      colorBgBase: "var(--color-ink)",
      colorBgContainer: "var(--color-charcoal)",
      colorBorder: "var(--color-smoke)",
      colorText: "var(--color-off-white)",
      colorTextSecondary: "var(--color-mist)",
      colorTextPlaceholder: "var(--color-placeholder)",
      colorBgElevated: "var(--color-charcoal)",
      borderRadius: tokens.radius.md,
      borderRadiusLG: borderRadius,
      fontFamily: tokens.typography.fontFamily,
      fontSize: tokens.typography.fontSize.base,
      controlHeight,
      controlHeightLG: controlHeight,
    },
    components: {
      Layout: {
        bodyBg: "var(--color-ink)",
        headerBg: "var(--color-charcoal)",
        siderBg: "var(--color-charcoal)",
      },
      Menu: {
        darkItemBg: "transparent",
        darkSubMenuItemBg: "transparent",
      },
      Card: {
        colorBgContainer: "var(--color-charcoal)",
        colorBorderSecondary: "transparent",
        borderRadiusLG: tokens.radius.md,
        paddingLG: tokens.spacing.lg,
      },
      Input: {
        colorBgContainer: "var(--color-charcoal)",
        colorBorder: "var(--color-smoke)",
        hoverBorderColor: "var(--color-mist)",
        activeBorderColor: "var(--color-mist)",
        colorText: "var(--color-white)",
        colorTextPlaceholder: "var(--color-placeholder)",
        paddingBlock: 0,
        paddingBlockLG: 0,
        paddingInline: tokens.spacing.lg + 8,
        paddingInlineLG: tokens.spacing.lg + 8,
        borderRadiusLG: borderRadius,
        controlHeight,
      },
      Button: {
        primaryShadow: tokens.shadow.glowBlue,
        defaultBg: "transparent",
        defaultBorderColor: "var(--color-smoke)",
        defaultColor: "var(--color-white)",
        defaultHoverBg: "var(--color-graphite)",
        defaultHoverBorderColor: "var(--color-mist)",
        defaultHoverColor: "var(--color-white)",
        borderRadius: borderRadius,
        borderRadiusLG: tokens.radius.pill,
        controlHeight,
        controlHeightLG: 50,
        paddingInline: tokens.spacing.lg + 8,
        fontWeight: tokens.typography.fontWeight.normal,
      },
      Modal: {
        contentBg: "var(--color-charcoal)",
        headerBg: "var(--color-charcoal)",
      },
      Table: {
        colorBgContainer: "var(--color-charcoal)",
        borderColor: "var(--color-slate)",
      },
      Form: {
        labelColor: "var(--color-white)",
        labelFontSize: tokens.typography.fontSize.md,
      },
      Select: {
        colorBgContainer: "var(--color-charcoal)",
        colorBgElevated: "var(--color-charcoal)",
        colorBorder: "var(--color-smoke)",
        hoverBorderColor: "var(--color-mist)",
        colorText: "var(--color-white)",
        colorTextPlaceholder: "var(--color-placeholder)",
        optionSelectedBg: "var(--color-graphite)",
        optionActiveBg: "var(--color-graphite)",
        borderRadiusLG: borderRadius,
        controlHeight,
      },
      Tag: {
        defaultBg: "var(--color-graphite)",
        defaultColor: "var(--color-silver)",
        borderRadiusSM: tokens.radius.full,
      },
      Upload: {
        colorBgContainer: "var(--color-charcoal)",
        colorBorder: "var(--color-smoke)",
        borderRadiusLG: borderRadius,
      },
      Typography: {
        fontFamily: tokens.typography.fontFamily,
        colorText: "var(--color-white)",
        colorTextHeading: "var(--color-off-white)",
        colorTextSecondary: "var(--color-mist)",
        titleMarginBottom: 0,
        fontSizeHeading1: 46,
        fontSizeHeading2: 28,
        fontSizeHeading3: 40,
        fontSizeHeading4: tokens.typography.fontSize.xl,
        fontSizeHeading5: tokens.typography.fontSize.lg,
      },
    },
  };
}
