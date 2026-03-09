"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { deleteCar, deleteCars, fetchCars } from "@/store/slices/carsSlice";
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
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Pagination,
    Select,
    SelectItem,
    Divider,
    Tabs,
    Tab
} from "@heroui/react";
import { Car, Settings2, ShieldCheck, Plus, LayoutGrid, List, MoreVertical, Eye, Edit, Trash, MapPin, Fuel, Gauge, X, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AllVehiclesPage() {
    const { cars } = useAppSelector((state) => state.cars);
    const dispatch = useAppDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState("5");
    const [viewMode, setViewMode] = useState("table");
    const [selectedKeys, setSelectedKeys] = useState<any>(new Set([]));
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingVehicle, setDeletingVehicle] = useState<{ id: string, name: string } | null>(null);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const rows = parseInt(rowsPerPage);
    const totalPages = Math.ceil(cars.length / rows);
    const startIndex = (currentPage - 1) * rows;
    const paginatedCars = cars.slice(startIndex, startIndex + rows);

    useEffect(() => {
        dispatch(fetchCars());
    }, [dispatch]);

    const handleDeleteVehicle = (id: string, name: string) => {
        setDeletingVehicle({ id, name });
        setIsBulkDeleting(false);
        setIsDeleteModalOpen(true);
    };

    const handleBulkDelete = () => {
        setIsBulkDeleting(true);
        setDeletingVehicle(null);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            if (isBulkDeleting) {
                const ids = selectedKeys === "all"
                    ? paginatedCars.map(c => c.id)
                    : Array.from(selectedKeys) as string[];

                if (ids.length === 0) return;

                await dispatch(deleteCars(ids)).unwrap();
                setSelectedKeys(new Set([]));
                toast.success(`Successfully deleted ${ids.length} vehicles`);
            } else if (deletingVehicle) {
                await dispatch(deleteCar(deletingVehicle.id)).unwrap();
                toast.success(`Vehicle "${deletingVehicle.name}" deleted successfully`);
            }
            setIsDeleteModalOpen(false);
        } catch (error: any) {
            console.error("Delete error:", error);
            toast.error(error || "Failed to delete vehicle(s). This might be because the vehicle has active bookings.");
        } finally {
            setIsDeleting(false);
            setDeletingVehicle(null);
        }
    };

    const getStatusChip = (status?: string) => {
        const s = status?.toLowerCase() || "available";
        if (s.includes("available")) return <Chip variant="flat" color="success" size="sm">Available</Chip>;
        if (s.includes("rented")) return <Chip variant="flat" color="primary" size="sm">Rented</Chip>;
        return <Chip variant="flat" color="danger" size="sm">Maintenance</Chip>;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Fleet</h1>
                    <p className="text-small text-default-500">Inventory & deployment management</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Tabs
                        selectedKey={viewMode}
                        onSelectionChange={(key) => setViewMode(key as string)}
                        size="sm"
                        variant="solid"
                    >
                        <Tab key="table" title={<div className="flex items-center gap-2"><List size={14} /> Table</div>} />
                        <Tab key="cards" title={<div className="flex items-center gap-2"><LayoutGrid size={14} /> Cards</div>} />
                    </Tabs>
                    <Button
                        color="primary"
                        endContent={<Plus size={18} />}
                        as={Link}
                        href="/dashboard/vehicles/add"
                    >
                        Add Vehicle
                    </Button>
                </div>
            </div>

            {(selectedKeys === "all" || selectedKeys.size > 0) && (
                <Card className="bg-primary-50 border-primary-200">
                    <CardBody className="py-2 px-4 flex flex-row items-center justify-between">
                        <p className="text-sm font-medium text-primary-700">
                            {selectedKeys === "all" ? paginatedCars.length : selectedKeys.size} vehicles selected
                        </p>
                        <div className="flex gap-2">
                            <Button
                                color="danger"
                                size="sm"
                                variant="flat"
                                startContent={<Trash2 size={16} />}
                                onPress={handleBulkDelete}
                            >
                                Delete Selected
                            </Button>
                            <Button
                                size="sm"
                                variant="light"
                                startContent={<X size={16} />}
                                onPress={() => setSelectedKeys(new Set([]))}
                            >
                                Clear
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="flex items-center gap-3 pb-2">
                        <div className="p-2 bg-success-50 rounded-lg text-success">
                            <Car size={18} />
                        </div>
                        <div>
                            <p className="text-tiny text-default-400">Active Units</p>
                            <p className="text-xl font-bold">{cars.filter(c => c.status?.toLowerCase().includes("available")).length}</p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="py-2">
                        <p className="text-tiny text-default-400">Available for deployment</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className="flex items-center gap-3 pb-2">
                        <div className="p-2 bg-warning-50 rounded-lg text-warning">
                            <Settings2 size={18} />
                        </div>
                        <div>
                            <p className="text-tiny text-default-400">Offline Units</p>
                            <p className="text-xl font-bold">{cars.filter(c => c.status?.toLowerCase().includes("maintenance")).length}</p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="py-2">
                        <p className="text-tiny text-default-400">In maintenance / repair</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className="flex items-center gap-3 pb-2">
                        <div className="p-2 bg-primary-50 rounded-lg text-primary">
                            <ShieldCheck size={18} />
                        </div>
                        <div>
                            <p className="text-tiny text-default-400">Operational</p>
                            <p className="text-xl font-bold text-primary">100%</p>
                        </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="py-2">
                        <p className="text-tiny text-default-400">System integrity & readiness</p>
                    </CardBody>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
                    <div>
                        <p className="text-large font-bold">Fleet Directory</p>
                        <p className="text-small text-default-500">{cars.length} total vehicles registered</p>
                    </div>
                </CardHeader>
                <CardBody>
                    {viewMode === "table" ? (
                        <Table
                            aria-label="Fleet table"
                            removeWrapper
                            selectionMode="multiple"
                            selectedKeys={selectedKeys}
                            onSelectionChange={setSelectedKeys}
                        >
                            <TableHeader>
                                <TableColumn>Vehicle</TableColumn>
                                <TableColumn className="hidden sm:table-cell">Type</TableColumn>
                                <TableColumn>Status</TableColumn>
                                <TableColumn className="hidden md:table-cell">Location</TableColumn>
                                <TableColumn className="text-right hidden lg:table-cell">Daily Rate</TableColumn>
                                <TableColumn className="text-right">Actions</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent={<p className="py-8 text-default-400">No vehicles in inventory.</p>}>
                                {paginatedCars.map((car) => (
                                    <TableRow key={car.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-14 relative rounded-lg bg-default-100 overflow-hidden">
                                                    <Image src={car.img} alt={car.name} fill className="object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">{car.name}</p>
                                                    <p className="text-tiny text-default-400">{car.brand}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Chip variant="flat" size="sm">{car.type}</Chip>
                                        </TableCell>
                                        <TableCell>{getStatusChip(car.status)}</TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <p className="text-tiny text-default-500 flex items-center gap-1">
                                                <MapPin size={12} /> {car.location}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-right hidden lg:table-cell">
                                            <span className="font-semibold">{car.price} <span className="text-tiny text-default-400">/ day</span></span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Dropdown placement="bottom-end">
                                                <DropdownTrigger>
                                                    <Button isIconOnly variant="light" size="sm">
                                                        <MoreVertical size={18} />
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownMenu aria-label="Vehicle actions">
                                                    <DropdownItem key="view" startContent={<Eye size={16} />} href={`/dashboard/vehicles/${car.id}`} as={Link}>
                                                        View Details
                                                    </DropdownItem>
                                                    <DropdownItem key="edit" startContent={<Edit size={16} />} href={`/dashboard/vehicles/${car.id}/edit`} as={Link}>
                                                        Edit
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        key="delete"
                                                        color="danger"
                                                        className="text-danger"
                                                        startContent={<Trash size={16} />}
                                                        onPress={() => handleDeleteVehicle(car.id, car.name)}
                                                    >
                                                        Delete
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {paginatedCars.map((car) => (
                                <Card key={car.id} isPressable className="overflow-hidden">
                                    <div className="relative p-2">
                                        <div className="aspect-[4/3] rounded-lg overflow-hidden bg-default-100 relative">
                                            <Image src={car.img} alt={car.name} fill className="object-cover" />
                                        </div>
                                        <div className="absolute top-4 left-4">
                                            {getStatusChip(car.status)}
                                        </div>
                                    </div>
                                    <CardBody className="pt-1 gap-3">
                                        <div className="flex items-center justify-between">
                                            <Chip variant="flat" size="sm">{car.type}</Chip>
                                            <span className="text-lg font-bold text-primary">{car.price}</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg truncate">{car.name}</p>
                                            <p className="text-tiny text-default-400 flex items-center gap-1">
                                                <MapPin size={12} /> {car.location}
                                            </p>
                                        </div>
                                        <Divider />
                                        <div className="flex items-center justify-between text-default-400">
                                            <div className="flex flex-col items-center gap-0.5">
                                                <Fuel size={14} />
                                                <span className="text-[10px]">Petrol</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-0.5">
                                                <Gauge size={14} />
                                                <span className="text-[10px]">Auto</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-0.5">
                                                <Settings2 size={14} />
                                                <span className="text-[10px]">2024</span>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <Button variant="flat" size="sm" as={Link} href={`/dashboard/vehicles/${car.id}`}>
                                                Details
                                            </Button>
                                            <Dropdown placement="bottom-end">
                                                <DropdownTrigger>
                                                    <Button color="primary" size="sm">Manage</Button>
                                                </DropdownTrigger>
                                                <DropdownMenu aria-label="Vehicle management">
                                                    <DropdownItem key="edit" startContent={<Edit size={16} />} href={`/dashboard/vehicles/${car.id}/edit`} as={Link}>
                                                        Edit
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        key="delete"
                                                        color="danger"
                                                        className="text-danger"
                                                        startContent={<Trash size={16} />}
                                                        onPress={() => handleDeleteVehicle(car.id, car.name)}
                                                    >
                                                        Delete
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    )}

                    {cars.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                            <div className="flex items-center gap-3">
                                <span className="text-small text-default-500">Per page</span>
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
                                total={totalPages}
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
                title={isBulkDeleting ? "Delete Selected Vehicles" : "Delete Vehicle"}
                message={isBulkDeleting
                    ? `Are you sure you want to permanently remove ${selectedKeys === 'all' ? paginatedCars.length : selectedKeys.size} selected vehicles?`
                    : `Are you sure you want to permanently remove the vehicle "${deletingVehicle?.name}"?`
                }
            />
        </div>
    );
}
