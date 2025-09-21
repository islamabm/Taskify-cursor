import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Lock, LogOut, Settings } from "lucide-react";
import { toast } from "sonner";
// import PasswordChangeModal from "./PasswordChangeModal";
import { useNavigate } from "react-router-dom";
import { LogoutValidationModal } from "../modals/LogoutValidationModal";
import PasswordChangeModal from "./PasswordChangeModal";

export default function ProfileActions() {
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate()
    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const storageModule = await import('../../services/storage.service');
            const navigateModule = await import('../../services/navigate.service');
            const routeModule = await import('../../services/route.service');

            storageModule.storageService.remove('fullName_HAAT_CAMPAIGNS', false);

            // loginService.logout()
            // 
            navigateModule.navigateService.handleNavigation(navigate, routeModule.routeService.LOGIN);
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Failed to log out");
            setIsLoggingOut(false);
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
            >
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Account Actions
                        </h3>
                        <div className="space-y-3">
                            {/* <Button
                                variant="outline"
                                className="w-full justify-start h-12 border-2 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                                onClick={() => setShowPasswordModal(true)}
                            >
                                <Lock className="w-5 h-5 mr-3" />
                                Change Password
                            </Button> */}

                            <Button
                                variant="outline"
                                className="w-full justify-start h-12 border-2 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                                disabled
                            >
                                <Settings className="w-5 h-5 mr-3" />
                                Account Settings
                                <span className="ml-auto text-xs text-gray-500">Coming Soon</span>
                            </Button>

                            {/* <Button
                                className="w-full justify-start h-12 bg-red-600 hover:bg-red-700 text-white transition-all duration-200"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                            >
                                <LogOut className="w-5 h-5 mr-3" />
                                {isLoggingOut ? "Logging out..." : "Log Out"}
                            </Button> */}
                            <LogoutValidationModal />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* <PasswordChangeModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
            /> */}
        </>
    );
}