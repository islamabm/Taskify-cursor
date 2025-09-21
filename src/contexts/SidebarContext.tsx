// src/contexts/SidebarContext.tsx
import { createContext, useContext, useState } from "react";

interface SidebarCtx {
    isOpen: boolean;          // full mobile drawer (you already had this)
    isCollapsed: boolean;     // new – “rail” vs “full”
    toggleCollapse(): void;
    open(): void;
    close(): void;
}

const SidebarContext = createContext<SidebarCtx>({} as SidebarCtx);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);        // mobile
    const [isCollapsed, setIsCollapsed] = useState(false); // desktop rail

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);
    const toggleCollapse = () => setIsCollapsed((c) => !c);

    return (
        <SidebarContext.Provider
            value={{ isOpen, isCollapsed, toggleCollapse, open, close }}
        >
            {children}
        </SidebarContext.Provider>
    );
}

export const useSidebar = () => useContext(SidebarContext);
