import { usePage } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';

interface PageProps {
  [key: string]: any;
}

export function useBreadcrumbs(): BreadcrumbItem[] {
  const { url, props } = usePage<PageProps>();
  
  // Don't add dashboard for the dashboard page itself
  const breadcrumbs: BreadcrumbItem[] = [];
  
  // Add dashboard if not on dashboard page
  if (!url.endsWith('/admin/dashboard') && !url.endsWith('/admin')) {
    breadcrumbs.push({
      title: 'Dashboard',
      href: route('dashboard'),
    });
  }

  // Parse the current URL to determine breadcrumb path
  const pathSegments = url.split('/').filter(segment => segment !== '' && segment !== 'admin');
  
  // Helper function to get resource name from path
  const getResourceInfo = (segment: string) => {
    const resourceMap: Record<string, { title: string; route: string }> = {
      'users': {
        title: 'Users',
        route: 'users.index'
      },
      'businesses': {
        title: 'Businesses',
        route: 'businesses.index'
      },
      'services': {
        title: 'Services',
        route: 'admin.services.create'
      },
      'roles': {
        title: 'Roles',
        route: 'roles.index'
      },
      'permissions': {
        title: 'Permissions',
        route: 'permissions.index'
      }
    };
    
    return resourceMap[segment] || { 
      title: segment.charAt(0).toUpperCase() + segment.slice(1), 
      route: ''
    };
  };

  // Build breadcrumbs based on URL segments
  for (let i = 0; i < pathSegments.length; i++) {
    const segment = pathSegments[i];
    const isLast = i === pathSegments.length - 1;
    
    // Skip numeric IDs but store for context
    if (/^\d+$/.test(segment)) {
      continue;
    }
    
    if (segment === 'create') {
      breadcrumbs.push({
        title: 'Create',
        href: '#'
      });
    } else if (segment === 'edit') {
      breadcrumbs.push({
        title: 'Edit',
        href: '#'
      });
    } else if (segment === 'show') {
      breadcrumbs.push({
        title: 'Details',
        href: '#'
      });
    } else {
      const resourceInfo = getResourceInfo(segment);
      let href = '#';
      
      // Try to generate route safely
      try {
        if (resourceInfo.route) {
          href = route(resourceInfo.route);
        }
      } catch (error) {
        // Route doesn't exist, use # as fallback
        href = '#';
      }
      
      breadcrumbs.push({
        title: resourceInfo.title,
        href: href
      });
    }
  }

  // Handle special cases with props data
  if (props.business?.name) {
    // If we're working with a specific business, add its name
    const businessIndex = breadcrumbs.findIndex(item => item.title === 'Businesses');
    if (businessIndex !== -1) {
      try {
        breadcrumbs.splice(businessIndex + 1, 0, {
          title: props.business.name,
          href: route('businesses.show', props.business.id),
        });
      } catch (error) {
        breadcrumbs.splice(businessIndex + 1, 0, {
          title: props.business.name,
          href: '#',
        });
      }
    }
  }

  if (props.user?.name && pathSegments.includes('users')) {
    // If we're working with a specific user, add their name
    const userIndex = breadcrumbs.findIndex(item => item.title === 'Users');
    if (userIndex !== -1 && (pathSegments.includes('edit') || pathSegments.includes('show'))) {
      try {
        breadcrumbs.splice(userIndex + 1, 0, {
          title: props.user.name,
          href: route('users.show', props.user.id),
        });
      } catch (error) {
        breadcrumbs.splice(userIndex + 1, 0, {
          title: props.user.name,
          href: '#',
        });
      }
    }
  }

  if (props.role?.name && pathSegments.includes('roles')) {
    // If we're working with a specific role
    const roleIndex = breadcrumbs.findIndex(item => item.title === 'Roles');
    if (roleIndex !== -1 && (pathSegments.includes('edit') || pathSegments.includes('show'))) {
      try {
        breadcrumbs.splice(roleIndex + 1, 0, {
          title: props.role.name,
          href: route('roles.show', props.role.id),
        });
      } catch (error) {
        breadcrumbs.splice(roleIndex + 1, 0, {
          title: props.role.name,
          href: '#',
        });
      }
    }
  }

  if (props.permission?.name && pathSegments.includes('permissions')) {
    // If we're working with a specific permission
    const permissionIndex = breadcrumbs.findIndex(item => item.title === 'Permissions');
    if (permissionIndex !== -1 && (pathSegments.includes('edit') || pathSegments.includes('show'))) {
      try {
        breadcrumbs.splice(permissionIndex + 1, 0, {
          title: Array.isArray(props.permission.name) ? props.permission.name.join(', ') : props.permission.name,
          href: route('permissions.show', props.permission.id),
        });
      } catch (error) {
        breadcrumbs.splice(permissionIndex + 1, 0, {
          title: Array.isArray(props.permission.name) ? props.permission.name.join(', ') : props.permission.name,
          href: '#',
        });
      }
    }
  }

  return breadcrumbs;
}