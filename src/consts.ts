import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Jacl",
  NUM_POSTS_ON_HOMEPAGE: 5,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Jacl 的量化开发与交易系统工程笔记。",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "关于量化开发、交易系统与工程实践的文章。",
};

export const SOCIALS: Socials = [
  { 
    NAME: "github",
    HREF: "https://github.com/jacl-coder"
  }
];
