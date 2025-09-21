import { Moon, Sun } from "lucide-react"

import { Button } from "../../components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { useTheme } from "../ThemeProvider"
type ModeToggleProps = {
    closeMobileNavBar: () => void;
};
type Theme = 'light' | 'dark' | 'system';
export function ModeToggle() {
    const { setTheme } = useTheme()




    function changeThemeAndCloseMobileNavBar(theme: Theme) {
        setTheme(theme)

    }


    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => changeThemeAndCloseMobileNavBar("light")}
                >
                    Light mode

                </DropdownMenuItem>
                <DropdownMenuItem
                    className="cursor-pointer"

                    onClick={() => changeThemeAndCloseMobileNavBar("dark")}>
                    Dark mode
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}
