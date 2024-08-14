import { PropsWithChildren, useState } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Toolbar,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "@hooks/useUser";
import LightModeIcon from '@mui/icons-material/LightMode';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import CategoryIcon from '@mui/icons-material/CategoryOutlined';
import { useConfig } from "@hooks/useConfig";
import { Popover } from "@components/Popover";
import { dataService } from "@services/dataService";
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import HomeIcon from '@mui/icons-material/HomeOutlined';
import PeopleAltIcon from '@mui/icons-material/PeopleAltOutlined';
import { Logo } from "@components/Logo";
import SellIcon from '@mui/icons-material/SellOutlined';
import InventoryIcon from '@mui/icons-material/Inventory2Outlined';
import { Authorize } from "@components/Authorize.tsx";
import FormatListIcon from '@mui/icons-material/FormatListNumberedRtlOutlined';
import { PermissionName } from "@models/business";
import ManageAccountsIcon from '@mui/icons-material/ManageAccountsOutlined';

interface NavbarProps extends PropsWithChildren {
  window?: () => Window;
}

const drawerWidth = 240;

export const Navbar = (props: NavbarProps) => {
  const navigate = useNavigate();
  const [{paletteMode, rtl}, updateConfig] = useConfig();
  const currentUser = useUser();
  const location = useLocation();
  const {window, children} = props;
  const [open, setOpen] = useState(false);
  const navItems: { text: string; href: string; icon: JSX.Element; permissions: PermissionName[] }[] = [
    {
      text: 'خانه',
      href: '/',
      icon: <HomeIcon/>,
      permissions: ["*"]
    },
    {
      text: 'کاربران',
      href: '/users',
      icon: <PeopleAltIcon/>,
      permissions: ["user.index", "user.create", "user.edit", "user.destroy"]
    },
    {
      text: 'دسته بندی ها',
      href: '/categories',
      icon: <CategoryIcon/>,
      permissions: ["category.index", "category.create", "category.edit", "category.destroy"]
    },
    {
      text: 'تگ ها',
      href: '/tags',
      icon: <SellIcon/>,
      permissions: ["tag.index", "tag.create", "tag.edit", "tag.destroy"]
    },
    {
      text: 'محصولات',
      href: '/products',
      icon: <InventoryIcon/>,
      permissions: ["product.index", "product.create", "product.edit", "product.destroy"]
    },
    {
      text: 'ویژگی ها',
      href: '/attributes',
      icon: <FormatListIcon/>,
      permissions: ["attribute.index", "attribute.create", "attribute.edit", "attribute.destroy"]
    },
    {
      text: 'نقش ها',
      href: '/roles',
      icon: <ManageAccountsIcon/>,
      permissions: ["role.index", "role.create", "role.edit", "role.destroy"]
    },
  ];

  const logout = () => {
    const destination = dataService.logout();
    navigate(destination);
  }

  const handleThemeToggle = () => {
    updateConfig({paletteMode: paletteMode === "light" ? "dark" : "light"});
  }

  const handleDrawerToggle = () => {
    setOpen(prev => !prev);
  };

  const container = window !== undefined ? () => window().document.body : undefined;

  const drawer = (
      <Box onClick={() => setOpen(false)}>
        <Toolbar/>
        <List>
          {
            navItems.map(item => (
                <Authorize key={item.text} include={item.permissions}>
                  <ListItem selected={item.href === location.pathname} disablePadding>
                    <ListItemButton component={Link} to={item.href}>
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={item.text}/>
                    </ListItemButton>
                  </ListItem>
                </Authorize>
            ))
          }
        </List>
      </Box>
  );

  return (
      <Box sx={{display: "flex"}}>
        <AppBar position="fixed" sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: (theme) => theme.palette.mode === 'light' ? '#fff' : 'primary.default',
          color: 'inherit'
        }}>
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{mr: 2, display: {md: "none"}}}>
              <MenuIcon/>
            </IconButton>
            <Logo sx={{mr: 2}}/>
            <Box sx={{flexGrow: 1}}>
              <Typography variant="h6" noWrap sx={{display: {xs: 'none', sm: 'block'}}}>
                Salot
              </Typography>
            </Box>
            <IconButton onClick={handleThemeToggle} color="inherit">
              {paletteMode === 'dark' ? <LightModeIcon/> : <ModeNightIcon/>}
            </IconButton>
            {
                currentUser &&
                <>
                  <Popover>
                    <Popover.Toggle>
                      <IconButton size="large" color="inherit">
                        <AccountCircle/>
                      </IconButton>
                    </Popover.Toggle>
                    <Popover.Content>
                      <MenuList>
                        <MenuItem onClick={logout}>
                          <ListItemIcon><LogoutIcon/></ListItemIcon>
                          خروج
                        </MenuItem>
                      </MenuList>
                    </Popover.Content>
                  </Popover>
                </>
            }
          </Toolbar>
        </AppBar>
        <Box component="nav" sx={{width: {md: drawerWidth}, flexShrink: {md: 0}}} aria-label="mailbox folders">
          <Drawer
              container={container}
              variant="temporary"
              anchor={rtl ? 'left' : 'right'}
              open={open}
              onClose={handleDrawerToggle}
              ModalProps={{keepMounted: true}}
              sx={{
                display: {xs: "block", sm: "block", md: "none"},
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth
                }
              }}>
            {drawer}
          </Drawer>
          <Drawer
              variant="permanent"
              sx={{
                display: {xs: "none", sm: "none", md: "block"},
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth
                }
              }}
              open>
            {drawer}
          </Drawer>
        </Box>
        <Box component="main" sx={{flexGrow: 1, width: {xs: '100%', md: `calc(100% - ${drawerWidth}px)`}}}>
          <Toolbar/>
          <Box sx={{p: 2}}>
            {children}
          </Box>
        </Box>
      </Box>
  );
}
