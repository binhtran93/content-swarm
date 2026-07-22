export type AdminNavigationItem = {
  label: string;
  href: string;
  icon: "projects" | "keywords" | "articles" | "videos";
};

export function getAdminNavigation(projectId?: string): AdminNavigationItem[] {
  const navigation: AdminNavigationItem[] = [
    { label: "Projects", href: "/admin/projects", icon: "projects" },
  ];

  if (projectId) {
    navigation.push(
      {
        label: "Keywords",
        href: `/admin/projects/${projectId}/keywords`,
        icon: "keywords",
      },
      {
        label: "Articles",
        href: `/admin/projects/${projectId}/articles`,
        icon: "articles",
      },
      {
        label: "Videos",
        href: `/admin/projects/${projectId}/videos`,
        icon: "videos",
      },
    );
  }

  return navigation;
}
