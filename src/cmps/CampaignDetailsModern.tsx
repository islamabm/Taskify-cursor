import React from "react";
import { motion } from "framer-motion";
import { Copy, Check, Maximize2, Download, Image as ImageIcon, Globe } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../components/ui/dialog";

/**
 * CampaignDetailsModern
 * Ultra-modern, responsive view for a campaign's brief (Arabic/Hebrew) and its design image.
 *
 * ✅ Beautiful, responsive layout (mobile → desktop)
 * ✅ RTL-aware typography for Arabic/Hebrew
 * ✅ Copy-to-clipboard with feedback
 * ✅ Image zoom (modal), open-in-new-tab, and download actions
 * ✅ Subtle animations & clean, production-ready Tailwind styles
 *
 * Usage:
 * <CampaignDetailsModern
 *   content={selectedTicket.data.content}
 *   designImageURL={selectedTicket.data.designImageURL}
 *   meta={{ id: selectedTicket.data.ticketID, title: selectedTicket.data.title }} // optional
 * />
 */
export default function CampaignDetailsModern({
    content,
    designImageURL,
    meta,
}: {
    content: string;
    designImageURL?: string | null;
    meta?: { id?: number | string; title?: string };
}) {
    const [copied, setCopied] = React.useState(false);

    // Detect RTL if content contains Arabic/Hebrew characters
    const isRTL = React.useMemo(() => {
        if (!content) return false;
        const rtlPattern = /[\u0590-\u05FF\u0600-\u06FF]/; // Hebrew + Arabic blocks
        return rtlPattern.test(content);
    }, [content]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content || "");
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch { }
    };

    const openInNewTab = () => {
        if (designImageURL) window.open(designImageURL, "_blank", "noopener,noreferrer");
    };

    const downloadImage = async () => {
        if (!designImageURL) return;
        try {
            const res = await fetch(designImageURL);
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = meta?.title ? `${sanitizeFilename(meta.title)}.png` : "campaign-design.png";
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch { }
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header / Meta */}
            <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex items-center justify-between py-4"
            >

            </motion.div>

            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 pb-10">
                {/* Brief (RTL-aware) */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05, duration: 0.35 }}
                >
                    <Card className="rounded-2xl shadow-sm border-muted/30">
                        <CardHeader className="space-y-1">
                            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                                <Globe className="h-5 w-5" /> Campaign Brief
                            </CardTitle>
                        </CardHeader>
                        <Separator className="opacity-60" />
                        <CardContent className="p-5">
                            <div className="flex items-center justify-between mb-4">
                                {/* <p className="text-sm text-muted-foreground">Arabic/Hebrew content</p> */}
                                <Button size="sm" variant="secondary" onClick={handleCopy} className="gap-2">
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                    {copied ? "Copied" : "Copy"}
                                </Button>
                            </div>

                            {/* Content box */}
                            <div
                                dir={isRTL ? "rtl" : "ltr"}
                                className="text-base leading-8 md:text-lg md:leading-9 whitespace-pre-wrap tracking-normal selection:bg-primary/15 rounded-xl p-4 md:p-5 bg-muted/30 border border-muted/40"
                                style={{ wordBreak: "break-word" }}
                            >
                                {content || (
                                    <span className="text-muted-foreground">No brief provided yet.</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Design image */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.35 }}
                >
                    <Card className="rounded-2xl shadow-sm border-muted/30 overflow-hidden">
                        <CardHeader className="space-y-1">
                            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                                <ImageIcon className="h-5 w-5" /> Campaign Design
                            </CardTitle>
                        </CardHeader>
                        <Separator className="opacity-60" />
                        <CardContent className="p-0">
                            {designImageURL ? (
                                <figure className="group relative">
                                    <img
                                        src={designImageURL}
                                        alt={meta?.title ? `${meta.title} design` : "Campaign design"}
                                        className="w-full aspect-[4/3] object-cover object-center"
                                        loading="lazy"
                                    />

                                    {/* Overlay actions */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="sm" className="backdrop-blur-sm" variant="secondary">
                                                    <Maximize2 className="h-4 w-4 mr-2" /> View
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-5xl p-2">
                                                <DialogHeader>
                                                    <DialogTitle className="text-base md:text-lg">{meta?.title || "Design"}</DialogTitle>
                                                </DialogHeader>
                                                <div className="w-full">
                                                    <img
                                                        src={designImageURL}
                                                        alt={meta?.title ? `${meta.title} design large` : "Campaign design large"}
                                                        className="w-full h-auto rounded-lg"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        <Button size="sm" variant="secondary" onClick={openInNewTab}>
                                            Open
                                        </Button>
                                        <Button size="sm" variant="secondary" onClick={downloadImage}>
                                            <Download className="h-4 w-4 mr-2" /> Download
                                        </Button>
                                    </div>
                                </figure>
                            ) : (
                                <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
                                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        No design image has been attached.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

function sanitizeFilename(name: string) {
    return name.replace(/[\\/:*?"<>|]+/g, "-").slice(0, 80).trim();
}
