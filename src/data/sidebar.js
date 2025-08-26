import { LayoutDashboard, MessageCircle, Link } from 'lucide-react';

export const sidebarData = {
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard
        },
        {
          title: 'Reviews',
          url: '/reviews',
          icon: MessageCircle
        },
        {
          title: 'Integration',
          url: '/integration',
          icon: Link
        }
      ]
    }
  ]
};
