import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Copy, Mail, Phone, Check } from "lucide-react";
import { toast } from "sonner";
import { User } from "../../types/commonTypes/commonTypes";



interface ContactInfoCardProps {
    readonly user: User
}


export default function ContactInfoCard({ user }: ContactInfoCardProps) {
    const [copiedItems, setCopiedItems] = useState(new Set());

    const copyToClipboard = async (text: string, label: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedItems(prev => {
                const next = new Set(prev); // still iterates!
                next.add(label);
                return next;
            });
            toast.success(`${label} copied to clipboard`);

            setTimeout(() => {
                setCopiedItems(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(label);
                    return newSet;
                });
            }, 2000);
        } catch (err) {
            toast.error("Failed to copy to clipboard");
        }
    };

    const contactItems = [
        {
            label: "Email",
            value: user.email,
            href: `mailto:${user.email}`,
            icon: Mail,
            copyText: user.email
        },
        {
            label: "Phone",
            value: user.phone1,
            href: `tel:${user.phone1}`,
            icon: Phone,
            copyText: user.phone1
        }
    ];


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
        >
            <Card className="overflow-hidden border-0 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200/50 dark:border-gray-600/50">
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                        Contact Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="grid divide-y divide-gray-200/50 dark:divide-gray-600/50">
                        {contactItems.map((item, index) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                                className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                            <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {item.label}
                                            </p>
                                            <a
                                                href={item.href}
                                                className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                            >
                                                {item.value}
                                            </a>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => copyToClipboard(item.copyText, item.label)}
                                        className="h-9 w-9 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                                    >
                                        {copiedItems.has(item.label) ? (
                                            <Check className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <Copy className="w-4 h-4 text-gray-500" />
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}