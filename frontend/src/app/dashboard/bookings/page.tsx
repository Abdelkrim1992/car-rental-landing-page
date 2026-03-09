"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { fetchBookings, updateBooking, deleteBooking, deleteBookings } from "@/store/slices/bookingSlice";
import { ConfirmModal } from "@/components/dashboard/ConfirmModal";
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Chip,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Avatar,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Pagination,
    Select,
    SelectItem,
    Skeleton
} from "@heroui/react";
import { Phone, MapPin, Plus, MoreVertical, Check, X, Eye, Calendar, Car } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";

export default function BookingsPage() {
    const dispatch = useAppDispatch();
    const { bookings, loading } = useAppSelector((state) => state.booking);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState("10");
    const [selectedKeys, setSelectedKeys] = useState<any>(new Set([]));
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        dispatch(fetchBookings());
    }, [dispatch]);

    const rows = parseInt(rowsPerPage);
    const pages = Math.ceil(bookings.length / rows);

    const items = useMemo(() => {
        const start = (currentPage - 1) * rows;
        const end = start + rows;
        return bookings.slice(start, end);
    }, [currentPage, bookings, rows]);

    const handleStatusChange = (id: string, status: "confirmed" | "cancelled") => {
        dispatch(updateBooking({ id, updates: { status } }));
    };

    const handleDeleteBooking = (id: string) => {
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
                    ? items.map(b => b.id)
                    : Array.from(selectedKeys) as string[];

                if (ids.length === 0) return;

                await dispatch(deleteBookings(ids)).unwrap();
                setSelectedKeys(new Set([]));
                toast.success(`Successfully deleted ${ids.length} bookings`);
            } else if (deletingId) {
                await dispatch(deleteBooking(deletingId)).unwrap();
                toast.success("Booking deleted successfully");
            }
            setIsDeleteModalOpen(false);
        } catch (error: any) {
            console.error("Delete error:", error);
            toast.error(error || "Failed to delete booking(s)");
        } finally {
            setIsDeleting(false);
        }
    };

    const getStatusColor = (status: string): "default" | "primary" | "success" | "warning" | "danger" => {
        switch (status) {
            case "confirmed": return "success";
            case "pending": return "warning";
            case "completed": return "primary";
            case "cancelled": return "danger";
            default: return "default";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Reservations</h1>
                    <p className="text-small text-default-500">Customer booking lifecycle management</p>
                </div>
                <Button
                    color="primary"
                    endContent={<Plus size={18} />}
                    as={Link}
                    href="/dashboard/bookings/add"
                >
                    Create New Booking
                </Button>
            </div>

            {(selectedKeys === "all" || selectedKeys.size > 0) && (
                <Card className="bg-primary-50 border-primary-200">
                    <CardBody className="py-2 px-4 flex flex-row items-center justify-between">
                        <p className="text-sm font-medium text-primary-700">
                            {selectedKeys === "all" ? items.length : selectedKeys.size} bookings selected
                        </p>
                        <Button
                            color="danger"
                            size="sm"
                            variant="flat"
                            startContent={<X size={16} />}
                            onPress={handleBulkDelete}
                        >
                            Delete Selected
                        </Button>
                    </CardBody>
                </Card>
            )}

            <Card>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                    <div>
                        <p className="text-large font-bold">Booking Directory</p>
                        <p className="text-small text-default-500">
                            {bookings.length} total reservations found
                        </p>
                    </div>
                </CardHeader>
                <CardBody>
                    {/* Desktop/Tablet Table */}
                    <div className="hidden md:block">
                        <Table
                            aria-label="Bookings table"
                            removeWrapper
                            selectionMode="multiple"
                            selectedKeys={selectedKeys}
                            onSelectionChange={setSelectedKeys}
                        >
                            <TableHeader>
                                <TableColumn>Status</TableColumn>
                                <TableColumn>Customer</TableColumn>
                                <TableColumn>Vehicle / Location</TableColumn>
                                <TableColumn className="hidden lg:table-cell">Booking Dates</TableColumn>
                                <TableColumn className="text-right hidden xl:table-cell">Revenue</TableColumn>
                                <TableColumn className="text-right">Actions</TableColumn>
                            </TableHeader>
                            <TableBody
                                loadingContent={<Skeleton className="w-full h-20" />}
                                emptyContent={
                                    <div className="py-12 flex flex-col items-center justify-center gap-2 text-default-400">
                                        <Calendar size={32} />
                                        <span>No reservations found</span>
                                    </div>
                                }
                            >
                                {items.map((b) => (
                                    <TableRow key={b.id}>
                                        <TableCell>
                                            <Chip variant="flat" color={getStatusColor(b.status || "pending")} size="sm">
                                                {b.status || "pending"}
                                            </Chip>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/dashboard/bookings/${b.id}`} className="group/customer">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={b.guest_name} size="sm" className="group-hover/customer:ring-2 group-hover/customer:ring-primary transition-all" />
                                                    <div>
                                                        <p className="text-sm font-semibold group-hover/customer:text-primary transition-colors">{b.guest_name}</p>
                                                        <p className="text-tiny text-default-400 flex items-center gap-1">
                                                            <Phone size={12} /> {b.guest_phone || "—"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="text-sm font-semibold">{b.car_name}</p>
                                                <p className="text-tiny text-default-400 flex items-center gap-1">
                                                    <MapPin size={12} /> {b.pickup_location}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden lg:table-cell">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-xs font-medium">{new Date(b.pickup_date).toLocaleDateString()}</p>
                                                <p className="text-[10px] text-default-400">to {new Date(b.return_date).toLocaleDateString()}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right hidden xl:table-cell">
                                            <span className="font-semibold">
                                                ${Number(b.total_price || 0).toLocaleString()}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Dropdown placement="bottom-end">
                                                <DropdownTrigger>
                                                    <Button isIconOnly variant="light" size="sm">
                                                        <MoreVertical size={18} />
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu aria-label="Booking actions">
                                                    <DropdownItem key="view" startContent={<Eye size={16} />} href={`/dashboard/bookings/${b.id}`} as={Link}>
                                                        View Details
                                                    </DropdownItem>
                                                    {b.status === "pending" ? (
                                                        <DropdownItem
                                                            key="confirm"
                                                            color="success"
                                                            className="text-success"
                                                            startContent={<Check size={16} />}
                                                            onPress={() => handleStatusChange(b.id, "confirmed")}
                                                        >
                                                            Confirm Booking
                                                        </DropdownItem>
                                                    ) : null}
                                                    <DropdownItem
                                                        key="delete"
                                                        color="danger"
                                                        className="text-danger"
                                                        startContent={<X size={16} />}
                                                        onPress={() => handleDeleteBooking(b.id)}
                                                    >
                                                        {b.status === "pending" ? "Refuse Booking" : "Delete Record"}
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile Card List */}
                    <div className="md:hidden space-y-4">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)
                        ) : items.length === 0 ? (
                            <div className="py-12 flex flex-col items-center justify-center gap-2 text-default-400">
                                <Calendar size={32} />
                                <span>No reservations found</span>
                            </div>
                        ) : (
                            items.map((b) => (
                                <Card key={b.id} className="border-none bg-default-50 shadow-none">
                                    <CardBody className="p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-3">
                                                <Avatar name={b.guest_name} size="sm" />
                                                <div>
                                                    <p className="text-sm font-bold">{b.guest_name}</p>
                                                    <p className="text-tiny text-default-500">{new Date(b.pickup_date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <Chip variant="flat" color={getStatusColor(b.status || "pending")} size="sm">
                                                {b.status || "pending"}
                                            </Chip>
                                        </div>
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-small">
                                                <Car className="size-4 text-primary" />
                                                <span className="font-semibold">{b.car_name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-tiny text-default-500">
                                                <MapPin className="size-3" />
                                                <span>{b.pickup_location}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-2 border-t border-default-100">
                                            <span className="font-bold text-primary">${Number(b.total_price || 0).toLocaleString()}</span>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="flat" as={Link} href={`/dashboard/bookings/${b.id}`}>Details</Button>
                                                <Button isIconOnly size="sm" variant="light" onPress={() => handleDeleteBooking(b.id)}>
                                                    <X size={16} className="text-danger" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))
                        )}
                    </div>

                    {!loading && bookings.length > 0 && (
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

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                isLoading={isDeleting}
                title={isBulkDeleting ? "Delete Selected Bookings" : "Delete Booking"}
                message={isBulkDeleting
                    ? `Are you sure you want to permanently remove ${selectedKeys === 'all' ? items.length : selectedKeys.size} selected bookings?`
                    : "Are you sure you want to permanently remove this booking record?"
                }
            />
        </div>
    );
}
