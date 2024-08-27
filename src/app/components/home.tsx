"use client";

import { Routes, Route, HashRouter as Router } from "react-router-dom";
import { SideBar } from "./sidebar";
import styles from "./home.module.scss";
import { Path } from "../constant";
import { MaskPage } from "./mask-page";
import Chat from "./chat";


export default function Home() {
    return (
      <Router>
        <div className="sideBar">
          <SideBar />
  
          <div className={styles["window-content"]} >
            <Routes>
              <Route path={Path.Chat} element={<Chat />} />
              <Route path={Path.Home} element={<MaskPage />} />
              <Route path={Path.Masks} element={<MaskPage />} />
            </Routes>
          </div>
        </div>
      </Router>
    );
  }