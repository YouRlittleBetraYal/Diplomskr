import React from "react";
import {
  MdSubscriptions,
  MdExitToApp,
  MdThumbUp,
  MdHistory,
  MdLibraryBooks,
  MdHome,
} from "react-icons/md";
import { Link } from "react-router-dom";

import SidebarRow from "../SideBarRow/SidebarRow";
import "./_sidebar.scss";

function Sidebar({ toggleSidebar, handleToggleSidebar }) {
  return (
    <div className={toggleSidebar ? "Sidebaer_main open" : "Sidebaer_main"}>
      <Link to="/">
        <SidebarRow
          title="Домашня сторінка"
          Icon={MdHome}
          handleToggleSidebar={handleToggleSidebar}
        />
      </Link>

      <Link to="/feed/subscriptions">
        <SidebarRow
          title="Мої підписки"
          Icon={MdSubscriptions}
          handleToggleSidebar={handleToggleSidebar}
        />
      </Link>

      <hr />
      <SidebarRow
        title="Logout"
        Icon={MdExitToApp}
        handleToggleSidebar={handleToggleSidebar}
      />
      <hr />
    </div>
  );
}

export default Sidebar;
