import {LOGIN, PROJECT_PLANNER, SETTINGS, TASK, USER_ACCOUNT} from "@/constants/constants";
import {Link, useNavigate} from "react-router-dom";
import {CircleUser, ClipboardCheck, Menu} from "lucide-react";
import {Button} from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {ModeToggle} from "./ModeToggle";
import {useMutation} from "@tanstack/react-query";
import {logoutApi} from "@/api/auth/auth.ts";
import {useDispatch} from "react-redux";
import {logout} from "@/store/slice/userSlice.ts";
import NavLink from "@/components/Navigations/components/NavLink.tsx";

function NavBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logoutMutation = useMutation({
        mutationFn: logoutApi,
        onSuccess: () => {
            dispatch(logout()); // clear the Redux
            navigate(LOGIN);
        },
        onError: (error) => {
            alert(error.message);
        }
    })

    return (
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <nav
                className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link
                    to={""}
                    className="flex items-center gap-2 text-lg font-semibold md:text-base"
                >
                    <ClipboardCheck className="h-6 w-6"/>
                    <span className="sr-only">Icon</span>
                </Link>
                <NavLink to={PROJECT_PLANNER}>Project Planner</NavLink>
                <NavLink to={TASK}>Tasks</NavLink>
                <NavLink to={SETTINGS}>Settings</NavLink>
            </nav>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                        <Menu className="h-5 w-5"/>
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link
                            to={""}
                            className="flex items-center gap-2 text-lg font-semibold"
                        >
                            <ClipboardCheck className="h-6 w-6"/>
                            <span className="sr-only">Acme Inc</span>
                        </Link>
                        <Link
                            to={""}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Tasks
                        </Link>
                        <Link
                            to={""}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Sticky Notes
                        </Link>
                        <Link
                            to={""}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Calories
                        </Link>
                        <Link
                            to={""}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Drive
                        </Link>
                        <Link to={""} className="hover:text-foreground">
                            Settings
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <div className="ml-auto flex-1 sm:flex-initial">
                    <ModeToggle/>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <CircleUser className="h-5 w-5"/>
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>User Settings</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <Link to={USER_ACCOUNT}>
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={() => logoutMutation.mutate()}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

export default NavBar;
