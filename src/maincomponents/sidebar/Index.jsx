import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail
} from '@maincomponents/sidebar/SidebarProvider';
import { NavGroup } from '@maincomponents/sidebar/NavGroup';
import { NavUser } from '@maincomponents/sidebar/NavUser';
import { sidebarData } from '@data/sidebar';
import logo from '@assets/logo.webp';

function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className='flex justify-center items-center'>
              <img src={logo} className='min-w-[20px] min-h-[20px] max-w-[120px] max-h-[120px]' />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className={'mt-8'}>
        {sidebarData.navGroups.map(props => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
