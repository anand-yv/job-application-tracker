import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Headers.module.css"
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Headers = () => {
    const { user, authLoading, logout } = useAuth();
    const { theme, toogleTheme } = useTheme();
    const [dialogOpen, setDialogOpen] = useState(false);
    const navigate = useNavigate();

    const getInitials = (email) => email?.[0]?.toUpperCase() || "?";

    const handleLogout = () => {
        logout();
        setDialogOpen(false);
        navigate("/login");
    };

    return <>
        <header className={styles["header"]}>
            <div onClick={() => navigate("/dashboard")} className={styles.logo}>
                JSJSJ
            </div>

            <div className={styles["actions"]}>
                <Button variant="ghost" onClick={toogleTheme}>
                    {theme === "light" ? "🌙" : "☀️"}
                </Button>

                {authLoading ? null : user ? (
                    <>
                        <DropdownMenu>
                            <DropdownMenuTrigger render={
                                <button className={styles.avatar}>{getInitials(user.email)}</button>
                            } />
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                                    Logout
                                </DropdownMenuItem>
                                {/* TODO :  Need to add more iterms like profile page and so on. */}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Log out?</DialogTitle>
                                </DialogHeader>
                                <p>Are you sure you want to log out?</p>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                                    <Button variant="destructive" onClick={handleLogout}>Log out</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </header>
    </>
}

export default Headers;