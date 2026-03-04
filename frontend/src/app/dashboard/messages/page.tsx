"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMessages, markMessageRead, deleteMessage, replyToMessage, Message } from "@/store/slices/messagesSlice";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Clock, MoreHorizontal, Trash2, Eye, CheckCircle2, Inbox, Send, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function MessagesPage() {
    const dispatch = useAppDispatch();
    const { messages, loading } = useAppSelector((state) => state.messages);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [replyText, setReplyText] = useState("");
    const [isReplying, setIsReplying] = useState(false);

    useEffect(() => {
        dispatch(fetchMessages());
    }, [dispatch]);

    const handleMarkAsRead = (id: string, status: string) => {
        if (status === "unread") {
            dispatch(markMessageRead(id));
        }
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this message?")) {
            dispatch(deleteMessage(id));
        }
    };

    const handleOpenMessage = (msg: Message) => {
        setSelectedMessage(msg);
        handleMarkAsRead(msg.id, msg.status);
    };

    const handleSendReply = async () => {
        if (!selectedMessage || !replyText.trim()) return;

        setIsReplying(true);
        try {
            await dispatch(replyToMessage({ id: selectedMessage.id, replyMessage: replyText })).unwrap();
            toast.success("Reply sent successfully!");
            setReplyText("");
            setSelectedMessage(null);
        } catch (err) {
            toast.error("Failed to send reply: " + String(err));
        } finally {
            setIsReplying(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1.5">
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Inquiry Hub</h1>
                <p className="text-muted-foreground font-medium">
                    Monitor and respond to direct inquiries from your potential clients.
                </p>
            </div>

            <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                    <CardTitle className="text-2xl font-bold">Contact Stream</CardTitle>
                    <CardDescription className="text-sm font-medium">
                        You have <span className="text-orange-600 font-bold">{messages.filter(m => m.status === 'unread').length}</span> priority messages awaiting your attention.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading && messages.length === 0 ? (
                        <div className="py-32 flex flex-col items-center justify-center gap-4">
                            <span className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
                            <span className="text-sm font-bold text-muted-foreground animate-pulse uppercase tracking-widest">Synchronizing...</span>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="py-32 flex flex-col items-center justify-center text-muted-foreground gap-4">
                            <Inbox className="h-16 w-16 opacity-10" />
                            <div className="text-center space-y-1">
                                <span className="text-sm font-bold uppercase tracking-widest opacity-50 block">No inquiries found</span>
                                <p className="text-xs max-w-[280px]">Your inbox is currently clear. New messages from the contact form will appear here.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl border bg-background/50 overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="w-[120px] font-bold uppercase text-[10px] tracking-widest">Classification</TableHead>
                                        <TableHead className="font-bold uppercase text-[10px] tracking-widest">Sender</TableHead>
                                        <TableHead className="hidden md:table-cell font-bold uppercase text-[10px] tracking-widest">Connectivity</TableHead>
                                        <TableHead className="w-[35%] font-bold uppercase text-[10px] tracking-widest">Message Digest</TableHead>
                                        <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest">Received</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {messages.map((msg) => (
                                        <TableRow
                                            key={msg.id}
                                            className={`group transition-all duration-300 hover:bg-muted/30 cursor-pointer ${msg.status === "unread" ? 'bg-orange-50/30' : ''}`}
                                            onClick={() => handleOpenMessage(msg)}
                                        >
                                            <TableCell>
                                                {msg.status === "unread" ? (
                                                    <Badge className="bg-orange-500 hover:bg-orange-600 font-bold uppercase text-[9px] px-2 h-5">New Alert</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="font-bold uppercase text-[9px] px-2 h-5 text-muted-foreground/60">Reviewed</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                                                        <AvatarFallback className="text-[10px] font-bold bg-muted-foreground/10">{msg.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-bold text-sm tracking-tight">{msg.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex flex-col gap-1.5 py-1">
                                                    <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                                                        <Mail className="w-3 h-3 text-primary/40" />
                                                        {msg.email}
                                                    </div>
                                                    {msg.phone && (
                                                        <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                                                            <Phone className="w-3 h-3 text-primary/40" />
                                                            {msg.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="max-w-[300px] truncate text-xs font-medium text-foreground/80 leading-relaxed italic">
                                                    "{msg.message}"
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-[11px] font-black text-foreground/70 tracking-tighter">{new Date(msg.created_at).toLocaleDateString()}</span>
                                                    <span className="text-[9px] font-bold uppercase text-muted-foreground/50 tracking-widest flex items-center gap-1">
                                                        <Clock className="w-2.5 h-2.5" />
                                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                                                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Manage Link</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleOpenMessage(msg); }} className="flex items-center gap-2">
                                                            <Eye className="h-4 w-4" /> View & Reply
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" /> Delete Permanently
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Message Detail & Reply Dialog */}
            <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none shadow-2xl">
                    <DialogHeader className="p-8 bg-muted/30 border-b">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                            <MessageSquare className="w-6 h-6 text-primary" /> Message Details
                        </DialogTitle>
                        <DialogDescription className="text-sm font-medium">
                            Received on {selectedMessage && new Date(selectedMessage.created_at).toLocaleString()}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-8 space-y-6">
                        {/* Sender Info */}
                        <div className="grid grid-cols-2 gap-6 bg-background p-4 rounded-xl border shadow-sm">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                    <User className="w-3 h-3" /> Sender Name
                                </span>
                                <p className="text-sm font-bold">{selectedMessage?.name}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                    <Mail className="w-3 h-3" /> Email Address
                                </span>
                                <p className="text-sm font-bold text-primary">{selectedMessage?.email}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                    <Phone className="w-3 h-3" /> Contact Number
                                </span>
                                <p className="text-sm font-bold">{selectedMessage?.phone || "Not provided"}</p>
                            </div>
                        </div>

                        {/* Message Content */}
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Original Inquiry</span>
                            <div className="p-4 bg-muted/50 rounded-xl border italic text-sm leading-relaxed text-foreground/80">
                                "{selectedMessage?.message}"
                            </div>
                        </div>

                        {/* Reply Section */}
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                <Send className="w-3 h-3" /> Write a Reply
                            </span>
                            <Textarea
                                placeholder="Type your response here... This will be sent directly to the sender's email."
                                className="min-h-[150px] resize-none focus-visible:ring-primary border-muted-foreground/20 rounded-xl"
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="p-6 bg-muted/20 border-t flex items-center justify-end gap-3">
                        <Button variant="ghost" onClick={() => setSelectedMessage(null)}>Cancel</Button>
                        <Button
                            className="bg-primary hover:bg-primary/90 gap-2 px-6"
                            onClick={handleSendReply}
                            disabled={isReplying || !replyText.trim()}
                        >
                            {isReplying ? (
                                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            Send Email Reply
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
