import { Outlet } from "react-router-dom";
// import Header from "../components/Header";
// KOMENTAR DEMO: Layout Utama (Main Layout) untuk seluruh halaman Dashboard. Membungkus konten/halaman utama (Outlet) dengan komponen navigasi (Sidebar) agar struktur dasarnya selalu seragam.
export default function MainLayout () {

    return(
        <div id="app-container" className="bg-latar min-h-screen flex font-barlow">
      <div id="layout-wrapper" className="flex flex-row flex-1">
        <Sidebar />


        <div
          id="main-content"
          className="flex-1 flex flex-col h-screen overflow-y-auto">
          {/* <Header /> */}
          <Outlet/>
        </div>
      </div>
    </div>
    )
}