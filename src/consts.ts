import type { Site, Metadata, Socials } from "@types";

export const SITE: Site = {
  NAME: "Jacl",
  EMAIL: "laix1024@gmail.com",
  NUM_POSTS_ON_HOMEPAGE: 5,
  NUM_PROJECTS_ON_HOMEPAGE: 3,
};

export const HOME: Metadata = {
  TITLE: "Home",
  DESCRIPTION: "Jacl 的量化开发与交易系统工程笔记。",
};

export const BLOG: Metadata = {
  TITLE: "Blog",
  DESCRIPTION: "关于量化开发、交易系统与工程实践的文章。",
};

export const WORK: Metadata = {
  TITLE: "Work",
  DESCRIPTION: "当前关注的量化开发与交易系统工程方向。",
};

export const PROJECTS: Metadata = {
  TITLE: "Projects",
  DESCRIPTION: "个人项目与工程实践。",
};

export const SOCIALS: Socials = [
  { 
    NAME: "github",
    HREF: "https://github.com/jacl-coder"
  }
];
