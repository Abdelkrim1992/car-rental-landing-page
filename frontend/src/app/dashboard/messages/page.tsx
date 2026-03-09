"use client";

import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchMessages, markMessageRead, deleteMessage, deleteMessages, replyToMessage, Message } from "@/store/slices/messagesSlice";
import { ConfirmModal } from "@/components/dashboard/ConfirmModal";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Avatar,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Textarea,
    Pagination,
    Select,
    SelectItem,
    Skeleton,
    Divider
} from "@heroui/react";
import { Mail, Phone, Clock, MoreVertical, Trash2, Eye, Inbox, Send, User, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function MessagesPage() {
    const dispatch = useAppDispatch();
    const { messages, loading } = useAppSelector((state) => state.messages);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [replyText, setReplyText] = useState("");
    const [isReplying, setIsReplying] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<any>(new Set([]));
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState("10");

    useEffect(() => {
        dispatch(fetchMessages());
    }, [dispatch]);

    const rows = parseInt(rowsPerPage);
    const pages = Math.ceil(messages.length / rows);

    const items = useMemo(() => {
        const start = (currentPage - 1) * rows;
        const end = start + rows;
        return messages.slice(start, end);
    }, [currentPage, messages, rows]);

    const handleMarkAsRead = (id: string, status: string) => {
        if (status === "unread") {
            dispatch(markMessageRead(id));
        }
    };

    const handleDelete = (id: string) => {
        setDeletingId(id);
        setIsBulkDeleting(false);
        setIsDeleteModalOpen(true);
    };

    const handleBulkDelete = () => {
        setIsBulkDeleting(true);
        setDeletingId(null);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            if (isBulkDeleting) {
                const ids = selectedKeys === "all"
                    ? items.map(m => m.id)
                    : Array.from(selectedKeys) as string[];

                if (ids.length === 0) return;

                await dispatch(deleteMessages(ids)).unwrap();
                setSelectedKeys(new Set([]));
                toast.success(`Successfully deleted ${ids.length} messages`);
            } else if (deletingId) {
                await dispatch(deleteMessage(deletingId)).unwrap();
                toast.success("Message deleted successfully");
            }
            setIsDeleteModalOpen(false);
        } catch (error: any) {
            console.error("Delete error:", error);
            toast.error(error || "Failed to delete message(s)");
        } finally {
            setIsDeleting(false);
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
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Messages</h1>
                <p className="text-small text-default-500">
                    <span className="text-warning font-medium">{messages.filter(m => m.status === 'unread').length} unread</span> messages awaiting attention
                </p>
            </div>

            {(selectedKeys === "all" || selectedKeys.size > 0) && (
                <Card className="bg-primary-50 border-primary-200">
                    <CardBody className="py-2 px-4 flex flex-row items-center justify-between">
                        <p className="text-sm font-medium text-primary-700">
                            {selectedKeys === "all" ? items.length : selectedKeys.size} messages selected
                        </p>
                        <Button
                            color="danger"
                            size="sm"
                            variant="flat"
                            startContent={<Trash2 size={16} />}
                            onPress={handleBulkDelete}
                        >
                            Delete Selected
                        </Button>
                    </CardBody>
                </Card>
            )}

            <Card>
                <CardHeader className="pb-2">
                    <div>
                        <p className="text-large font-bold">Contact Stream</p>
                        <p className="text-small text-default-500">All incoming messages</p>
                    </div>
                </CardHeader>
                <CardBody>
                    <Table
                        aria-label="Messages table"
                        removeWrapper
                        selectionMode="multiple"
                        selectedKeys={selectedKeys}
                        onSelectionChange={setSelectedKeys}
                        onRowAction={(key) => handleOpenMessage(messages.find(m => m.id === key) as Message)}
                    >
                        <TableHeader>
                            <TableColumn>Status</TableColumn>
                            <TableColumn>Sender</TableColumn>
                            <TableColumn className="hidden md:table-cell">Contact</TableColumn>
                            <TableColumn className="hidden sm:table-cell">Message</TableColumn>
                            <TableColumn className="text-right hidden lg:table-cell">Received</TableColumn>
                            <TableColumn className="text-right">Actions</TableColumn>
                        </TableHeader>
                        <TableBody
                            loadingContent={<Skeleton className="w-full h-20" />}
                            emptyContent={
                                <div className="py-12 flex flex-col items-center justify-center gap-2 text-default-400">
                                    <Inbox size={32} />
                                    <span>No messages yet</span>
                                </div>
                            }
                        >
                            {items.map((msg) => (
                                <TableRow key={msg.id} className="cursor-pointer">
                                    <TableCell>
                                        <Chip
                                            variant="flat"
                                            color={msg.status === "unread" ? "warning" : "default"}
                                            size="sm"
                                        >
                                            {msg.status === "unread" ? "New" : "Read"}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar name={msg.name} size="sm" />
                                            <span className="text-sm font-semibold">{msg.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-tiny text-default-500 flex items-center gap-1">
                                                <Mail size={12} /> {msg.email}
                                            </p>
                                            {msg.phone && (
                                                <p className="text-tiny text-default-500 flex items-center gap-1">
                                                    <Phone size={12} /> {msg.phone}
                                                </p>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <p className="text-small text-default-500 line-clamp-1 italic">
                                            &ldquo;{msg.message}&rdquo;
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-right hidden lg:table-cell">
                                        <div className="flex flex-col items-end">
                                            <span className="text-small font-medium">{new Date(msg.created_at).toLocaleDateString()}</span>
                                            <span className="text-tiny text-default-400 flex items-center gap-1">
                                                <Clock size={10} />
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Dropdown placement="bottom-end">
                                            <DropdownTrigger>
                                                <Button isIconOnly variant="light" size="sm" onClick={(e) => e.stopPropagation()}>
                                                    <MoreVertical size={18} />
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu aria-label="Message actions">
                                                <DropdownItem key="view" startContent={<Eye size={16} />} onPress={() => handleOpenMessage(msg)}>
                                                    View & Reply
                                                </DropdownItem>
                                                <DropdownItem key="delete" color="danger" className="text-danger" startContent={<Trash2 size={16} />} onPress={() => handleDelete(msg.id)}>
                                                    Delete Message
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    {!loading && messages.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-small text-default-500">Rows per page</span>
                                <Select
                                    size="sm"
                                    className="w-20"
                                    variant="flat"
                                    disallowEmptySelection
                                    selectedKeys={[rowsPerPage]}
                                    onSelectionChange={(keys) => {
                                        setRowsPerPage(Array.from(keys)[0] as string);
                                        setCurrentPage(1);
                                    }}
                                >
                                    <SelectItem key="5">5</SelectItem>
                                    <SelectItem key="10">10</SelectItem>
                                    <SelectItem key="20">20</SelectItem>
                                    <SelectItem key="50">50</SelectItem>
                                </Select>
                            </div>
                            <Pagination
                                isCompact
                                showControls
                                showShadow
                                color="primary"
                                page={currentPage}
                                total={pages}
                                onChange={setCurrentPage}
                            />
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Reply Modal */}
            <Modal
                isOpen={!!selectedMessage}
                onClose={() => setSelectedMessage(null)}
                size="2xl"
                scrollBehavior="inside"
                backdrop="blur"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <MessageSquare className="size-5 text-primary" />
                                    <span className="text-xl font-bold">Message Details</span>
                                </div>
                                <p className="text-small text-default-400">
                                    Received on {selectedMessage && new Date(selectedMessage.created_at).toLocaleString()}
                                </p>
                            </ModalHeader>
                            <ModalBody>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="p-4 bg-default-50 rounded-lg">
                                            <p className="text-tiny text-default-400 font-semibold mb-2 uppercase">Sender Info</p>
                                            <div className="space-y-2">
                                                <p className="text-sm flex items-center gap-2"><User size={14} /> {selectedMessage?.name}</p>
                                                <p className="text-sm flex items-center gap-2"><Mail size={14} /> {selectedMessage?.email}</p>
                                                <p className="text-sm flex items-center gap-2"><Phone size={14} /> {selectedMessage?.phone || "No phone"}</p>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-warning-50 rounded-lg">
                                            <p className="text-tiny text-warning font-semibold mb-2 uppercase">Message</p>
                                            <p className="text-sm italic">&ldquo;{selectedMessage?.message}&rdquo;</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Send className="size-4 text-primary" />
                                            <span className="text-small font-semibold text-default-500">Prepare Response</span>
                                        </div>
                                        <Textarea
                                            placeholder="Write your email reply here..."
                                            variant="flat"
                                            minRows={6}
                                            value={replyText}
                                            onValueChange={setReplyText}
                                        />
                                        <p className="text-tiny text-default-400 text-center">
                                            This email will be delivered to <span className="text-primary">{selectedMessage?.email}</span>
                                        </p>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="light" onPress={onClose}>
                                    Dismiss
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={handleSendReply}
                                    isLoading={isReplying}
                                    endContent={!isReplying && <Send size={16} />}
                                    isDisabled={!replyText.trim()}
                                >
                                    Send Email Reply
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                isLoading={isDeleting}
                title={isBulkDeleting ? "Delete Selected Messages" : "Delete Message"}
                message={isBulkDeleting
                    ? `Are you sure you want to permanently remove ${selectedKeys === 'all' ? items.length : selectedKeys.size} selected messages?`
                    : "Are you sure you want to permanently remove this message?"
                }
            />
        </div>
    );
}
