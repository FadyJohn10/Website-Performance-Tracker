import React, { useState } from 'react';
import { Menu, MenuItem, SubMenu, Sidebar } from 'react-pro-sidebar';
import axios from 'axios';
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import BubbleChartRoundedIcon from "@mui/icons-material/BubbleChartRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

const MySidebar = props => {
    const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleDelete = () => {
    axios.get('http://localhost:5500/logout')
    .then(res => {
        window.location.reload(true);
    }).catch(err => console.log(err));
}

  return (
    <div style={{ display: "flex", minHeight: "100vh", position: "fixed", zIndex: 999 }}>
      <Sidebar className="app" collapsed={collapsed}>
        <Menu>
          <MenuItem className="menu1" >
            <button style={{border: "none", background: "none", color: "#fff"}} onClick={toggleSidebar}>{<MenuRoundedIcon/>}</button>
          </MenuItem>
          <MenuItem icon={<GridViewRoundedIcon />}> Home </MenuItem>
          <MenuItem icon={<AccountCircleRoundedIcon />}> Account </MenuItem>
          <SubMenu label="URLs" icon={<ReceiptRoundedIcon />}>
            <MenuItem icon={<TimelineRoundedIcon />}> TEST </MenuItem>
            <MenuItem icon={<BubbleChartRoundedIcon />}>TEST</MenuItem>
          </SubMenu>
          <MenuItem icon={<LogoutRoundedIcon />} onClick={handleDelete}> Logout </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
};
  export default MySidebar;